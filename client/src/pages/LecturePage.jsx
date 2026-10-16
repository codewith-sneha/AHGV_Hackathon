import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Presentation, PlayCircle, Loader2, BookOpen } from 'lucide-react'
import VideoPlayer from '../components/VideoPlayer'
import ChatPanel from '../components/ChatPanel'
import { useVideoTime } from '../hooks/useVideoTime'
import { mockIngest } from '../services/mockApi'
import { ingestLecture } from '../services/api'

const USE_MOCK = true

const lectureData = {
  lecture_1: {
    title: 'Lecture 1: Introduction to Data Structures',
    description: 'Learn about fundamental data structures, arrays, linked lists and memory allocation.',
    pdf: 'Lecture1_notes.pdf',
    ppt: 'Lecture1_Slides.pptx',
    duration: '42 min',
  },
  lecture_4: {
    title: 'Lecture 4: Binary Search Trees',
    description: 'Learn about BST properties, insertion, deletion and search operations.',
    pdf: 'Lecture4_Notes.pdf',
    ppt: 'Lecture4_Slides.pptx',
    duration: '47 min',
  }
}

// ── State 1: Course Overview ──────────────────────────────
const LectureOverview = ({ lecture, lectureId, onStart, loading, navigate }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <p className="text-xs text-gray-500">BuildVerse LMS</p>
          <h1 className="text-sm font-semibold text-gray-800">Data Structures & Algorithms</h1>
        </div>
      </div>
    </header>

    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg w-full p-8">

        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
          {lecture.duration}
        </span>

        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          {lecture.title}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {lecture.description}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Course Materials
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <FileText size={15} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{lecture.pdf}</p>
              <p className="text-xs text-gray-400">PDF • Lecture Notes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Presentation size={15} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{lecture.ppt}</p>
              <p className="text-xs text-gray-400">PowerPoint • Slides</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-blue-700 font-medium mb-1">
            🤖 AI Learning Assistant Enabled
          </p>
          <p className="text-xs text-blue-600">
            Pause anytime and ask questions. The AI will only answer from content you've watched so far.
          </p>
        </div>

        <button
          onClick={() => onStart(lectureId)}
          disabled={loading}
          className="w-full cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Preparing your session...</>
          ) : (
            <><PlayCircle size={20} /> Start Learning</>
          )}
        </button>
      </div>
    </main>
  </div>
)

// ── State 2: Player + Chat ────────────────────────────────
const LecturePlayer = ({ lectureId, lecture, onBack, navigate }) => {
  const playerRef = useRef(null)
  const { currentTime, formattedTime, seekTo, pauseAndGetTime } = useVideoTime(playerRef)
  const [activeTab, setActiveTab] = useState('video')

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <BookOpen size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{lecture.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-mono">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          {formattedTime}
        </div>
      </header>

      {/* Split Screen */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* LEFT — Video */}
        <div className="lg:w-[70%] w-full flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">

          <div className="w-full bg-black">
            <VideoPlayer playerRef={playerRef} />
          </div>

          <div className="bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex border-b border-gray-200 px-4">
              {['video', 'pdf', 'slides'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'pdf' ? '📄 PDF Notes' : tab === 'slides' ? '📊 Slides' : '🎬 Video'}
                </button>
              ))}
            </div>

            <div className="p-4 h-28 overflow-y-auto">
              {activeTab === 'video' && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Current Position:</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-blue-700">{formattedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Lecture:</span>
                    <span>{lecture.title}</span>
                  </div>
                </div>
              )}
              {activeTab === 'pdf' && (
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{lecture.pdf}</p>
                    <p className="text-xs text-gray-400 mt-0.5">PDF preview available when backend is connected.</p>
                  </div>
                </div>
              )}
              {activeTab === 'slides' && (
                <div className="flex items-center gap-3">
                  <Presentation size={20} className="text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{lecture.ppt}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Slide preview available when backend is connected.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Chat */}
        <div className="lg:w-[30%] w-full flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
          <ChatPanel
            lectureId={lectureId}
            currentTime={currentTime}
            formattedTime={formattedTime}
            pauseAndGetTime={pauseAndGetTime}
            seekTo={seekTo}
          />
        </div>

      </div>
    </div>
  )
}

// ── Main Page Component ───────────────────────────────────
const LecturePage = () => {
  const { lectureId } = useParams()
  const navigate = useNavigate()
  const [sessionReady, setSessionReady] = useState(false)
  const [loading, setLoading] = useState(false)

  const lecture = lectureData[lectureId]

  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Lecture not found.</p>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleStart = async (id) => {
    setLoading(true)
    try {
      if (USE_MOCK) {
        await mockIngest(id)
      } else {
        await ingestLecture(id)
      }
      setSessionReady(true)
    } catch (err) {
      alert('Failed to start session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionReady) {
    return (
      <LectureOverview
        lecture={lecture}
        lectureId={lectureId}
        onStart={handleStart}
        loading={loading}
        navigate={navigate}
      />
    )
  }

  return (
    <LecturePlayer
      lectureId={lectureId}
      lecture={lecture}
      onBack={() => setSessionReady(false)}
      navigate={navigate}
    />
  )
}

export default LecturePage