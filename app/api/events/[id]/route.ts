import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import Event from "../../../../models/Event"
import { verifyJWT } from "@/lib/jwt"
import { cookies } from "next/headers"

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  try {
    const { id } = params
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if the user is the creator of the event
    if (event.creator.toString() !== payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updates = await request.json()
    
    // Fields that cannot be updated
    delete updates._id
    delete updates.creator
    delete updates.invitationCode

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 