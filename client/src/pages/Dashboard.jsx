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
  ArrowRight,
} from "lucide-react";
import InterviewModal from "../components/InterviewModal";
import ThemeToggle from "../components/ThemeToggle";

const lectures = [
  {
    id: "lecture_1",
    number: 1,
    title: "Introduction to Photosynthesis",
    duration: "13 min",
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

const totalMinutes = lectures.reduce((sum, l) => sum + parseInt(l.duration), 0);

const features = [
  {
    icon: CheckCircle2,
    title: "Spoiler-free answers",
    text: "The AI only uses what you've already watched.",
  },
  {
    icon: BookOpen,
    title: "Cited sources",
    text: "Every answer links to a video moment or PDF page.",
  },
  {
    icon: Brain,
    title: "Quiz & mock interview",
    text: "Turn watching into practice with instant feedback.",
  },
];

const LectureCard = ({ lecture, onWatch, actualProgress = 0 }) => {
  const isLocked = lecture.locked;
  const hasProgress = actualProgress > 0;
  const isCompleted = actualProgress >= 95;

  return (
    <div
      className={`group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all duration-300 ${
        isLocked
          ? "border-gray-200 dark:border-gray-800 opacity-70"
          : "border-gray-200 dark:border-gray-800 hover:border-[#3E3AF7]/50 hover:shadow-xl hover:shadow-[#3E3AF7]/10 hover:-translate-y-1 cursor-pointer"
      }`}
      onClick={() => !isLocked && onWatch(lecture.id)}
    >
      <div
        className={`h-1.5 w-full ${
          isLocked
            ? "bg-gray-200 dark:bg-gray-800"
            : "bg-gradient-to-r from-[#3E3AF7] to-indigo-500"
        }`}
      />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${
              isLocked
                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                : "bg-gradient-to-br from-[#3E3AF7] to-indigo-600 text-white shadow-lg shadow-[#3E3AF7]/25"
            }`}
          >
            {lecture.number}
          </div>
          {isLocked ? (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
              <Lock size={11} /> Coming soon
            </span>
          ) : isCompleted ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} /> Completed
            </span>
          ) : hasProgress ? (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <PlayCircle size={11} /> In Progress
            </span>
          ) : (
            <span className="text-xs text-[#3E3AF7] font-medium bg-[#3E3AF7]/10 px-2.5 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        <h3
          className={`text-lg font-bold mb-3 leading-snug ${
            isLocked
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {lecture.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {lecture.topics.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {t}
            </span>
          ))}
        </div>

        {hasProgress && (
          <div className="mb-4">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3E3AF7] to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${actualProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              {actualProgress}% completed
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
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
                <PlayCircle size={16} />
                {hasProgress && !isCompleted ? "Resume" : "Watch"}
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

  const unlockedLectures = lectures.filter((l) => !l.locked);
  const overall = unlockedLectures.length
    ? Math.round(
        unlockedLectures.reduce(
          (sum, l) => sum + Math.min(progressData[l.id] || 0, 100),
          0,
        ) / unlockedLectures.length,
      )
    : 0;
  const resumeLecture = unlockedLectures.find((l) => {
    const p = progressData[l.id] || 0;
    return p > 0 && p < 95;
  });
  const targetLecture = resumeLecture || unlockedLectures[0];

  const heroStats = [
    { label: "Lectures", value: lectures.length },
    { label: "Total time", value: `${totalMinutes} min` },
    { label: "Your progress", value: `${overall}%` },
  ];

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
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3E3AF7] to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg hover:opacity-80 transition ring-2 ring-white dark:ring-gray-900"
            >
              S
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-gradient-to-br from-[#3E3AF7] via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-[#3E3AF7]/25">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/15 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4 ring-1 ring-white/20">
                <Sparkles size={12} />
                <span>AI-Powered Learning</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight leading-tight">
                Master Photosynthesis with AI
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mb-7">
                Ask questions while watching. Get answers only from what you've
                already watched, with no spoilers.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => targetLecture && handleWatch(targetLecture.id)}
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition shadow-xl shadow-black/20"
                >
                  <PlayCircle size={18} />
                  {resumeLecture
                    ? `Resume Lecture ${resumeLecture.number}`
                    : "Start Learning"}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
                <span className="flex items-center gap-1.5 text-sm text-indigo-100">
                  <CheckCircle2 size={16} /> No Spoilers
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:w-80">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/15 backdrop-blur-sm ring-1 ring-white/20 rounded-2xl px-3 py-3 text-center"
                >
                  <p className="text-xl font-bold leading-none">{s.value}</p>
                  <p className="text-[11px] text-indigo-100 mt-1.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
            >
              <div className="w-9 h-9 rounded-xl bg-[#3E3AF7]/10 text-[#3E3AF7] flex items-center justify-center shrink-0">
                <f.icon size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {f.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Lectures
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {lectures.length} lectures • ~{totalMinutes} min total
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
