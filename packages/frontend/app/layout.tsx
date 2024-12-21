"use client";

import { useState, useEffect } from 'react'
import './global.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{ loggedIn: boolean | null, isAdmin?: boolean }>({ loggedIn: null })

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/me', {
      credentials: 'include'
    }).then(res => {
      if (res.ok) return res.json()
      throw new Error('Not logged in')
    }).then(data => {
      setAuthState({ loggedIn: true, isAdmin: data.isAdmin })
    }).catch(() => {
      setAuthState({ loggedIn: false })
    })
  }, [])

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setAuthState({ loggedIn: false })
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">K-Pop Quiz Hub</div>
            {authState.loggedIn === null ? (
              <div>Loading...</div>
            ) : authState.loggedIn ? (
              <div className="space-x-4 flex items-center">
                {authState.isAdmin && (
                  <a href="/admin" className="text-gray-700 hover:text-gray-900">Admin</a>
                )}
                <a href="/songs" className="text-gray-700 hover:text-gray-900">My Library</a>
                <a href="/quiz" className="text-gray-700 hover:text-gray-900">Quiz</a>
                <a href="/leaderboard" className="text-gray-700 hover:text-gray-900">Leaderboard</a>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4 flex items-center">
                <a href="/signup" className="text-gray-700 hover:text-gray-900">Sign Up</a>
                <a href="/login" className="text-gray-700 hover:text-gray-900">Log In</a>
                <a href="/quiz" className="text-gray-700 hover:text-gray-900">Quiz</a>
                <a href="/songs" className="text-gray-700 hover:text-gray-900">Songs</a>
              </div>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
