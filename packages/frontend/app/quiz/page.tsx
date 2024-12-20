"use client";

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Song {
  id: number
  title: string
  artist: string
  fileUrl: string
}

interface ScoreData {
  correctCount: number
  avgTime: number
  score: number
}

interface QuizState {
  mode: 'unlimited' | '5round' | null
  sessionId?: number
  round?: number
  maxRounds?: number
  song?: Song
  feedback?: string
  finished?: boolean
  finalScore?: ScoreData
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({ mode: null })
  const [guess, setGuess] = useState('')
  const [startTime, setStartTime] = useState<number>(0)
  const [loading, setLoading] = useState(false) // Track loading states for UX
  const [showFeedback, setShowFeedback] = useState(false) // For animating feedback

  const startQuiz = async (selectedMode: 'unlimited' | '5round') => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:4000/api/quiz/start?mode=${selectedMode}`)
      if (selectedMode === 'unlimited') {
        setQuizState({
          mode: 'unlimited',
          song: res.data.song,
          feedback: ''
        })
      } else {
        setQuizState({
          mode: '5round',
          sessionId: res.data.sessionId,
          round: res.data.round,
          maxRounds: res.data.maxRounds,
          song: res.data.song,
          feedback: ''
        })
      }
      setGuess('')
      setShowFeedback(false)
      setStartTime(Date.now())
    } catch (error) {
      console.error('Failed to start quiz:', error)
      alert('Failed to start quiz.')
    } finally {
      setLoading(false)
    }
  }

  const submitGuess = async () => {
    if (!quizState.song || !quizState.mode) return
    setLoading(true)
    const timeTakenMs = Date.now() - startTime

    const payload: any = {
      songId: quizState.song.id,
      guess,
      timeTakenMs
    }

    if (quizState.mode === '5round' && quizState.sessionId) {
      payload.sessionId = quizState.sessionId
    }

    try {
      const res = await axios.post('http://localhost:4000/api/quiz/check-answer', payload)
      const data = res.data

      let feedbackMessage = data.correct 
        ? 'Correct!' 
        : `Incorrect! Correct answer was: ${quizState.song?.title}`

      if (quizState.mode === 'unlimited') {
        setQuizState(prev => ({
          ...prev,
          feedback: feedbackMessage,
          song: data.song
        }))
        setGuess('')
        setStartTime(Date.now())
      } else {
        // 5-round mode
        if (data.finished) {
          // Quiz ended
          setQuizState(prev => ({
            ...prev,
            finished: true,
            feedback: feedbackMessage,
            finalScore: data.score
          }))
        } else {
          // Not finished, load next round
          setQuizState(prev => ({
            ...prev,
            feedback: feedbackMessage,
            song: data.song,
            round: data.round,
          }))
          setGuess('')
          setStartTime(Date.now())
        }
      }

      // Show feedback with animation
      setShowFeedback(true)
      // Hide feedback after 2 seconds
      setTimeout(() => setShowFeedback(false), 2000)
    } catch (error) {
      console.error('Failed to submit guess:', error)
      alert('Failed to submit guess.')
    } finally {
      setLoading(false)
    }
  }

  const resetQuiz = () => {
    setQuizState({ mode: null })
    setGuess('')
    setShowFeedback(false)
  }

  // UI Sections
  const ModeSelection = () => (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-6">Select a Mode</h1>
      <div className="space-x-4">
        <button
          onClick={() => startQuiz('unlimited')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          Unlimited
        </button>
        <button
          onClick={() => startQuiz('5round')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          5-Round
        </button>
      </div>
      {loading && <div className="mt-4 text-blue-600 animate-spin">🔄</div>}
    </div>
  )

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const FeedbackMessage = () => (
    quizState.feedback && showFeedback ? (
      <div className={`text-lg font-medium ${quizState.feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'} transition-opacity duration-500`}>
        {quizState.feedback}
      </div>
    ) : null
  )

  const QuizInProgress = () => (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">K-Pop Quiz ({quizState.mode})</h1>

      {quizState.mode === '5round' && quizState.round && quizState.maxRounds && (
        <p className="mb-4 text-gray-700">Round {quizState.round} of {quizState.maxRounds}</p>
      )}

      {quizState.song && (
        <div className="mb-4">
          <audio src={quizState.song.fileUrl} controls className="w-full" />
        </div>
      )}

      <div className="mb-4 flex space-x-2 justify-center">
        <input
          type="text"
          placeholder="Your guess..."
          value={guess}
          onChange={e => setGuess(e.target.value)}
          className="border p-2 rounded w-2/3"
          disabled={loading}
        />
        <button
          onClick={submitGuess}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading || !guess.trim()}
        >
          Submit
        </button>
      </div>

      <div className="h-8 mb-4 flex items-center justify-center">
        <FeedbackMessage />
      </div>

      <button
        onClick={resetQuiz}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        Back to Mode Selection
      </button>
    </div>
  )

  const FinalScore = () => {
    if (!quizState.finalScore || quizState.mode !== '5round') return null
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Finished!</h1>
        <p className="mb-2">{quizState.feedback}</p>
        <p className="mb-1">Correct: {quizState.finalScore.correctCount} out of {quizState.maxRounds}</p>
        <p className="mb-1">Average Time: {quizState.finalScore.avgTime.toFixed(2)} ms</p>
        <p className="mb-4">Final Score: {quizState.finalScore.score}</p>
        <button
          onClick={resetQuiz}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Back to Mode Selection
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center">
      {loading && <LoadingSpinner />}

      {!quizState.mode && ModeSelection()}
      {quizState.mode && !quizState.finished && QuizInProgress()}
      {quizState.finished && FinalScore()}
    </div>
  )
}
