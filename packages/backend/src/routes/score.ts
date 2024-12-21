import { Router } from 'express'
import { prisma } from '../db/prisma'
import { requireAuth } from '../middleware/requireAuth'  // <--- import it

const router = Router()

// apply `requireAuth` before these endpoints:
router.use(requireAuth)

/**
 * POST /api/score
 */
router.post('/', async (req, res) => {
  const userId = (req as any).user?.id
  const { totalScore } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const newScore = await prisma.score.create({
      data: {
        userId: userId,
        totalScore: totalScore
      }
    })
    return res.json(newScore)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to create score' })
  }
})

/**
 * GET /api/score/top
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

export default router
