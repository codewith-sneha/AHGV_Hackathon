import { useState, useRef, useEffect, Children, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Bot,
  User,
  Brain,
  PlayCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { mockQuery } from "../services/mockApi";
import { queryAssistant } from "../services/api";
import InterviewModal from "./InterviewModal";

const USE_MOCK = false;

const QUICK_CHIPS = [
  "Summarize what I learned so far",
  "Explain the last 2 minutes",
];

const BUBBLE_STYLES = {
  normal: {
    box: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-transparent",
    label: null,
  },
  future: {
    box: "bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700",
    label: "⏳ Not covered yet",
  },
  offtopic: {
    box: "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-700",
    label: "🚫 Out of syllabus",
  },
};

const getKind = (msg) => {
  const tag = `${msg.type ?? ""} ${msg.intent ?? ""}`.toLowerCase();
  if (/off[_\s-]?topic|out[_\s-]?of[_\s-]?(scope|syllabus)/.test(tag))
    return "offtopic";
  if (/future|not[_\s-]?covered|spoiler/.test(tag)) return "future";
  if (msg.refused) {
    return /not (been )?covered|yet|upcoming|later/i.test(msg.content || "")
      ? "future"
      : "offtopic";
  }
  return "normal";
};

const parseTimestamp = (str) => {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
};

const SourceCards = ({ citations, seekTo, onPdfCitation }) => {
  if (!Array.isArray(citations) || citations.length === 0) return null;

  const videoCitations = citations.filter(
    (c) => c.kind === "video" || c.kind === "audio",
  );
  const slideCitations = citations
    .filter((c) =>
      ["ppt", "pptx", "slides", "pdf", "pdf_notes", "text"].includes(c.kind),
    )
    .filter(
      (c, i, arr) =>
        arr.findIndex((x) => x.page === c.page && x.source === c.source) === i,
    );

  if (videoCitations.length === 0 && slideCitations.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {videoCitations.map((c, i) => (
        <button
          key={`v-${i}`}
          onClick={() => seekTo && c.seek_to != null && seekTo(c.seek_to)}
          className="w-full flex items-start gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl text-left transition group shadow-sm"
        >
          <PlayCircle
            size={15}
            className="text-blue-500 mt-0.5 flex-shrink-0 group-hover:text-blue-700 dark:group-hover:text-blue-300"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              ▶ Video — {c.label}
            </p>
            {c.snippet && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                “{c.snippet}”
              </p>
            )}
          </div>
        </button>
      ))}

      {slideCitations.map((c, i) => (
        <div
          key={`s-${i}`}
          onClick={() => onPdfCitation && c.page && onPdfCitation(c.page)}
          className="flex items-start gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition shadow-sm"
        >
          <FileText
            size={15}
            className="text-purple-500 mt-0.5 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              {c.kind === "pdf" || c.kind === "pdf_notes"
                ? "📄 PDF"
                : "📑 Slides"}{" "}
              — {c.label}
            </p>
            {c.snippet && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-3">
                “{c.snippet}”
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatPanel = ({
  lectureId,
  currentTime,
  formattedTime,
  pauseAndGetTime,
  seekTo,
  onPdfCitation,
}) => {
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 Hi! I'm your AI Learning Assistant.\n\nPause the video anytime and ask me a question. I'll only answer from content you've **already watched**.\n\nTry the quick actions below to get started!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (question) => {
    if (!question.trim() || loading) return;
    const lockedTime = pauseAndGetTime();

    const userTurn = { role: "user", content: question };
    const newHistory = [...history, userTurn];

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      if (USE_MOCK) {
        const data = await mockQuery(question, lectureId, lockedTime);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            type: data.type,
          },
        ]);
      } else {
        const data = await queryAssistant(
          question,
          lectureId,
          lockedTime,
          newHistory,
        );
        const answer =
          typeof data?.answer === "string" && data.answer.trim()
            ? data.answer
            : "⚠️ I couldn't generate an answer. Please try again.";
        setHistory([...newHistory, { role: "assistant", content: answer }]);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
            citations: Array.isArray(data?.citations) ? data.citations : [],
            intent: data?.intent,
            refused: data?.refused,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const processInline = (text, citations) => {
    const result = [];
    const re = /\[(\d{1,2}:\d{2})\]|\[(\d+)\]/g;
    let last = 0,
      m,
      key = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) result.push(text.slice(last, m.index));
      if (m[1]) {
        const timeStr = m[1];
        const seconds = parseTimestamp(timeStr);
        result.push(
          <button
            key={`ts-${key++}`}
            onClick={() => seekTo(seconds)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/60 transition mx-0.5"
          >
            ▶ {timeStr}
          </button>,
        );
      } else {
        const num = parseInt(m[2]);
        const citation =
          citations.find((c) => c.n === num) || citations[num - 1];
        const isVideo =
          citation && (citation.kind === "video" || citation.kind === "audio");
        result.push(
          <span key={`cit-${key++}`} className="relative group inline-block">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-[#3E3AF7] text-white rounded-full text-xs font-bold cursor-pointer hover:bg-[#3230d6] mx-0.5 align-middle">
              {num}
            </span>
            {citation && (
              <span className="absolute bottom-5 left-0 z-50 hidden group-hover:flex flex-col w-64 max-w-[70vw] bg-gray-900 dark:bg-black dark:border dark:border-gray-700 text-white text-xs rounded-lg p-3 shadow-xl">
                <span className="font-semibold mb-1">
                  {isVideo ? "📍 Video" : "📄 PDF"} —{" "}
                  {citation.label || citation.source}
                </span>
                {citation.snippet && (
                  <span className="text-gray-300">
                    {citation.snippet.slice(0, 120)}…
                  </span>
                )}
                {isVideo && citation.seek_to != null && (
                  <button
                    onClick={() => seekTo(citation.seek_to)}
                    className="mt-2 text-blue-300 hover:text-blue-100 text-xs underline text-left"
                  >
                    ▶ Jump to {citation.label}
                  </button>
                )}
                {!isVideo && citation.page && (
                  <span className="mt-1 text-gray-400">
                    Page {citation.page}
                  </span>
                )}
                {!isVideo && onPdfCitation && (
                  <button
                    onClick={() => onPdfCitation(citation.page || 1)}
                    className="mt-1 text-blue-300 hover:text-blue-100 text-xs underline text-left"
                  >
                    📄 Open PDF notes
                  </button>
                )}
              </span>
            )}
          </span>,
        );
      }
      last = m.index + m[0].length;
    }
    if (last < text.length) result.push(text.slice(last));
    return result;
  };

  const flatMapChildren = (children, citations) =>
    Children.map(children, (child, i) =>
      typeof child === "string" ? (
        <Fragment key={i}>{processInline(child, citations)}</Fragment>
      ) : (
        child
      ),
    );

  const renderContent = (content, citations = []) => {
    return (
      <div className="text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ node, children, ...props }) => (
              <p className="mb-2 last:mb-0" {...props}>
                {flatMapChildren(children, citations)}
              </p>
            ),
            ul: ({ node, children }) => (
              <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
            ),
            ol: ({ node, children }) => (
              <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
            ),
            li: ({ node, children, ...props }) => (
              <li {...props}>{flatMapChildren(children, citations)}</li>
            ),
            strong: ({ node, children, ...props }) => (
              <strong {...props}>{flatMapChildren(children, citations)}</strong>
            ),
            em: ({ node, children, ...props }) => (
              <em {...props}>{flatMapChildren(children, citations)}</em>
            ),
          }}
        >
          {content || ""}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      {interviewOpen && (
        <InterviewModal onClose={() => setInterviewOpen(false)} />
      )}

      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3E3AF7] to-indigo-600 flex items-center justify-center shadow-md shadow-[#3E3AF7]/30 shrink-0">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                AI Learning Assistant
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    loading ? "bg-amber-400 animate-pulse" : "bg-green-500"
                  }`}
                />
                {loading
                  ? "Thinking..."
                  : `Knows up to ${formattedTime || "0:00"}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setInterviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#3E3AF7] hover:bg-[#3230d6] text-white rounded-lg text-xs font-semibold transition shadow-md shadow-[#3E3AF7]/20 shrink-0"
            title="Start AI Mock Interview"
          >
            <Brain size={12} />
            <span className="hidden sm:inline">Interview</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/60 dark:bg-gray-950/40">
        {messages.map((msg, i) => {
          const style =
            BUBBLE_STYLES[msg.role === "user" ? "normal" : getKind(msg)];
          return (
            <div
              key={i}
              className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3E3AF7] to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div className="max-w-[85%] min-w-0">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#3E3AF7] to-indigo-600 text-white rounded-tr-sm shadow-md shadow-[#3E3AF7]/20"
                      : `${style.box} rounded-tl-sm shadow-sm`
                  }`}
                >
                  {msg.role === "assistant" && style.label && (
                    <p className="text-xs font-bold mb-1">{style.label}</p>
                  )}
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  ) : (
                    renderContent(msg.content, msg.citations || [])
                  )}
                </div>
                {msg.role === "assistant" && (
                  <SourceCards
                    citations={msg.citations}
                    seekTo={seekTo}
                    onPdfCitation={onPdfCitation}
                  />
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User
                    size={14}
                    className="text-gray-700 dark:text-gray-200"
                  />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2 justify-start animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3E3AF7] to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 shadow-sm">
              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pt-3 pb-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
        {QUICK_CHIPS.map((chip, i) => (
          <button
            key={i}
            onClick={() => sendMessage(chip)}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#3E3AF7]/30 text-[#3E3AF7] dark:text-blue-300 dark:border-blue-800 bg-[#3E3AF7]/5 dark:bg-blue-900/20 hover:bg-[#3E3AF7]/10 dark:hover:bg-blue-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={11} />
            {chip}
          </button>
        ))}
      </div>

      <div className="px-4 pt-2 pb-3">
        <div className="flex items-end gap-2 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-[#3E3AF7]/40 focus-within:border-[#3E3AF7] transition">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about what you've watched..."
            rows={2}
            disabled={loading}
            className="flex-1 resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm focus:outline-none disabled:opacity-50 max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-gradient-to-br from-[#3E3AF7] to-indigo-600 text-white rounded-xl shadow-md shadow-[#3E3AF7]/30 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">
          ↵ Enter to send • Video auto-pauses on send
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
