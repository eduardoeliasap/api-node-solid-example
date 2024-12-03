import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CheckInUseCase } from './checkin'
import { RegisterUseCase } from './register'
import { RegisterGymProfileUseCase } from './register-gym'
import { afterEach } from 'node:test'

let checkinRepository: InMemoryCheckInRepository

let userRepository: inMemoryUsersRepository
let userUseCase: RegisterUseCase

let gymRepository: InMemoryGymsRepository
let gymUseCase: RegisterGymProfileUseCase

let sut: CheckInUseCase

describe('Checkin Use Case', () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository()
    userUseCase = new RegisterUseCase(userRepository)

    gymRepository = new InMemoryGymsRepository()
    gymUseCase = new RegisterGymProfileUseCase(gymRepository)

    checkinRepository = new InMemoryCheckInRepository()

    sut = new CheckInUseCase(checkinRepository, userRepository, gymRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { user } = await userUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    const { gym } = await gymUseCase.execute({
      id: 'gym_id',
      title: 'title',
      description: 'description',
      phone: 'phone',
      latitude: -22.6551159,
      longitude: -51.0645078,
    })

    const { checkIn } = await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitude: -22.6551159,
      userLongitude: -51.0645078,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { user } = await userUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    const { gym } = await gymUseCase.execute({
      id: 'gym_id',
      title: 'title',
      description: 'description',
      phone: 'phone',
      latitude: -22.6551159, // mudar para decimal
      longitude: -51.0645078,
    })

    await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
