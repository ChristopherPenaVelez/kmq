// packages/backend/src/services/songsService.ts
import { prisma } from '../db/prisma'

export async function getSongs() {
  return prisma.song.findMany()
}

export async function addSong(title: string, artist: string, fileUrl: string) {
  return prisma.song.create({ data: { title, artist, fileUrl } })
}

// New removeSong function
export async function removeSong(id: number) {
  return prisma.song.delete({ where: { id } })
}
