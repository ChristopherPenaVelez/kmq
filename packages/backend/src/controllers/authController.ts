import { Request, Response } from 'express'
import { prisma } from '../db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'changemeplease'

export async function signup(req: Request, res: Response) {
  const { username, dob, email, password } = req.body

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    // Convert dob string to Date if dob was provided
    let dobValue: Date | undefined
    if (dob) {
      dobValue = new Date(dob)
      // Optionally, do more validation if needed (e.g., ensure a valid date format).
    }

    const user = await prisma.user.create({
      data: {
        username,
        dob: dobValue,
        email,
        password: hashedPassword
      }
    })

    return res.status(201).json({
      message: 'User created',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error: any) {
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      // Prisma sets error.meta.target to something like ["username"] or ["email"]
      if (error.meta && error.meta.target) {
        const fields = error.meta.target as string[]
        if (fields.includes('username')) {
          return res.status(409).json({ error: 'Username already in use' })
        } else if (fields.includes('email')) {
          return res.status(409).json({ error: 'Email already in use' })
        }
      }
      return res.status(409).json({ error: 'Email or username already in use' })
    }
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' })

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000
  })

  return res.json({
    message: 'Logged in successfully',
    user: {
      id: user.id,
      username: user.username, // new
      email: user.email
    }
  })
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token')
  return res.json({ message: 'Logged out successfully' })
}

export async function me(req: Request, res: Response) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload: any = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ error: 'User not found' })

    return res.json({
      userId: user.id,
      username: user.username, // can now return username
      email: user.email,
      isAdmin: user.isAdmin,
      dob: user.dob // if you want to reveal it
    })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
