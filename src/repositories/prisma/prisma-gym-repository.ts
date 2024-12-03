import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { GymRepository } from '../gym-repository'

export class PrismaGymRepository implements GymRepository {
  async findById(id: string) {
    const gymById = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gymById
  }

  async create(data: Prisma.GymUncheckedCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
