import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../db/prisma'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'changemeplease'

// Type definition for the payload
interface JWTPayload {
  userId: number
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Not authorized' })
    // Attach the user to req if needed: (req as any).user = user;
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

router.use(requireAdmin)

router.post('/songs', async (req: Request, res: Response) => {
  const { title, artist, fileUrl } = req.body
  const newSong = await prisma.song.create({ data: { title, artist, fileUrl } })
  res.json(newSong)
})

router.delete('/songs/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  await prisma.song.delete({ where: { id } })
  res.json({ message: 'Song deleted' })
})

export default router
