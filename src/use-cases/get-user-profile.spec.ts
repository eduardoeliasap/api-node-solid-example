import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let userRepository: inMemoryUsersRepository
let registerUseCase: RegisterUseCase
let sut: GetUserProfileUseCase

describe('Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(userRepository)
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get profile by id', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    expect(user).toHaveProperty('name', 'John Doe')
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to get profile by worng id', async () => {
    const email = 'johndoe@test.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(() =>
      sut.execute({
        userId: 'worng_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
