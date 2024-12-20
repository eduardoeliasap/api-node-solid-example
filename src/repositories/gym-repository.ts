import { Prisma, Gym } from '@prisma/client'

export interface GymRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymUncheckedCreateInput): Promise<Gym>
}
