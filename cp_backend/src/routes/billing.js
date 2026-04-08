import { requireAuth } from '../middleware/auth.js'
import { createCheckout, verifyPayment, razorpayWebhook, cancelSubscription } from '../controllers/billingController.js'

export async function billingRoutes(fastify) {
  fastify.post('/api/billing/checkout', { preHandler: requireAuth }, createCheckout)
  fastify.post('/api/billing/verify', { preHandler: requireAuth }, verifyPayment)
  fastify.post('/api/billing/cancel', { preHandler: requireAuth }, cancelSubscription)

  // Razorpay webhook — needs raw body, no auth middleware
  fastify.post(
    '/api/billing/webhook',
    {
      config: { rawBody: true }
    },
    razorpayWebhook
  )
}
