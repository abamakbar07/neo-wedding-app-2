import { NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { verifyJWT } from "../../../../lib/jwt"
import dbConnect from "../../../../lib/mongoose"
import User from "../../../../models/User"

export async function GET() {
  const token = cookies().get('token')?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  const payload = await verifyJWT(token)
  if (!payload) {
    return NextResponse.json({ user: null })
  }

  await dbConnect()
  try {
    const user = await User.findById(payload.id).select('-password')
    if (!user) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ user: null })
  }
}