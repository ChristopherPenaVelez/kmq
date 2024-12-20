import { prisma } from '../db/prisma'

export async function startQuizSession(mode: string, maxRounds: number) {
  return prisma.quizSession.create({
    data: {
      mode,
      maxRounds
    }
  })
}

export async function fetchRandomSong() {
  const count = await prisma.song.count()
  const randomIndex = Math.floor(Math.random() * count)
  const [randomSong] = await prisma.song.findMany({
    skip: randomIndex,
    take: 1
  })
  return randomSong
}

export async function verifyAnswer(songId: number, guess: string) {
  const song = await prisma.song.findUnique({ where: { id: songId } })
  if (!song) return false
  return song.title.toLowerCase() === guess.toLowerCase()
}

export async function recordResult(sessionId: number, songId: number, correct: boolean, timeTakenMs: number) {
  const session = await prisma.quizSession.findUnique({ where: { id: sessionId } })
  if (!session) throw new Error('Session not found')

  const currentRound = session.currentRound + 1
  const finished = currentRound >= session.maxRounds

  await prisma.quizResult.create({
    data: {
      quizSessionId: sessionId,
      songId,
      correct,
      timeTakenMs
    }
  })

  await prisma.quizSession.update({
    where: { id: sessionId },
    data: { currentRound }
  })

  return { round: currentRound, maxRounds: session.maxRounds, finished }
}

export async function finalizeScore(sessionId: number) {
  const results = await prisma.quizResult.findMany({ where: { quizSessionId: sessionId } })

  const correctCount = results.filter(r => r.correct).length
  const avgTime = results.reduce((acc, r) => acc + r.timeTakenMs, 0) / results.length

  // Example scoring formula:
  const score = (correctCount * 100) - (avgTime / 100)

  return {
    correctCount,
    avgTime,
    score: Math.round(score)
  }
}
