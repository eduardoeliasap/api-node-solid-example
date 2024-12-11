import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { checkin } from './controllers/chekin'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'
import { refresh } from './controllers/refresh'
import { verifyUserRole } from './middlewares/verify-user-role'

export async function appRoutes(app: FastifyInstance) {
  app.post('/session', authenticate)
  app.post('/users', { onRequest: [verifyUserRole('ADMIN')] }, register)
  app.post('/checkin', checkin)
  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
