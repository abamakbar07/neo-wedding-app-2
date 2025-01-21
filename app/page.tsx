"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"
import EventCard from "./components/EventCard"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/contexts/types"

interface Event {
  _id: string
  title: string
  date: string
  time: string
  venue: {
    name: string
    address: string
  }
  customization: {
    layout: string
    primaryColor: string
    secondaryColor: string
    heroImage: string
  }
}

export default function Home() {
  const { user, loading } = useAuth() as { user: User | null, loading: boolean }
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchEvents()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Home</h1>
          <Link href="/create-event">
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 py-6">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Start a thread..."
                    className="w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6 min-h-[60px]"
                  />
                  <div className="flex justify-end border-t pt-2">
                    <Button className="bg-primary hover:bg-primary/90">Post</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Area (to be implemented) */}
            <div className="space-y-4">
              {/* Placeholder for future posts */}
              <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
                No posts yet. Start the conversation!
              </div>
            </div>
          </main>

          {/* Side Section - Events */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Events
                </h2>
                <Link href="/create-event">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No events yet</p>
                  <Link href="/create-event">
                    <Button className="bg-primary hover:bg-primary/90">
                      Create Your First Event
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <EventCard key={event._id} event={event} variant="compact" />
                  ))}
                  {events.length > 3 && (
                    <Link 
                      href="/events" 
                      className="block text-center text-sm text-primary hover:text-primary/90 mt-2"
                    >
                      View all events ({events.length})
                    </Link>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

