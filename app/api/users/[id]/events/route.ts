import { NextResponse } from "next/server"
import dbConnect from "../../../../../lib/mongoose"
import Event from "../../../../../models/Event"

export async function GET(request: Request) {
  await dbConnect()
  try {
    const url = new URL(request.url)
    const userId = url.pathname.split('/')[3]
    const events = await Event.find({ userId }).limit(10)
    return NextResponse.json(events)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}