import { getPrisma } from '../lib/prisma.js'
import { extractContent } from '../services/scraper.js'
import { generateAllOutputs } from '../services/openai.js'
import { checkQuota, incrementQuota } from '../services/quota.js'

export async function createJob(request, reply) {
  const prisma = getPrisma()
  const user = request.user
  const { inputType, input } = request.body

  if (!inputType || !input || !input.trim()) {
    return reply.status(400).send({ error: 'inputType and input are required' })
  }

  const validTypes = ['url', 'readme', 'youtube', 'text']
  if (!validTypes.includes(inputType)) {
    return reply.status(400).send({ error: `inputType must be one of: ${validTypes.join(', ')}` })
  }

  // Check quota before doing any work
  await checkQuota(user, prisma)

  // Create job record immediately so user can see it's in progress
  const job = await prisma.job.create({
    data: {
      userId: user.id,
      status: 'processing',
      inputType,
      inputUrl: inputType !== 'text' ? input : null,
      inputText: inputType === 'text' ? input : null,
      voiceProfile: user.voiceProfile
    }
  })

  try {
    const extracted = await extractContent(inputType, input)
    const outputs = await generateAllOutputs(extracted, user.voiceProfile, user.customVoicePrompt)

    const completed = await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'completed',
        twitterThread: outputs.twitterThread,
        linkedinPost: outputs.linkedinPost,
        newsletter: outputs.newsletter,
        shortHook: outputs.shortHook
      }
    })

    await incrementQuota(user.id, prisma)

    return reply.status(201).send(completed)
  } catch (err) {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'failed', errorMessage: err.message }
    })
    throw err
  }
}

export async function listJobs(request, reply) {
  const prisma = getPrisma()
  const jobs = await prisma.job.findMany({
    where: { userId: request.user.id, status: { not: 'deleted' } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      status: true,
      inputType: true,
      inputUrl: true,
      shortHook: true,
      voiceProfile: true,
      createdAt: true
    }
  })
  return reply.send(jobs)
}

export async function getJob(request, reply) {
  const prisma = getPrisma()
  const job = await prisma.job.findUnique({ where: { id: request.params.id } })

  if (!job || job.status === 'deleted') {
    return reply.status(404).send({ error: 'Job not found' })
  }

  // Verify ownership
  if (job.userId !== request.user.id) {
    return reply.status(403).send({ error: 'Forbidden' })
  }

  return reply.send(job)
}

export async function deleteJob(request, reply) {
  const prisma = getPrisma()
  const job = await prisma.job.findUnique({ where: { id: request.params.id } })

  if (!job || job.status === 'deleted') {
    return reply.status(404).send({ error: 'Job not found' })
  }

  if (job.userId !== request.user.id) {
    return reply.status(403).send({ error: 'Forbidden' })
  }

  await prisma.job.update({
    where: { id: request.params.id },
    data: { status: 'deleted' }
  })

  return reply.send({ ok: true })
}
