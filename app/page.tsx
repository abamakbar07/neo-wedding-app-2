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
import StatusCard from "./components/StatusCard"

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

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

interface Status {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  likes: string[];
  images?: string[];
  comments: Comment[];
}

export default function Home() {
  const { user, loading } = useAuth() as { user: User | null, loading: boolean }
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statuses, setStatuses] = useState<Status[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [eventPage, setEventPage] = useState(1)
  const [hasMoreEvents, setHasMoreEvents] = useState(true)
  const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false)

  const loadMoreStatuses = async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      const response = await fetch(`/api/statuses?page=${page + 1}`)
      const data = await response.json()
      setStatuses(prev => [...prev, ...data.statuses])
      setHasMore(data.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error("Failed to load more statuses:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStatus.trim()) return

    try {
      const response = await fetch("/api/statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setStatuses(prev => [data, ...prev])
        setNewStatus("")
      }
    } catch (error) {
      console.error("Failed to post status:", error)
    }
  }

  const loadMoreEvents = async () => {
    if (isLoadingMoreEvents || !hasMoreEvents) return
    setIsLoadingMoreEvents(true)
    try {
      const response = await fetch(`/api/events?page=${eventPage + 1}`)
      const data = await response.json()
      setEvents(prev => [...prev, ...data.events])
      setHasMoreEvents(data.hasMore)
      setEventPage(prev => prev + 1)
    } catch (error) {
      console.error("Failed to load more events:", error)
    } finally {
      setIsLoadingMoreEvents(false)
    }
  }

  const handleStatusUpdate = (statusId: string, newStatus: Status) => {
    setStatuses(prevStatuses => 
      prevStatuses.map(status => 
        status._id === statusId ? newStatus : status
      )
    );
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?page=1")
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events)
          setHasMoreEvents(data.hasMore)
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

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/statuses?page=1")
        if (response.ok) {
          const data = await response.json()
          setStatuses(data.statuses)
          setHasMore(data.hasMore)
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error)
      }
    }

    if (user) {
      fetchStatuses()
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000
        && !isLoadingMore
        && hasMore
      ) {
        loadMoreStatuses()
      }
    }
  
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoadingMore, hasMore])

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
                  <form onSubmit={handlePostSubmit}>
                    <textarea
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6 min-h-[60px]"
                    />
                    <div className="flex justify-end border-t pt-2">
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={!newStatus.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Feed Area */}
            <div className="space-y-4">
              {statuses.map((status) => (
                <StatusCard 
                  key={status._id} 
                  status={status} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
              {isLoadingMore && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              )}
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
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} variant="compact" />
                  ))}
                  {isLoadingMoreEvents && (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                  )}
                  {hasMoreEvents && !isLoadingMoreEvents && (
                    <Button
                      variant="ghost"
                      className="w-full text-primary hover:text-primary/90"
                      onClick={loadMoreEvents}
                    >
                      Load More Events
                    </Button>
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

