import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import Event from "../../../../models/Event"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  try {
    const { id } = params
    const event = await Event.findById(id).select('-invitationCode') // Don't expose invitation code to public
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 