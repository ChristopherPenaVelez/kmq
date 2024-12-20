import { useEffect, useState } from 'react'
import { fetchSongs } from '../lib/api'
import { Song } from 'shared/src/types'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSongs()
      .then(data => {
        setSongs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { songs, loading }
}
