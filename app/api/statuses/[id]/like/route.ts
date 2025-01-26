import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Status from "@/models/Status"
import { verifyJWT } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const token = cookies().get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const status = await Status.findById(params.id)
    if (!status) {
      return NextResponse.json({ error: "Status not found" }, { status: 404 })
    }

    const userLikedIndex = status.likes.indexOf(payload.id)
    if (userLikedIndex > -1) {
      status.likes.splice(userLikedIndex, 1)
    } else {
      status.likes.push(payload.id)
    }

    await status.save()
    const populatedStatus = await Status.findById(status._id)
      .populate("author", "name email image")
      .populate("comments.author", "name email image")
      .lean()

    return NextResponse.json(populatedStatus)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    )
  }
} 