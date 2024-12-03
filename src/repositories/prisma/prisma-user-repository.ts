import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUserRepository implements UsersRepository {
  async findById(id: string) {
    const userExistsById = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return userExistsById
  }

  async findByEmail(email: string) {
    const userEmailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return userEmailExists
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
