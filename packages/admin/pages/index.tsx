// packages/admin/pages/index.tsx
"use client";

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Song {
  id: number
  title: string
  artist: string
  fileUrl: string
}

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [songs, setSongs] = useState<Song[]>([])

  const fetchSongs = async () => {
    const res = await axios.get('http://localhost:4000/api/songs')
    setSongs(res.data)
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const handleAddSong = async () => {
    try {
      await axios.post('http://localhost:4000/api/songs', { title, artist, fileUrl })
      alert('Song added!')
      setTitle('')
      setArtist('')
      setFileUrl('')
      fetchSongs()
    } catch (error) {
      console.error(error)
      alert('Failed to add song.')
    }
  }

  const handleDeleteSong = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/songs/${id}`)
      alert('Song deleted!')
      fetchSongs()
    } catch (error) {
      console.error(error)
      alert('Failed to delete song.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px', marginBottom: '20px' }}>
        <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder='Artist' value={artist} onChange={e => setArtist(e.target.value)} />
        <input placeholder='File URL' value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
        <button onClick={handleAddSong} style={{ marginTop: '10px' }}>Add Song</button>
      </div>
      <h2>Existing Songs</h2>
      <ul>
        {songs.map(song => (
          <li key={song.id} style={{ marginBottom: '10px' }}>
            {song.title} by {song.artist}{' '}
            <button style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }} onClick={() => handleDeleteSong(song.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
