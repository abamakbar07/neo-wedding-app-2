"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import EventCustomizer from "../components/EventCustomizer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateEvent() {
  const router = useRouter()
  const { user } = useAuth()
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: "",
    description: "",
  })
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [eventId, setEventId] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eventDetails, creator: user?.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setEventId(data.id)
        setShowCustomizer(true)
      } else {
        console.error("Failed to create event")
      }
    } catch (error) {
      console.error("An error occurred", error)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (showCustomizer && eventId) {
    return <EventCustomizer eventId={eventId} />
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={eventDetails.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Event Date
          </label>
          <Input
            type="date"
            id="date"
            name="date"
            value={eventDetails.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Event Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
            rows={4}
          />
        </div>
        <Button type="submit" className="w-full">
          Create Event and Customize
        </Button>
      </form>
    </div>
  )
}

