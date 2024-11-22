import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const userRepository = new inMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    })

    expect(user).toHaveProperty('name', 'John Doe')
    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud hash user password upon registration', async () => {
    // const prismaUserRepository = new PrismaUserRepository()
    const userRepository = new inMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
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
    const userRepository = new inMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'johndoe@test.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
