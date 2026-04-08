import Razorpay from 'razorpay'
import crypto from 'crypto'
import { getPrisma } from '../lib/prisma.js'

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

const PLAN_TO_TIER = {
  [process.env.RAZORPAY_PLAN_SOLO]: 'solo',
  [process.env.RAZORPAY_PLAN_TEAM]: 'team',
  [process.env.RAZORPAY_PLAN_SCALE]: 'scale'
}

export async function createCheckout(request, reply) {
  const { plan } = request.body
  const planId = {
    solo: process.env.RAZORPAY_PLAN_SOLO,
    team: process.env.RAZORPAY_PLAN_TEAM,
    scale: process.env.RAZORPAY_PLAN_SCALE
  }[plan]

  if (!planId) {
    return reply.status(400).send({ error: 'Invalid plan' })
  }

  const razorpay = getRazorpay()
  const prisma = getPrisma()

  let customerId = request.user.razorpayCustomerId

  if (!customerId) {
    const customer = await razorpay.customers.create({
      name: request.user.name,
      email: request.user.email,
      fail_existing: 0
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: request.user.id },
      data: { razorpayCustomerId: customerId }
    })
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
    total_count: 120, // 120 billing cycles (10 years effectively)
    customer_id: customerId
  })

  return reply.send({
    subscriptionId: subscription.id,
    keyId: process.env.RAZORPAY_KEY_ID
  })
}

export async function verifyPayment(request, reply) {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = request.body

  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest('hex')

  if (razorpay_signature !== expectedSig) {
    return reply.status(400).send({ error: 'Payment verification failed' })
  }

  const razorpay = getRazorpay()
  const sub = await razorpay.subscriptions.fetch(razorpay_subscription_id)
  const tier = PLAN_TO_TIER[sub.plan_id] || 'free'

  const prisma = getPrisma()
  await prisma.user.update({
    where: { id: request.user.id },
    data: { tier, razorpaySubscriptionId: razorpay_subscription_id }
  })

  return reply.send({ tier })
}

export async function razorpayWebhook(request, reply) {
  const sig = request.headers['x-razorpay-signature']
  const body = request.rawBody

  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (sig !== expectedSig) {
    console.error('[Razorpay] Webhook signature verification failed')
    return reply.status(400).send({ error: 'Invalid webhook signature' })
  }

  const event = request.body
  const prisma = getPrisma()

  try {
    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.charged': {
        const sub = event.payload.subscription.entity
        const tier = PLAN_TO_TIER[sub.plan_id] || 'free'

        await prisma.user.updateMany({
          where: { razorpayCustomerId: sub.customer_id },
          data: { tier, razorpaySubscriptionId: sub.id }
        })
        break
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const sub = event.payload.subscription.entity

        await prisma.user.updateMany({
          where: { razorpayCustomerId: sub.customer_id },
          data: { tier: 'free', razorpaySubscriptionId: null }
        })
        break
      }
    }
  } catch (err) {
    console.error('[Razorpay] Webhook handler error:', err)
    return reply.status(500).send({ error: 'Webhook processing failed' })
  }

  return reply.send({ received: true })
}

export async function cancelSubscription(request, reply) {
  if (!request.user.razorpaySubscriptionId) {
    return reply.status(400).send({ error: 'No active subscription found.' })
  }

  const razorpay = getRazorpay()

  await razorpay.subscriptions.cancel(request.user.razorpaySubscriptionId, true)

  const prisma = getPrisma()
  await prisma.user.update({
    where: { id: request.user.id },
    data: { tier: 'free', razorpaySubscriptionId: null }
  })

  return reply.send({ message: 'Subscription cancelled.' })
}
