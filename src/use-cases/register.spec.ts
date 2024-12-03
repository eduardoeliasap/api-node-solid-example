import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: inMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    expect(user).toHaveProperty('name', 'John Doe')
    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('shoud not be able to create user email already exist', async () => {
    const email = 'johndoe@test.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
