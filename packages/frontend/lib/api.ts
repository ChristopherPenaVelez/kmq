import axios from 'axios'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'

export async function fetchSongs() {
  const response = await axios.get(`${API_BASE_URL}/songs`)
  return response.data
}
