import { useEffect, useRef } from 'react'

const VideoPlayer = ({ playerRef }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return

    playerRef.current = {
      currentTime: (t) => {
        if (!videoRef.current) return 0
        if (t !== undefined) videoRef.current.currentTime = t
        return videoRef.current.currentTime
      },
      pause: () => videoRef.current?.pause(),
      play: () => videoRef.current?.play(),
      isDisposed: () => false,
    }

    return () => {
      playerRef.current = null
    }
  }, [])

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        src="/lecture.mp4"
        controls
        playsInline
        className="w-full"
        style={{ maxHeight: '60vh' }}
      />
    </div>
  )
}

export default VideoPlayer