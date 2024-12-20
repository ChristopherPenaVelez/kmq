"use client";

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [songs, setSongs] = useState<any[]>([])
  const [error, setError] = useState('')

  const fetchSongs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/songs')
      setSongs(res.data)
    } catch (err: any) {
      setError('Failed to load songs.')
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const addSong = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:4000/api/admin/songs', { title, artist, fileUrl }, { withCredentials: true })
      setTitle('')
      setArtist('')
      setFileUrl('')
      fetchSongs()
    } catch (err: any) {
      setError('Failed to add song.')
    }
  }

  const deleteSong = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/songs/${id}`, { withCredentials: true })
      fetchSongs()
    } catch (err: any) {
      setError('Failed to delete song.')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={addSong} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input 
            type="text" 
            className="border p-2 w-full" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Artist</label>
          <input 
            type="text" 
            className="border p-2 w-full" 
            value={artist} 
            onChange={e => setArtist(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">File URL</label>
          <input 
            type="text" 
            className="border p-2 w-full" 
            value={fileUrl} 
            onChange={e => setFileUrl(e.target.value)} 
            required 
          />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" type="submit">
          Add Song
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-4">Existing Songs</h2>
      <ul>
        {songs.map(song => (
          <li key={song.id} className="flex justify-between items-center mb-2">
            <span>{song.title} by {song.artist}</span>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" 
              onClick={() => deleteSong(song.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
