import { Router } from 'express'
import { startQuiz, checkAnswer } from '../controllers/quizController'

const router = Router()

router.get('/start', startQuiz)
router.post('/check-answer', checkAnswer)

export default router
