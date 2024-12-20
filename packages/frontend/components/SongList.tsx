"use client";

import { useEffect, useState } from 'react'
import { fetchSongs } from '../lib/api'
import SongItem from './SongItem'
import { Song } from 'shared/src/types'

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([])
  
  useEffect(() => {
    fetchSongs().then(setSongs).catch(console.error)
  }, [])

  if (!songs || songs.length === 0) {
    return <div>No songs available. Add some via the Admin Panel!</div>
  }

  return (
    <ul className="bg-white shadow p-4 rounded">
      {songs.map(song => (
        <SongItem key={song.id} song={song} />
      ))}
    </ul>
  )
}
