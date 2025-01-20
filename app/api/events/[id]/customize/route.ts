import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongoose"
import Event from "../../../../models/Event"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const { id } = params
    const body = await request.json()

    const updatedEvent = await Event.findByIdAndUpdate(id, { $set: { customization: body } }, { new: true })

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating event customization:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

