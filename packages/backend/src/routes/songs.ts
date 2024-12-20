// packages/backend/src/routes/songs.ts
import { Router } from 'express'
import { getAllSongs, createSong, deleteSongById } from '../controllers/songsController'

const router = Router()

router.get('/', getAllSongs)
router.post('/', createSong)

// New DELETE route
router.delete('/:id', deleteSongById)

export default router
