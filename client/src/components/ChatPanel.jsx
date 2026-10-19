import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { mockQuery } from '../services/mockApi'
import { queryAssistant } from '../services/api'

const USE_MOCK = false

const QUICK_CHIPS = [
  'Summarize what I learned so far',
  'Explain the last 2 minutes',
]

const parseTimestamp = (str) => {
  const [m, s] = str.split(':').map(Number)
  return m * 60 + s
}

const ChatPanel = ({ lectureId, currentTime, formattedTime, pauseAndGetTime, seekTo }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm your AI Learning Assistant.\n\nPause the video anytime and ask me a question. I'll only answer from content you've **already watched**.\n\nTry the quick actions below to get started!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

 const sendMessage = async (question) => {
  if (!question.trim() || loading) return
  const lockedTime = pauseAndGetTime()

  const userTurn = { role: 'user', content: question }
  const newHistory = [...history, userTurn]

  setMessages(prev => [...prev, { role: 'user', content: question }])
  setInput('')
  setLoading(true)

  try {
    let data
    if (USE_MOCK) {
      data = await mockQuery(question, lectureId, lockedTime)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        type: data.type,
      }])
    } else {
      data = await queryAssistant(question, lectureId, lockedTime, newHistory)
      setHistory([...newHistory, { role: 'assistant', content: data.answer }])
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
        intent: data.intent,
        refused: data.refused,
      }])
    }
  } catch (err) {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '⚠️ Something went wrong. Please try again.',
    }])
  } finally {
    setLoading(false)
  }
}
  const handleSend = () => sendMessage(input)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const [history, setHistory] = useState([])

const renderContent = (content, citations = []) => {
  // Replace [n] with hoverable citation badges
  const parts = []
  let lastIndex = 0
  const citationRegex = /\[(\d+)\]/g
  const timestampRegex = /\[(\d{2}:\d{2})\]/g
  let match

  // First handle [MM:SS] timestamps
  const processTimestamps = (text) => {
    const parts = []
    let last = 0
    let m
    const re = /\[(\d{2}:\d{2})\]/g
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index))
      const timeStr = m[1]
      const seconds = parseTimestamp(timeStr)
      parts.push(
        <button
          key={`ts-${m.index}`}
          onClick={() => seekTo(seconds)}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200 transition mx-1"
        >
          ▶ {timeStr}
        </button>
      )
      last = m.index + m[0].length
    }
    if (last < text.length) parts.push(text.slice(last))
    return parts
  }

  // Handle [n] citation references
  const processText = (text) => {
    const parts = []
    let last = 0
    let m
    const re = /\[(\d+)\]/g
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) {
        processTimestamps(text.slice(last, m.index)).forEach(p => parts.push(p))
      }
      const num = parseInt(m[1])
      const citation = citations[num - 1]
      parts.push(
        <span key={`cit-${m.index}`} className="relative group inline-block">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold cursor-pointer hover:bg-blue-700 mx-0.5">
            {num}
          </span>
          {citation && (
            <span className="absolute bottom-6 left-0 z-50 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
              <span className="font-semibold block mb-1">
                {citation.kind === 'video' ? '📍 Video' : '📄 PDF'} — {citation.label || citation.source}
              </span>
              {citation.snippet && (
                <span className="text-gray-300 block">{citation.snippet.slice(0, 120)}...</span>
              )}
              {citation.seek_to !== undefined && (
                <button
                  onClick={() => seekTo(citation.seek_to)}
                  className="mt-2 text-blue-300 hover:text-blue-100 text-xs underline block"
                >
                  ▶ Jump to {citation.label}
                </button>
              )}
            </span>
          )}
        </span>
      )
      last = m.index + m[0].length
    }
    if (last < text.length) {
      processTimestamps(text.slice(last)).forEach(p => parts.push(p))
    }
    return parts
  }

  return (
    <div className="text-sm text-gray-800 leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-2">
              {typeof children === 'string'
                ? processText(children)
                : children
              }
            </p>
          ),
          text: ({ value }) => <>{processText(value)}</>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800 text-sm">AI Learning Assistant</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          
          <span className="text-xs text-gray-500">
            {loading ? 'Thinking...' : ' '}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-blue-600" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}>
              {msg.role === 'user'
                ? <p>{msg.content}</p>
                : renderContent(msg.content, msg.citations || [])
              }
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Chips */}
      <div className="px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2">
        {QUICK_CHIPS.map((chip, i) => (
          <button
            key={i}
            onClick={() => sendMessage(chip)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about what you've watched..."
            rows={2}
            disabled={loading}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          ↵ Enter to send • Video auto-pauses on send
        </p>
      </div>

    </div>
  )
}

export default ChatPanel