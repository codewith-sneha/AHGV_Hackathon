import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Presentation,
  PlayCircle,
  Loader2,
  BookOpen,
  HelpCircle,
  Lock,
  Sparkles,
} from "lucide-react";

import ChatPanel from "../components/ChatPanel";
import QuizModal from "../components/QuizModal";
import { useVideoTime } from "../hooks/useVideoTime";

const END_QUIZ_TRIGGER_RATIO = 0.98;
const QUIZ_UNLOCK_SECONDS_BEFORE_END = 90;

const lectureData = {
  lecture_1: {
    id: "L01",
    title: "Lecture 1: Introduction to Photosynthesis",
    description:
      "Learn what photosynthesis is, how plants use sunlight, and the role of chlorophyll.",
    pdf: "Lecture1_Notes.pdf",
    pdfEmbed:
      "https://drive.google.com/file/d/1rebrqWGGo8WgYT3RqEYc8Ez0sQz3DLxh/preview",
    pdfLocal: null,
    ppt: "Lecture1_Slides.pptx",
    duration: "13 min",
    quizResources: ["Photosynthesis — Study Notes.pdf"],
  },
};

const tabMeta = {
  video: { label: "Video", icon: PlayCircle },
  pdf: { label: "PDF Notes", icon: FileText },
  slides: { label: "Slides", icon: Presentation },
};

