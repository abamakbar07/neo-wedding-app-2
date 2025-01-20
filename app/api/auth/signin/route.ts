import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import User from "../../../../models/User"
import bcrypt from "bcryptjs"

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

    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

