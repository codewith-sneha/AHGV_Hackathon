import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  FileText,
  Presentation,
  Lock,
  BookOpen,
  Clock,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import InterviewModal from "../components/InterviewModal";

const lectures = [
  {
    id: "lecture_1",
    number: 1,
    title: "Introduction to Photosynthesis",
    duration: "9 min",
    topics: ["What is Photosynthesis", "Chlorophyll", "Light Energy"],
    pdf: "Lecture1_Notes.pdf",
    ppt: "Lecture1_Slides.pptx",
    locked: false,
    progress: 0,
  },
  {
    id: "lecture_2",
    number: 2,
    title: "Light Reactions",
    duration: "12 min",
    topics: ["Thylakoid", "ATP Production", "Water Splitting"],
    pdf: "Lecture2_Notes.pdf",
    ppt: "Lecture2_Slides.pptx",
    locked: true,
    progress: 0,
  },
  {
    id: "lecture_3",
    number: 3,
    title: "Calvin Cycle",
    duration: "10 min",
    topics: ["Carbon Fixation", "G3P", "RuBisCO"],
    pdf: "Lecture3_Notes.pdf",
    ppt: "Lecture3_Slides.pptx",
    locked: true,
    progress: 0,
  },
  {
    id: "lecture_4",
    number: 4,
    title: "Factors Affecting Photosynthesis",
    duration: "8 min",
    topics: ["Light Intensity", "CO2 Levels", "Temperature"],
    pdf: "Lecture4_Notes.pdf",
    ppt: "Lecture4_Slides.pptx",
    locked: true,
    progress: 0,
  },
];

const LectureCard = ({ lecture, onWatch }) => {
  const isLocked = lecture.locked;
  const hasProgress = lecture.progress > 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300
        ${
          isLocked
            ? "border-gray-100 opacity-60"
            : "border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 cursor-pointer"
        }`}
      onClick={() => !isLocked && onWatch(lecture.id)}
    >
      {/* Top gradient bar */}
      <div
        className={`h-1.5 w-full ${isLocked ? "bg-gray-200" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isLocked
                ? "bg-gray-100 text-gray-500"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            Lecture {lecture.number}
          </span>
          {isLocked ? (
            <Lock size={14} className="text-gray-400" />
          ) : hasProgress ? (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} /> In Progress
            </span>
          ) : (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
              Available
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`font-semibold text-base mb-2 ${
            isLocked
              ? "text-gray-400"
              : "text-gray-800 group-hover:text-blue-700 transition-colors"
          }`}
        >
          {lecture.title}
        </h3>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lecture.topics.map((topic, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 rounded-full ${
                isLocked
                  ? "bg-gray-50 text-gray-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Materials */}
        <div className="flex gap-3 mb-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                "https://drive.google.com/file/d/1rebrqWGGo8WgYT3RqEYc8Ez0sQz3DLxh/preview",
                "_blank",
              );
            }}
            className={`flex items-center gap-1.5 text-xs hover:underline ${
              isLocked
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 cursor-pointer"
            }`}
          >
            <FileText size={13} />
            <span>{lecture.pdf}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs ${
              isLocked ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <Presentation size={13} />
            <span>{lecture.ppt}</span>
          </div>
        </div>

        {/* Progress bar (only if has progress) */}
        {hasProgress && !isLocked && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-blue-600">
                {lecture.progress}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${lecture.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={13} />
            <span>{lecture.duration}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              !isLocked && onWatch(lecture.id);
            }}
            disabled={isLocked}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isLocked
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm shadow-blue-500/20"
            }`}
          >
            {isLocked ? (
              <>
                <Lock size={14} /> Locked
              </>
            ) : (
              <>
                <PlayCircle size={16} /> Watch Lecture
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

  const handleWatch = (lectureId) => {
    navigate(`/lecture/${lectureId}`);
  };

  const availableCount = lectures.filter((l) => !l.locked).length;
  const totalCount = lectures.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {interviewOpen && (
        <InterviewModal onClose={() => setInterviewOpen(false)} />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen size={18} className="text-white" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <p className="text-xs text-gray-500 font-medium">
                BuildVerse LMS
              </p>
              <h1 className="text-sm font-semibold text-gray-800">
                Biology — Photosynthesis
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInterviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-blue-500/20"
            >
              <Brain size={15} />
              <span className="hidden sm:inline">Mock Interview</span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Student
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                S
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
              <Sparkles size={12} />
              <span>AI-Powered Learning</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Master Photosynthesis with your AI assistant
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl mb-6">
              Ask questions anytime while watching. The AI only answers from
              what you've already covered — no spoilers, ever.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleWatch("lecture_1")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition shadow-lg shadow-black/10"
              >
                <PlayCircle size={18} />
                Start Learning
              </button>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  {availableCount} of {totalCount} available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Course Modules</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {totalCount} lectures • {availableCount} available • AI-powered
            learning assistant included
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onWatch={handleWatch}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
