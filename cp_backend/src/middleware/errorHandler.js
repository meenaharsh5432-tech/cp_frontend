export function errorHandler(error, request, reply) {
  // Log full error server-side only
  console.error(`[ERROR] ${request.method} ${request.url}:`, error)

  const statusCode = error.statusCode || error.status || 500

  // Never expose stack traces to clients
  const message =
    statusCode < 500
      ? error.message
      : 'An unexpected error occurred. Please try again.'

  return reply.status(statusCode).send({ error: message })
}
