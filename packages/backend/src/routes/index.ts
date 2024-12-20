import { Router } from 'express'
import songsRoute from './songs'
import quizRoute from './quiz'
import authRoute from './auth'
import adminRoute from './admin'

const router = Router()

router.use('/songs', songsRoute)
router.use('/quiz', quizRoute)
router.use('/auth', authRoute)
router.use('/admin', adminRoute)

export default router
