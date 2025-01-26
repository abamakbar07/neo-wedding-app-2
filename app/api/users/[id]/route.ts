import dbConnect from "../../../../lib/mongoose"
import User from "../../../../models/User"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    await dbConnect()
    const url = new URL(request.url)
    const userId = url.pathname.split("/").pop()
    try {
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        return NextResponse.json(user)
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }
}