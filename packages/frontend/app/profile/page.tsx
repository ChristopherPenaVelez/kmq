"use client";

import { useEffect, useState } from 'react'

type ScoreEntry = {
  id: number
  totalScore: number
  createdAt: string
  user: {
    username: string
  }
}

export default function ProfilePage() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/score/mine', {
          credentials: 'include'
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Could not fetch scores')
          return
        }
        const data = await res.json()
        setScores(data)
      } catch (err: any) {
        console.error(err)
        setError('An unexpected error occurred')
      }
    }
    fetchScores()
  }, [])

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!error && scores.length === 0 && <p>No scores yet!</p>}
      {scores.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Score</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score.id}>
                <td className="border px-2 py-1">{score.totalScore}</td>
                <td className="border px-2 py-1">
                  {new Date(score.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
