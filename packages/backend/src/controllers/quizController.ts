import { Request, Response } from 'express'
import { startQuizSession, fetchRandomSong, verifyAnswer, recordResult, finalizeScore } from '../services/quizService'

export async function startQuiz(req: Request, res: Response) {
  const mode = (req.query.mode as string) || 'unlimited'
  
  if (mode === 'unlimited') {
    const song = await fetchRandomSong()
    return res.json({ mode, song })
  } else if (mode === '5round') {
    const session = await startQuizSession(mode, 5)
    const song = await fetchRandomSong()
    return res.json({ mode, sessionId: session.id, round: 1, maxRounds: 5, song })
  } else {
    return res.status(400).json({ error: 'Invalid mode' })
  }
}

export async function checkAnswer(req: Request, res: Response) {
  const { songId, guess, sessionId, timeTakenMs } = req.body

  const isCorrect = await verifyAnswer(songId, guess)

  if (!sessionId) {
    // Unlimited mode: just return correctness and a new random song
    const nextSong = await fetchRandomSong()
    return res.json({ correct: isCorrect, finished: false, song: nextSong })
  }

  // 5-round mode
  const { round, maxRounds, finished } = await recordResult(sessionId, songId, isCorrect, timeTakenMs)

  if (finished) {
    const score = await finalizeScore(sessionId)
    return res.json({ correct: isCorrect, finished: true, score })
  } else {
    // Not finished, send next song
    const nextSong = await fetchRandomSong()
    return res.json({ correct: isCorrect, finished: false, round: round + 1, maxRounds, song: nextSong })
  }
}
