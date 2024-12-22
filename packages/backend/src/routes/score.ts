// packages/backend/src/routes/score.ts

import { Router } from 'express'
import { prisma } from '../db/prisma'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()

/**
 * Public route to view the Top 5 scores
 * If you want to require login to see the leaderboard,
 * move this route BELOW router.use(requireAuth)
 */
router.get('/top', async (req, res) => {
  try {
    const topScores = await prisma.score.findMany({
      orderBy: { totalScore: 'desc' },
      take: 5,
      include: { user: true }
    })
    return res.json(topScores)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to fetch top scores' })
  }
})

// Protect all routes below this line
router.use(requireAuth)

// Create a new score
router.post('/', async (req, res) => {
  const userId = (req as any).user?.id
  const { totalScore } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const newScore = await prisma.score.create({
      data: {
        userId,
        totalScore
      }
    })
    return res.json(newScore)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to create score' })
  }
})

// Get the current user's scores
router.get('/mine', async (req, res) => {
  const userId = (req as any).user?.id

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const myScores = await prisma.score.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
    return res.json(myScores)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to fetch your scores' })
  }
})

export default router
