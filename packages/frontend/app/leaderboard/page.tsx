"use client";

import { useEffect, useState } from 'react'
import axios from 'axios'

interface ScoreEntry {
  id: number
  totalScore: number
  createdAt: string
  user: {
    email: string
  }
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([])

  useEffect(() => {
    axios.get('http://localhost:4000/api/score/top', { withCredentials: true })
      .then(res => setScores(res.data))
      .catch(err => console.error('Failed to fetch leaderboard:', err))
  }, [])

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      {scores.length === 0 ? (
        <p>No scores available.</p>
      ) : (
        <ul className="space-y-2">
          {scores.map((entry, idx) => (
            <li key={entry.id} className="flex justify-between">
              <span>
                {idx + 1}. {entry.user.email ?? 'Unknown'}
              </span>
              <span>Score: {entry.totalScore}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
