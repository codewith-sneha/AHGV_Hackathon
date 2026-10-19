import { useState, useEffect, useRef } from 'react'

export const useVideoTime = (playerRef) => {
  const [currentTime, setCurrentTime] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const player = playerRef?.current
      if (player && typeof player.currentTime === 'function') {
        const t = player.currentTime()
        if (t !== undefined && t !== null) {
          setCurrentTime(t)
        }
      }
    }, 500)

    return () => clearInterval(intervalRef.current)
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const seekTo = (seconds) => {
    const player = playerRef?.current
    if (!player) return
    player.currentTime(seconds)
    player.play()
  }

  const pauseAndGetTime = () => {
    const player = playerRef?.current
    if (!player) return 0
    player.pause()
    return player.currentTime() || 0
  }

  return {
    currentTime,
    formattedTime: formatTime(currentTime),
    seekTo,
    pauseAndGetTime,
  }
}