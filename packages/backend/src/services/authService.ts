import { prisma } from '../db/prisma'
import bcrypt from 'bcrypt'

export async function registerUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) return null
  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
