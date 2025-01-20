import dbConnect from "../../../lib/mongoose"
import User from "../../../models/User"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  await dbConnect()
  try {
    const users = await User.find({}).limit(10)
    return NextResponse.json(users)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  try {
    const body = await request.json()
    const user = await User.create(body)
    return NextResponse.json(user)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

