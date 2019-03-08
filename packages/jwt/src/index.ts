import * as jwt from 'jsonwebtoken'
import { Request } from 'express'

interface IJwt {}

class Jwt implements IJwt {
  private secret: string = 'secret'
  signOptions: jwt.SignOptions
  constructor(secret: string, signOptions: jwt.SignOptions) {
    this.secret = secret
    this.signOptions = signOptions
  }

  sign = (payload: string | Object | Buffer) => {
    const secret = this.secret
    const signOptions = this.signOptions
    return jwt.sign(payload, secret, {
      audience: 'web-app',
      expiresIn: '1h',
      ...signOptions
    })
  }

  verify = async (request: Request): Promise<{} | false> => {
    const secret = this.secret
    const token = request.headers['authorization']
    if (token) {
      return await new Promise((resolve, reject) => {
        jwt.verify(token.slice(7, token.length), secret, (error, decoded) => {
          if (error) {
            reject(error)
          }
          resolve(decoded)
        })
      })
    }
    return false
  }

  getUser = async (request: Request) => {
    const decoded = await this.verify(request)
    if (decoded) {
      const user = (decoded as any).user
      if (user) {
        return user
      }
    }
    return null
  }
}

export default Jwt
