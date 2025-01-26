import { NextResponse } from "next/server"
import dbConnect from "../../../lib/mongoose"
import Status from "../../../models/Status"
import { verifyJWT } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  await dbConnect()
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = 5
    const skip = (page - 1) * limit

    const statuses = await Status.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email image")
      .lean()

    const total = await Status.countDocuments()
    const hasMore = total > skip + limit

    return NextResponse.json({ statuses, hasMore })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch statuses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const body = await request.json()
    const status = await Status.create({
      ...body,
      author: payload.id,
    })

    const populatedStatus = await Status.findById(status._id)
      .populate("author", "name email image")
      .lean()

    return NextResponse.json(populatedStatus)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create status" }, { status: 500 })
  }
}
