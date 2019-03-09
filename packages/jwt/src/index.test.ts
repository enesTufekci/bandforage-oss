import { expect } from 'chai'
import Jwt from '../lib'

const SECRET = 'SECRET'
const jwt = new Jwt(SECRET, {})

describe('JWT', () => {
  it('signs and verifies', async () => {
    const payload = {
      name: 'john',
      id: '1234-5678'
    }
    const token = jwt.sign(payload)
    expect(token).to.be.string

    const request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const decoded = await jwt.verify(request as any)
    expect((decoded as any).name).to.eq(payload.name)
    expect((decoded as any).id).to.eq(payload.id)
  })
})
