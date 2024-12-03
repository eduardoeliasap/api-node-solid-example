import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-checkin-repository'
import { CheckInUseCase } from '../checkin'
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository'

export function makeCheckinUseCase() {
  const checkinRepository = new PrismaCheckInRepository()
  const userRepository = new PrismaUserRepository()
  const gynRepository = new PrismaGymRepository()
  const checkinUseCase = new CheckInUseCase(
    checkinRepository,
    userRepository,
    gynRepository,
  )

  return checkinUseCase
}
