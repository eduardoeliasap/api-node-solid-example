import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymRepository } from '../gym-repository'

export class InMemoryGymsRepository implements GymRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  public gyms: Gym[] = []

  async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ? data.description : '',
      phone: data.phone ? data.phone : '',
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    }

    this.gyms.push(gym)

    return gym
  }
}
