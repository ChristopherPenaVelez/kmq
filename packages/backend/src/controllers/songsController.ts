// packages/backend/src/controllers/songsController.ts
import { Request, Response } from 'express'
import { getSongs, addSong, removeSong } from '../services/songsService'

export async function getAllSongs(req: Request, res: Response) {
  const songs = await getSongs()
  res.json(songs)
}

export async function createSong(req: Request, res: Response) {
  const { title, artist, fileUrl } = req.body
  const newSong = await addSong(title, artist, fileUrl)
  res.json(newSong)
}

export async function deleteSongById(req: Request, res: Response) {
  const { id } = req.params
  await removeSong(Number(id))
  res.json({ message: `Song with ID ${id} deleted.` })
}
