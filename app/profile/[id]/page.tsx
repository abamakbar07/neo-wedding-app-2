"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"

interface User {
  id: string
  name: string
  email: string
  profilePhoto: string
  bio: string
}

interface Event {
  id: string
  name: string
  date: string
}

export default function ProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          console.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("An error occurred", error)
      }
    }

    const fetchUserEvents = async () => {
      try {
        const response = await fetch(`/api/users/${id}/events`)
        if (response.ok) {
          const eventsData = await response.json()
          setEvents(eventsData)
        } else {
          console.error("Failed to fetch user events")
        }
      } catch (error) {
        console.error("An error occurred", error)
      }
    }

    fetchUserData()
    fetchUserEvents()
  }, [id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative h-32 bg-gray-200">{/* Add cover photo here if needed */}</div>
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 -mt-16">
              <Image
                className="h-24 w-24 rounded-full border-4 border-white"
                src={user.profilePhoto || "/placeholder-avatar.png"}
                alt={user.name}
                width={96}
                height={96}
              />
            </div>
            <div className="ml-4 -mt-16">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{user.bio}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Events Created</h3>
          <div className="mt-2">
            {events.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {events.map((event) => (
                  <li key={event.id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-medium">{event.name}</h3>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No events created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

