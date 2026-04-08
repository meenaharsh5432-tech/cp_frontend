import jwt from 'jsonwebtoken'
import { getPrisma } from '../lib/prisma.js'

export async function requireAuth(request, reply) {
  try {
    const token = request.cookies?.token
    if (!token) {
      return reply.status(401).send({ error: 'Not authenticated' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const prisma = getPrisma()
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })

    if (!user) {
      return reply.status(401).send({ error: 'User not found' })
    }

    request.user = user
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid or expired token' })
  }
}
