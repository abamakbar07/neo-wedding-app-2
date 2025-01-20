import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import User from "../../../../models/User"
import bcrypt from "bcryptjs"
import { signJWT } from "../../../../lib/jwt"
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { email, password } = await request.json()
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    // Generate JWT token
    const token = signJWT({ id: user._id.toString(), email: user.email })

    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = user.toObject()

    // Set JWT as HTTP-only cookie
    const response = NextResponse.json({ user: userWithoutPassword })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}