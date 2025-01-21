"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div> // Add a loading spinner or skeleton here
  }

  if (!user) {
    return null
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Wedding App, {user.name}!</h1>
      <p className="mb-4">Manage your events and invitations with ease.</p>
      <div className="space-x-4">
        <Link href="/events" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Events
        </Link>
        <Link href="/create-event" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create Event
        </Link>
        <Link
          href={`/profile/${user.id}`}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          My Profile
        </Link>
      </div>
    </div>
  )
}

