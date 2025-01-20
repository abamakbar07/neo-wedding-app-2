import { NextResponse } from "next/server"
import dbConnect from "../../../lib/mongoose"
import Event from "../../../models/Event"

export async function GET(request: Request) {
  await dbConnect()
  try {
    const events = await Event.find({}).limit(10)
    return NextResponse.json(events)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  try {
    const body = await request.json()
    const event = await Event.create(body)
    return NextResponse.json(event)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

