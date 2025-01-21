"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "../../../contexts/AuthContext"
import EventCustomizer from "../../components/EventCustomizer"
import { Button } from "@/components/ui/button"

interface Event {
  _id: string
  name: string
  date: string
  description: string
  creator: string
  invitationCode: string
  guests: string[]
  customization: {
    layout: "classic" | "modern" | "rustic"
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    heroImage: string
  }
}

export default function EventPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`)
        if (response.ok) {
          const eventData = await response.json()
          setEvent(eventData)
        } else {
          console.error("Failed to fetch event data")
        }
      } catch (error) {
        console.error("An error occurred", error)
      }
    }

    fetchEvent()
  }, [id])

  if (!event) {
    return <div>Loading...</div>
  }

  const { customization } = event

  const containerStyle = {
    fontFamily: customization.fontFamily,
    "--primary-color": customization.primaryColor,
    "--secondary-color": customization.secondaryColor,
  } as React.CSSProperties

  const heroStyle = {
    backgroundImage: `url(${customization.heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  if (isEditing) {
    return <EventCustomizer eventId={event._id} initialCustomization={customization} />
  }

  return (
    <div className={`max-w-4xl mx-auto mt-8 ${customization.layout}`} style={containerStyle}>
      <div className="relative h-64 rounded-t-lg overflow-hidden" style={heroStyle}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{event.name}</h1>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-b-lg p-6">
        <p className="text-lg mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-6">{event.description}</p>
        {user && user.id === event.creator && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white">
            Edit Event
          </Button>
        )}
      </div>
    </div>
  )
}

