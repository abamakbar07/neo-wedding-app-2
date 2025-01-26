import { NextResponse } from "next/server"
import dbConnect from "../../../lib/mongoose"
import Event from "../../../models/Event"

export async function GET(request: Request) {
  await dbConnect()
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = 5
    const skip = (page - 1) * limit

    const events = await Event.find({})
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Event.countDocuments()
    const hasMore = total > skip + limit

    return NextResponse.json({ events, hasMore })
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

