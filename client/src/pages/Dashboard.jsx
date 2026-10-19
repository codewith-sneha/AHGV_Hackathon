import { useNavigate } from 'react-router-dom'
import { PlayCircle, FileText, Presentation, Lock, BookOpen, Clock } from 'lucide-react'

const lectures = [
  {
    id: 'lecture_1',
    number: 1,
    title: 'Introduction to Photosynthesis',
    duration: '9 min',
    topics: ['What is Photosynthesis', 'Chlorophyll', 'Light Energy'],
    pdf: 'Lecture1_Notes.pdf',
    ppt: 'Lecture1_Slides.pptx',
    locked: false,
  },
  {
    id: 'lecture_2',
    number: 2,
    title: 'Light Reactions',
    duration: '12 min',
    topics: ['Thylakoid', 'ATP Production', 'Water Splitting'],
    pdf: 'Lecture2_Notes.pdf',
    ppt: 'Lecture2_Slides.pptx',
    locked: true,
  },
  {
    id: 'lecture_3',
    number: 3,
    title: 'Calvin Cycle',
    duration: '10 min',
    topics: ['Carbon Fixation', 'G3P', 'RuBisCO'],
    pdf: 'Lecture3_Notes.pdf',
    ppt: 'Lecture3_Slides.pptx',
    locked: true,
  },
  {
    id: 'lecture_4',
    number: 4,
    title: 'Factors Affecting Photosynthesis',
    duration: '8 min',
    topics: ['Light Intensity', 'CO2 Levels', 'Temperature'],
    pdf: 'Lecture4_Notes.pdf',
    ppt: 'Lecture4_Slides.pptx',
    locked: true,
  },
]

const LectureCard = ({ lecture, onWatch }) => {
  const isLocked = lecture.locked

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
      isLocked
        ? 'border-gray-100 opacity-60'
        : 'border-blue-100 hover:shadow-md hover:-translate-y-0.5'
    }`}>

      {/* Card Top Color Bar */}
      <div className={`h-1.5 w-full ${isLocked ? 'bg-gray-200' : 'bg-blue-500'}`} />

      <div className="p-5">

        {/* Lecture Number + Lock */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isLocked ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'
          }`}>
            Lecture {lecture.number}
          </span>
          {isLocked
            ? <Lock size={14} className="text-gray-400" />
            : <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Available</span>
          }
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-base mb-2 ${
          isLocked ? 'text-gray-400' : 'text-gray-800'
        }`}>
          {lecture.title}
        </h3>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lecture.topics.map((topic, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
              isLocked ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              {topic}
            </span>
          ))}
        </div>

        {/* Files */}
        <div className="flex gap-3 mb-4">
          <div
  onClick={() => window.open(`/${lecture.pdf}`, '_blank')}
  className={`flex items-center gap-1.5 text-xs cursor-pointer hover:underline ${
    isLocked ? 'text-gray-400' : 'text-gray-500'
  }`}
>
  <FileText size={13} />
  <span>{lecture.pdf}</span>
</div>
          <div className={`flex items-center gap-1.5 text-xs ${
            isLocked ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Presentation size={13} />
            <span>{lecture.ppt}</span>
          </div>
        </div>

        {/* Duration + Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={13} />
            <span>{lecture.duration}</span>
          </div>

          <button
            onClick={() => !isLocked && onWatch(lecture.id)}
            disabled={isLocked}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isLocked
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {isLocked
              ? <><Lock size={14} /> Locked</>
              : <><PlayCircle size={16} /> Watch Lecture</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()

  const handleWatch = (lectureId) => {
    navigate(`/lecture/${lectureId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div  className="cursor-pointer" onClick={() => navigate('/')}>
              <p className="text-xs text-gray-500">BuildVerse LMS</p>
             <h1 className="text-sm font-semibold text-gray-800">Biology — Photosynthesis</h1>
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-gray-600">Student</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              S
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
          <p className="text-gray-500 mt-1 text-sm">
            4 lectures • 1 available • AI-powered learning assistant included
          </p>
        </div>

        {/* Lecture Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {lectures.map(lecture => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onWatch={handleWatch}
            />
          ))}
        </div>

      </main>
    </div>
  )
}

export default Dashboard