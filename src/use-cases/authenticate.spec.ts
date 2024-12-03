import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import bcrypt from 'bcrypt'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let userRepository: inMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'johndoe@test.com'

    await userRepository.create({
      name: 'John Doe',
      email,
      password_hash: await bcrypt.hash('123456', 6),
    })

    const { user } = await sut.execute({
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be not able to authenticate with worng email', async () => {
    expect(() =>
      sut.execute({
        email: 'fake@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be not able to authenticate with worng password', async () => {
    const email = 'johndoe@test.com'

    await userRepository.create({
      name: 'John Doe',
      email,
      password_hash: await bcrypt.hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email,
        password: 'worng_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
