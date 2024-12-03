import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password,
    })

    const authResponse = await request(app.server).post('/session').send({
      email,
      password,
    })

    const { text } = authResponse

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${text}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
  })
})
