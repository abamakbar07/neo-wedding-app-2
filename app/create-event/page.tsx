"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User } from "../../contexts/types"

export default function CreateEvent() {
  const router = useRouter()
  const { user } = useAuth() as { user: User | null }
  const [error, setError] = useState<string>("")
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: "",
    description: "",
    invitationCode: generateInvitationCode(), // Helper function to generate unique code
  })

  if (!user) {
    router.push("/login")
    return null
  }

  function generateInvitationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    if (!user?._id) {
      setError("User not authenticated")
      return
    }
  
    try {
      const eventData = {
        ...eventDetails,
        creator: user._id, // Ensure creator ID is included
        guests: [],
        customization: {
          layout: "classic",
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
          fontFamily: "Inter",
          heroImage: "",
        },
      }
  
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create event")
      }
  
      const data = await response.json()
      router.push(`/events/${data._id}`) // Note: using _id instead of id
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={eventDetails.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            required
            value={eventDetails.date}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Event Description
          </label>
          <Textarea
            id="description"
            name="description"
            required
            value={eventDetails.description}
            onChange={handleChange}
            rows={4}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-1">
            Invitation Code
          </label>
          <Input
            id="invitationCode"
            name="invitationCode"
            type="text"
            readOnly
            value={eventDetails.invitationCode}
            className="w-full bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">
            This is your unique event code that guests will use to join
          </p>
        </div>

        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </div>
  )
}


