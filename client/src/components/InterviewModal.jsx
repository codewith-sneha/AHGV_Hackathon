import { useState, useRef, useEffect } from "react";
import {
  X,
  Loader2,
  Send,
  Brain,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import {
  interviewStart,
  interviewRespond,
  interviewFinish,
} from "../services/api";

const ScoreBar = ({ label, value = 0 }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </span>
      <span className="font-bold text-gray-800 dark:text-gray-100">
        {value}/100
      </span>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          value >= 75
            ? "bg-green-500"
            : value >= 50
              ? "bg-yellow-500"
              : "bg-red-400"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const Scorecard = ({ scorecard, onClose, onRetry }) => (
  <div className="flex flex-col h-full overflow-y-auto px-6 py-5">
    <div className="flex flex-col items-center mb-6">
      <div
        className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${
          scorecard.overall_score >= 75
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : scorecard.overall_score >= 50
              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
              : "border-red-400 bg-red-50 dark:bg-red-900/20"
        }`}
      >
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {scorecard.overall_score}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed max-w-xs">
        {scorecard.summary}
      </p>
    </div>

    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        Scores
      </p>
      <ScoreBar
        label="Technical Knowledge"
        value={scorecard.technical_knowledge}
      />
      <ScoreBar label="Communication" value={scorecard.communication} />
      <ScoreBar label="Problem Solving" value={scorecard.problem_solving} />
      <ScoreBar label="Answer Structure" value={scorecard.answer_structure} />
    </div>

    <div className="mb-4">
      <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
        ✅ Strengths
      </p>
      <ul className="space-y-1">
        {(scorecard.strengths || []).map((s, i) => (
          <li
            key={i}
            className="text-sm text-gray-700 dark:text-gray-300 flex gap-2"
          >
            <span className="text-green-500 mt-0.5 shrink-0">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="mb-4">
      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-2">
        ⚠️ Areas to Improve
      </p>
      <ul className="space-y-1">
        {(scorecard.improvements || []).map((s, i) => (
          <li
            key={i}
            className="text-sm text-gray-700 dark:text-gray-300 flex gap-2"
          >
            <span className="text-orange-400 mt-0.5 shrink-0">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="mb-5">
      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
        📚 Prep Recommendations
      </p>
      <ul className="space-y-1">
        {(scorecard.recommendations || []).map((s, i) => (
          <li
            key={i}
            className="text-sm text-gray-700 dark:text-gray-300 flex gap-2"
          >
            <span className="text-blue-400 mt-0.5 shrink-0">→</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex gap-3 mt-auto pt-2">
      <button
        onClick={onRetry}
        className="flex-1 py-2.5 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 rounded-xl text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
      >
        New Interview
      </button>
      <button
        onClick={onClose}
        className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
      >
        Close
      </button>
    </div>
  </div>
);

const SetupScreen = ({ onStart, loading }) => {
  const [config, setConfig] = useState({
    course: "Data Structures and Algorithms",
    skill_level: "intermediate",
    interview_type: "mixed",
    num_questions: 5,
    candidate_name: "",
  });

  const set = (k, v) => setConfig((c) => ({ ...c, [k]: v }));

  const inputClass =
    "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const optionClass = (active) =>
    `flex-1 py-1.5 rounded-lg text-xs font-semibold border transition capitalize ${
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
    }`;

  return (
    <div className="flex flex-col h-full px-6 py-5 overflow-y-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={18} className="text-blue-600" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            AI Mock Interview
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Practice with an AI that asks dynamic follow-up questions based on
          your answers.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
            Your Name (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Sneha"
            value={config.candidate_name}
            onChange={(e) => set("candidate_name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
            Topic / Course
          </label>
          <input
            type="text"
            value={config.course}
            onChange={(e) => set("course", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Skill Level
          </label>
          <div className="flex gap-2">
            {["beginner", "intermediate", "advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => set("skill_level", lvl)}
                className={optionClass(config.skill_level === lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Interview Type
          </label>
          <div className="flex gap-2">
            {["technical", "conceptual", "mixed"].map((t) => (
              <button
                key={t}
                onClick={() => set("interview_type", t)}
                className={optionClass(config.interview_type === t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Number of Questions:{" "}
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {config.num_questions}
            </span>
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={config.num_questions}
            onChange={(e) => set("num_questions", parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            <span>3 (quick)</span>
            <span>10 (thorough)</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(config)}
        disabled={loading}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Starting…
          </>
        ) : (
          <>
            <ChevronRight size={16} /> Start Interview
          </>
        )}
      </button>
    </div>
  );
};

const InterviewChat = ({ config, sessionId, firstQuestion, onFinish }) => {
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, currentQuestion]);

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;
    const myAnswer = answer.trim();
    const thisQuestion = currentQuestion;
    setAnswer("");
    setLoading(true);

    const updatedHistory = [
      ...history,
      { question: thisQuestion, answer: myAnswer },
    ];
    setHistory(updatedHistory);
    const newCount = questionsAnswered + 1;
    setQuestionsAnswered(newCount);

    try {
      if (newCount >= config.num_questions) {
        const result = await interviewFinish({
          history: updatedHistory,
          config,
        });
        onFinish(result.scorecard);
        return;
      }

      const resp = await interviewRespond({
        session_id: sessionId,
        history: updatedHistory,
        latest_answer: myAnswer,
        config,
        questions_asked: newCount,
      });

      if (resp.done || !resp.next_question) {
        const result = await interviewFinish({
          history: updatedHistory,
          config,
        });
        onFinish(result.scorecard);
      } else {
        setCurrentQuestion(resp.next_question);
      }
    } catch (err) {
      setCurrentQuestion(
        "⚠️ Error fetching next question. Please end the interview.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  const endEarly = async () => {
    if (history.length === 0) return;
    setLoading(true);
    try {
      const result = await interviewFinish({ history, config });
      onFinish(result.scorecard);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-1 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>
            Question {Math.min(questionsAnswered + 1, config.num_questions)} of{" "}
            {config.num_questions}
          </span>
          {history.length > 0 && (
            <button
              onClick={endEarly}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs underline"
            >
              End & Score
            </button>
          )}
        </div>
        <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${(questionsAnswered / config.num_questions) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {history.map((turn, i) => (
          <div key={i} className="space-y-2">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                <Brain size={13} className="text-blue-600" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 dark:text-gray-100 max-w-[85%]">
                {turn.question}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[85%]">
                {turn.answer}
              </div>
            </div>
          </div>
        ))}

        {!loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <Brain size={13} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 dark:text-gray-100 max-w-[85%]">
              {currentQuestion}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <Brain size={13} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={14} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            rows={3}
            disabled={loading}
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={submitAnswer}
            disabled={loading || !answer.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          ↵ Enter to submit answer
        </p>
      </div>
    </div>
  );
};

const InterviewModal = ({ onClose }) => {
  const [phase, setPhase] = useState("setup");
  const [config, setConfig] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [firstQuestion, setFirstQuestion] = useState("");
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async (cfg) => {
    setLoading(true);
    try {
      const resp = await interviewStart(cfg);
      setConfig(cfg);
      setSessionId(resp.session_id);
      setFirstQuestion(resp.first_question);
      setPhase("interview");
    } catch (err) {
      alert("Failed to start interview. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = (sc) => {
    setScorecard(sc);
    setPhase("scorecard");
  };

  const handleRetry = () => {
    setPhase("setup");
    setConfig(null);
    setSessionId(null);
    setFirstQuestion("");
    setScorecard(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col border border-transparent dark:border-gray-800"
        style={{ height: "min(90vh, 680px)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                AI Mock Interview
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {phase === "setup"
                  ? "Personalise your session"
                  : phase === "interview"
                    ? `${config?.course} · ${config?.skill_level}`
                    : "Your Scorecard"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {phase === "setup" && (
            <SetupScreen onStart={handleStart} loading={loading} />
          )}
          {phase === "interview" && (
            <InterviewChat
              config={config}
              sessionId={sessionId}
              firstQuestion={firstQuestion}
              onFinish={handleFinish}
            />
          )}
          {phase === "scorecard" && (
            <Scorecard
              scorecard={scorecard}
              onClose={onClose}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
