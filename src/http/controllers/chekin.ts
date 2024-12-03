import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCheckinUseCase } from '@/use-cases/factories/make-checkin-use-case'
import { GenericError } from '@/use-cases/errors/generic-error'

export async function checkin(request: FastifyRequest, reply: FastifyReply) {
  const checkinBodySchema = z.object({
    user_id: z.string(),
    gym_id: z.string(),
  })

  const { user_id, gym_id } = checkinBodySchema.parse(request.body)

  console.log(request.body)

  try {
    const checkinUseCase = makeCheckinUseCase()

    await checkinUseCase.execute({
      userId: user_id,
      gymId: gym_id,
    })
  } catch (err) {
    if (err instanceof GenericError) {
      return reply.status(500).send(err.message)
    }

    throw err
  }

  return reply.status(201).send()
}
