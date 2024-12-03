import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class inMemoryUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  public users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
