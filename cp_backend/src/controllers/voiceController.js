import { getPrisma } from '../lib/prisma.js'
import { VOICE_PROFILES } from '../services/voiceProfiles.js'

const VALID_PROFILES = Object.keys(VOICE_PROFILES)

export async function updateVoiceProfile(request, reply) {
  const prisma = getPrisma()
  const { voiceProfile } = request.body

  if (!voiceProfile || !VALID_PROFILES.includes(voiceProfile)) {
    return reply.status(400).send({
      error: `voiceProfile must be one of: ${VALID_PROFILES.join(', ')}`
    })
  }

  const user = await prisma.user.update({
    where: { id: request.user.id },
    data: { voiceProfile }
  })

  return reply.send({ voiceProfile: user.voiceProfile })
}

export async function updateCustomVoice(request, reply) {
  const prisma = getPrisma()
  const { customPrompt } = request.body

  if (request.user.tier === 'free') {
    return reply.status(403).send({ error: 'Custom voice is a Pro feature. Upgrade to unlock.' })
  }

  if (!customPrompt || typeof customPrompt !== 'string') {
    return reply.status(400).send({ error: 'customPrompt is required' })
  }

  if (customPrompt.length > 500) {
    return reply.status(400).send({ error: 'customPrompt must be 500 characters or fewer' })
  }

  const user = await prisma.user.update({
    where: { id: request.user.id },
    data: { customVoicePrompt: customPrompt }
  })

  return reply.send({ customVoicePrompt: user.customVoicePrompt })
}