const LectureOverview = ({
  lecture,
  lectureId,
  onStart,
  loading,
  navigate,
}) => (
  <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300 overflow-hidden">
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#3E3AF7]/15 rounded-full blur-3xl" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

    <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#3E3AF7] to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-[#3E3AF7]/30">
          <BookOpen size={16} className="text-white" />
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Syntax Squad
          </p>
          <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Biology — Photosynthesis
          </h1>
        </div>
      </div>
    </header>

    <main className="relative flex-1 flex items-center justify-center px-6 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-[#3E3AF7]/10 max-w-lg w-full p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-[#3E3AF7]/10 text-[#3E3AF7] rounded-full">
          <PlayCircle size={12} />
          {lecture.duration}
        </span>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2 leading-snug">
          {lecture.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          {lecture.description}
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-5 space-y-3 border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Course Materials
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <FileText size={16} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {lecture.pdf}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PDF • Lecture Notes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Presentation size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {lecture.ppt}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PowerPoint • Slides
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-[#3E3AF7]/5 dark:bg-[#3E3AF7]/10 border border-[#3E3AF7]/20 rounded-2xl p-4 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3E3AF7] to-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-[#3E3AF7] dark:text-blue-300 font-semibold mb-0.5">
              AI Learning Assistant Enabled
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Pause anytime and ask questions. The AI will only answer from
              content you've watched so far.
            </p>
          </div>
        </div>

        <button
          onClick={() => onStart(lectureId)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3E3AF7] to-indigo-600 hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-[#3E3AF7]/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Preparing your
              session...
            </>
          ) : (
            <>
              <PlayCircle size={20} /> Start Learning
            </>
          )}
        </button>
      </div>
    </main>
  </div>
);

const LecturePlayer = ({ lectureId, lecture, navigate }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { currentTime, formattedTime, seekTo, pauseAndGetTime } =
    useVideoTime(playerRef);
  const [activeTab, setActiveTab] = useState("video");
  const [activePdfPage, setActivePdfPage] = useState(1);

  const [quizOpen, setQuizOpen] = useState(false);
  const [quizShown, setQuizShown] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);

  const initPlayer = (el) => {
    if (!el) return;
    videoRef.current = el;
    playerRef.current = {
      currentTime: (t) => {
        if (!el) return 0;
        if (t !== undefined) el.currentTime = t;
        return el.currentTime;
      },
      pause: () => el.pause(),
      play: () => el.play(),
      isDisposed: () => false,
    };
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > 0 && video.duration) {
        const percent = Math.round((video.currentTime / video.duration) * 100);
        const savedProgress = JSON.parse(
          localStorage.getItem("lectureProgress") || "{}",
        );
        if (!savedProgress[lectureId] || percent > savedProgress[lectureId]) {
          savedProgress[lectureId] = percent;
          localStorage.setItem(
            "lectureProgress",
            JSON.stringify(savedProgress),
          );
        }
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [lectureId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkUnlock = () => {
      const d = video.duration;
      if (!d || isNaN(d)) return;
      if (
        video.ended ||
        d - video.currentTime <= QUIZ_UNLOCK_SECONDS_BEFORE_END
      ) {
        setQuizUnlocked(true);
      }
    };

    video.addEventListener("timeupdate", checkUnlock);
    video.addEventListener("ended", checkUnlock);
    return () => {
      video.removeEventListener("timeupdate", checkUnlock);
      video.removeEventListener("ended", checkUnlock);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (quizShown || quizOpen) return;
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;

      if (video.currentTime / duration >= END_QUIZ_TRIGGER_RATIO) {
        setQuizShown(true);
        video.pause();
        setQuizOpen(true);
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [quizShown, quizOpen]);

  const openQuiz = () => {
    if (!quizUnlocked || quizOpen) return;
    videoRef.current?.pause();
    setQuizOpen(true);
  };

  const handleQuizClose = () => {
    setQuizOpen(false);
    const video = videoRef.current;
    if (activeTab === "video" && video && !video.ended) {
      video.play()?.catch(() => {});
    }
  };

  const switchTab = (tab) => {
    if (tab !== "video") videoRef.current?.pause();
    setActiveTab(tab);
  };

  const handlePdfCitation = (page) => {
    videoRef.current?.pause();
    setActivePdfPage(page || 1);
    setActiveTab("pdf");
  };

  const handleSeek = (seconds) => {
    setActiveTab("video");
    seekTo(seconds);
  };

  const handleReview = (citation) => {
    setQuizOpen(false);
    const isVideo = citation.kind === "video" || citation.kind === "audio";
    if (isVideo && citation.seek_to != null) {
      handleSeek(citation.seek_to);
      videoRef.current?.play()?.catch(() => {});
    } else {
      handlePdfCitation(citation.page || 1);
    }
  };

  const pdfSrc = lecture.pdfLocal
    ? `${lecture.pdfLocal}#page=${activePdfPage}`
    : `${lecture.pdfEmbed}?rm=minimal&pg=PA${activePdfPage}`;

  return (
    <div
      className="flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300"
      style={{ height: "100dvh" }}
    >
      {quizOpen && (
        <QuizModal
          videoId={lecture.id}
          allowedResources={lecture.quizResources}
          getPauseTime={() => videoRef.current?.duration || 0}
          onClose={handleQuizClose}
          onReview={handleReview}
        />
      )}

      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 bg-gradient-to-br from-[#3E3AF7] to-indigo-600 rounded-md flex items-center justify-center shrink-0 shadow-md shadow-[#3E3AF7]/30">
              <BookOpen size={12} className="text-white" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
              {lecture.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openQuiz}
            disabled={!quizUnlocked}
            title={
              quizUnlocked
                ? "Take the quiz"
                : "Quiz unlocks in the last 90 seconds of the video"
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              quizUnlocked
                ? "bg-[#3E3AF7] hover:bg-[#3230d6] text-white shadow-lg shadow-[#3E3AF7]/30 ring-2 ring-[#3E3AF7]/40"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {quizUnlocked ? <HelpCircle size={13} /> : <Lock size={13} />}
            Quiz
          </button>
          <div className="flex items-center gap-1.5 bg-gray-900 dark:bg-gray-800 text-white px-2.5 py-1.5 rounded-full text-xs font-mono ring-1 ring-white/10">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {formattedTime}
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        <div className="lg:w-[70%] w-full flex flex-col lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 shrink-0 lg:shrink lg:min-h-0">
          <div className="hidden lg:flex gap-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 pt-2 shrink-0">
            {["video", "pdf", "slides"].map((tab) => {
              const Icon = tabMeta[tab].icon;
              return (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition ${
                    activeTab === tab
                      ? "border-[#3E3AF7] text-[#3E3AF7] bg-[#3E3AF7]/5"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <Icon size={15} />
                  {tabMeta[tab].label}
                </button>
              );
            })}
          </div>

          <div
            className={`w-full shrink-0 bg-black lg:flex-1 lg:min-h-0 lg:flex lg:items-center lg:justify-center ${
              activeTab !== "video" ? "lg:hidden" : ""
            }`}
          >
            <video
              ref={initPlayer}
              src="/lecture.mp4"
              controls
              playsInline
              className="w-full max-h-[30vh] lg:max-h-full lg:h-full object-contain"
            />
          </div>

          {activeTab === "video" && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
              <Sparkles size={14} className="text-[#3E3AF7] shrink-0" />
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {lecture.title}
                </span>{" "}
                — Pause anytime and ask a question. Answers only use what you've
                watched.
              </p>
            </div>
          )}

          {activeTab === "pdf" && (
            <div className="hidden lg:flex flex-col flex-1 min-h-0 bg-gray-100 dark:bg-gray-900">
              <div className="flex items-center justify-between gap-3 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2 text-xs min-w-0">
                  <FileText size={14} className="text-red-500 shrink-0" />
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {lecture.pdf}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#3E3AF7]/10 text-[#3E3AF7] font-semibold shrink-0">
                    Page {activePdfPage}
                  </span>
                </div>
                <button
                  onClick={() => switchTab("video")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-xs font-semibold transition shrink-0"
                >
                  <PlayCircle size={13} /> Back to video
                </button>
              </div>
              <iframe
                key={pdfSrc}
                src={pdfSrc}
                className="flex-1 w-full min-h-0 border-0"
                title="PDF Notes"
                allow="autoplay"
              />
            </div>
          )}

          {activeTab === "slides" && (
            <div className="hidden lg:flex flex-col flex-1 min-h-0 items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                <Presentation size={26} className="text-orange-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lecture.ppt}
              </p>
              <button
                onClick={() => switchTab("video")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-xs font-semibold transition"
              >
                <PlayCircle size={13} /> Back to video
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-[30%] w-full flex flex-col overflow-hidden shrink-0 lg:shrink lg:min-h-0 flex-1 lg:flex-none bg-white dark:bg-gray-900">
          <ChatPanel
            lectureId={lecture.id || lectureId}
            currentTime={currentTime}
            formattedTime={formattedTime}
            pauseAndGetTime={pauseAndGetTime}
            seekTo={handleSeek}
            onPdfCitation={handlePdfCitation}
          />
        </div>
      </div>
    </div>
  );
};

const LecturePage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [sessionReady, setSessionReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const lecture = lectureData[lectureId];

  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Lecture not found.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-[#3E3AF7] hover:underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStart = async (id) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSessionReady(true);
    } catch (err) {
      alert("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <LectureOverview
        lecture={lecture}
        lectureId={lectureId}
        onStart={handleStart}
        loading={loading}
        navigate={navigate}
      />
    );
  }

  return (
    <LecturePlayer
      lectureId={lectureId}
      lecture={lecture}
      navigate={navigate}
    />
  );
};

export default LecturePage;
