import { requireAuth } from '../middleware/auth.js'
import { createJob, listJobs, getJob, deleteJob } from '../controllers/jobsController.js'

export async function jobsRoutes(fastify) {
  fastify.post('/api/jobs', { preHandler: requireAuth }, createJob)
  fastify.get('/api/jobs', { preHandler: requireAuth }, listJobs)
  fastify.get('/api/jobs/:id', { preHandler: requireAuth }, getJob)
  fastify.delete('/api/jobs/:id', { preHandler: requireAuth }, deleteJob)
}
