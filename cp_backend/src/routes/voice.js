import { requireAuth } from '../middleware/auth.js'
import { updateVoiceProfile, updateCustomVoice } from '../controllers/voiceController.js'

export async function voiceRoutes(fastify) {
  fastify.patch('/api/voice', { preHandler: requireAuth }, updateVoiceProfile)
  fastify.patch('/api/voice/custom', { preHandler: requireAuth }, updateCustomVoice)
}
