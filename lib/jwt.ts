import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'

export function signJWT(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
  } catch (error) {
    return null
  }
}