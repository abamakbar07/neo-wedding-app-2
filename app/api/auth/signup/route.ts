import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import User from "../../../../models/User"
import bcrypt from "bcryptjs"
import { signJWT } from "../../../../lib/jwt"

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // Generate JWT token
    const token = await signJWT({ id: newUser._id.toString(), email: newUser.email })

    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = newUser.toObject()

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
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

