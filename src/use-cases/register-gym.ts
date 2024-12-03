import { GymRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface RegisterGymProfileUseCaseRequest {
  id: string
  title: string
  description: string
  phone: string
  latitude: number
  longitude: number
}

interface RegisterGymProfileUseCaseResponse {
  gym: Gym
}

export class RegisterGymProfileUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    id,
    title,
    description,
    phone,
    latitude,
    longitude,
  }: RegisterGymProfileUseCaseRequest): Promise<RegisterGymProfileUseCaseResponse> {
    const gym = await this.gymRepository.create({
      id,
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
