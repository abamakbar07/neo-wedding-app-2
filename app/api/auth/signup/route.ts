import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import User from "../../../../models/User"
import bcrypt from "bcryptjs"

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

    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = newUser.toObject()

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

