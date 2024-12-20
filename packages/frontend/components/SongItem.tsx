"use client";

import { Song } from 'shared/src/types'
import { useState } from 'react'

interface SongItemProps {
  song: Song
}

export default function SongItem({ song }: SongItemProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const handlePlay = () => {
    const audio = document.getElementById(`audio-${song.id}`) as HTMLAudioElement
    if (audio) {
      if (!isPlaying) {
        audio.play()
        setIsPlaying(true)
        audio.addEventListener('ended', () => setIsPlaying(false))
      } else {
        audio.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <li className="border-b py-2 flex items-center justify-between">
      <div>
        <strong>{song.title}</strong> by {song.artist}
      </div>
      <div>
        {/* Audio element hidden or shown as you prefer */}
        <audio id={`audio-${song.id}`} src={song.fileUrl} />
        <button 
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
          onClick={handlePlay}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </li>
  )
}
