import { requireAuth } from '../middleware/auth.js'
import {
  googleRedirect,
  googleCallback,
  getMe,
  logout,
  completeOnboarding,
  deleteAccount
} from '../controllers/authController.js'

export async function authRoutes(fastify) {
  fastify.get('/api/auth/google', googleRedirect)
  fastify.get('/api/auth/google/callback', googleCallback)

  fastify.get('/api/auth/me', { preHandler: requireAuth }, getMe)
  fastify.post('/api/auth/logout', { preHandler: requireAuth }, logout)
  fastify.patch('/api/auth/onboarding-complete', { preHandler: requireAuth }, completeOnboarding)
  fastify.delete('/api/auth/account', { preHandler: requireAuth }, deleteAccount)
}
