import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'changemeplease'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ error: 'No token in cookies' })
    }

    // decode the token
    const payload: any = jwt.verify(token, JWT_SECRET)
    if (!payload?.userId) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }

    // fetch user from DB if needed, or just set userId
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // attach user to req
    // the type is a bit tricky in TS, but for simplicity:
    (req as any).user = { id: user.id, email: user.email, isAdmin: user.isAdmin }

    next() // proceed to the next middleware/route
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
