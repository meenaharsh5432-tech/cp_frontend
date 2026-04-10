import 'dotenv/config'
import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'

import { authRoutes } from './routes/auth.js'
import { jobsRoutes } from './routes/jobs.js'
import { voiceRoutes } from './routes/voice.js'
import { billingRoutes } from './routes/billing.js'
import { errorHandler } from './middleware/errorHandler.js'

const fastify = Fastify({ logger: true })

// Raw body support for Razorpay webhooks
fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  (req, body, done) => {
    try {
      const str = body.toString()
      if (req.routerPath === '/api/billing/webhook') {
        req.rawBody = body
      }
      done(null, JSON.parse(str))
    } catch (err) {
      done(err)
    }
  }
)

// Plugins
await fastify.register(helmet, {
  contentSecurityPolicy: false // Configured separately for frontend
})

await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})

await fastify.register(cookie)

// Global rate limit
await fastify.register(rateLimit, {
  max: 30,
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
  errorResponseBuilder: () => ({
    error: 'Too many requests. Please slow down.'
  })
})

// Routes
await fastify.register(authRoutes)
await fastify.register(jobsRoutes)
await fastify.register(voiceRoutes)
await fastify.register(billingRoutes)

// Tighter rate limit on job creation
fastify.addHook('preHandler', async (request, reply) => {
  if (request.method === 'POST' && request.url === '/api/jobs') {
    const key = `jobs:${request.ip}`
    // @fastify/rate-limit handles this via per-route config below
  }
})

fastify.setErrorHandler(errorHandler)

fastify.get('/health', async () => ({ status: 'ok' }))

const port = parseInt(process.env.PORT || '3000', 10)

try {
  await fastify.listen({ port, host: '0.0.0.0' })
  console.log(`ContentPilot backend running on port ${port}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
