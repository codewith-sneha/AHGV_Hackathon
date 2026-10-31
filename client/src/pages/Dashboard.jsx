import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Brain,
} from "lucide-react";
import InterviewModal from "../components/InterviewModal";
import ThemeToggle from "../components/ThemeToggle";

const lectures = [
  {
    id: "lecture_1",
    number: 1,
    title: "Introduction to Photosynthesis",
    duration: "9 min",
    topics: ["What is Photosynthesis", "Chlorophyll", "Light Energy"],
    locked: false,
  },
  {
    id: "lecture_2",
    number: 2,
    title: "Light Reactions",
    duration: "12 min",
    topics: ["Thylakoid", "ATP Production", "Water Splitting"],
    locked: true,
  },
  {
    id: "lecture_3",
    number: 3,
    title: "Calvin Cycle",
    duration: "10 min",
    topics: ["Carbon Fixation", "G3P", "RuBisCO"],
    locked: true,
  },
  {
    id: "lecture_4",
    number: 4,
    title: "Factors Affecting Photosynthesis",
    duration: "8 min",
    topics: ["Light Intensity", "CO2 Levels", "Temperature"],
    locked: true,
  },
];

const LectureCard = ({ lecture, onWatch, actualProgress = 0 }) => {
  const isLocked = lecture.locked;
  const hasProgress = actualProgress > 0;
  const isCompleted = actualProgress >= 95;

  return (
    <div
      className={`group relative bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all duration-300 ${
        isLocked
          ? "border-gray-200 dark:border-gray-800 opacity-60"
          : "border-gray-200 dark:border-gray-800 hover:border-[#3E3AF7]/50 hover:shadow-xl hover:shadow-[#3E3AF7]/10 hover:-translate-y-1 cursor-pointer"
      }`}
      onClick={() => !isLocked && onWatch(lecture.id)}
    >
      <div
        className={`h-1.5 w-full ${isLocked ? "bg-gray-200 dark:bg-gray-800" : "bg-gradient-to-r from-[#3E3AF7] to-indigo-500"}`}
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isLocked
                ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                : "bg-[#3E3AF7]/10 text-[#3E3AF7]"
            }`}
          >
            Lecture {lecture.number}
          </span>
          {isLocked ? (
            <Lock size={14} className="text-gray-400 dark:text-gray-600" />
          ) : isCompleted ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} /> Completed
            </span>
          ) : hasProgress ? (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <PlayCircle size={11} /> In Progress
            </span>
          ) : (
            <span className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>

        <h3
          className={`text-lg font-bold mb-1 ${isLocked ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
        >
          {lecture.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {lecture.topics.join(" • ")}
        </p>

        {hasProgress && (
          <div className="mb-4">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3E3AF7] to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${actualProgress}%` }}
              />
            </div>

            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              {actualProgress}% completed
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={13} />
            <span>{lecture.duration}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onWatch(lecture.id);
            }}
            disabled={isLocked}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isLocked
                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                : "bg-[#3E3AF7] text-white hover:bg-[#3230d6] shadow-lg shadow-[#3E3AF7]/20"
            }`}
          >
            {isLocked ? (
              <>
                <Lock size={14} /> Locked
              </>
            ) : (
              <>
                <PlayCircle size={16} /> Watch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [progressData, setProgressData] = useState({});

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") !== "light",
  );

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("lectureProgress") || "{}");
    setProgressData(saved);
  }, []);

  const handleWatch = (lectureId) => {
    navigate(`/lecture/${lectureId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {interviewOpen && (
        <InterviewModal onClose={() => setInterviewOpen(false)} />
      )}

      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#3E3AF7] to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#3E3AF7]/30">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Syntax Squad
              </p>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                AI Learning Assistant
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <button
              onClick={() => setInterviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#3E3AF7] hover:bg-[#3230d6] text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-[#3E3AF7]/20"
            >
              <Brain size={15} />
              <span className="hidden sm:inline">Mock Interview</span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3E3AF7] to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg hover:opacity-80 transition"
            >
              S
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="bg-gradient-to-br from-[#3E3AF7] via-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-[#3E3AF7]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
              <Sparkles size={12} />
              <span>AI-Powered Learning</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
              Master Photosynthesis with AI
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mb-6">
              Ask questions while watching. Get answers only from what you've
              already watched — no spoilers.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleWatch("lecture_1")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition shadow-xl shadow-black/20"
              >
                <PlayCircle size={18} />
                Start Learning
              </button>
              <div className="flex items-center gap-4 text-sm text-indigo-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> No Spoilers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Lectures
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              4 lectures • ~40 min total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {lectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              actualProgress={progressData[lecture.id] || 0}
              onWatch={handleWatch}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
