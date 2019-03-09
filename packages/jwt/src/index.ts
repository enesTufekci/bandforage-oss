import * as jsonWebToken from 'jsonwebtoken'
import { Request } from 'express'

interface IJwt { }

class Jwt implements IJwt {
  private secret: string = 'secret'
  signOptions: jsonWebToken.SignOptions
  constructor(secret: string, signOptions: jsonWebToken.SignOptions) {
    this.secret = secret
    this.signOptions = signOptions
  }

  async sign(payload: string | Object | Buffer): Promise<string> {
    const secret = this.secret
    const signOptions = this.signOptions
    return await new Promise((resolve, reject) => {
      jsonWebToken.sign(
        payload,
        secret,
        {
          audience: 'web-app',
          expiresIn: '1h',
          ...signOptions
        },
        (error, token) => {
          if (error) {
            reject(error)
          }
          resolve(token)
        }
      )
    })
  }

  test() {
    console.log('test')
  }

  async verify(request: Request) {
    const secret = this.secret
    const token: string = request.headers['authorization'] || request.cookies['Authorization']
    if (token) {
      return await new Promise((resolve, reject) => {
        jsonWebToken.verify(
          token.slice(7, token.length),
          secret,
          (error, decoded) => {
            if (error) {
              reject(error)
            }
            resolve(decoded)
          }
        )
      })
    }
    return false
  }
}

export default Jwt
