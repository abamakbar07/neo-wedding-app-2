"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "../../../contexts/AuthContext"
import EventCustomizer from "../../components/EventCustomizer"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Gift, Clock } from "lucide-react"

interface Event {
  _id: string
  title: string
  date: string
  time: string
  venue: {
    name: string
    address: string
    mapsLink: string
  }
  description: string
  creator: string
  invitationCode: string
  guests: string[]
  contactInfo: {
    brideContact: string
    groomContact: string
    rsvpContact: string
  }
  customization: {
    layout: "classic" | "modern" | "rustic"
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    heroImage: string
  }
  schedule: Array<{
    time: string
    activity: string
  }>
  giftInfo: {
    bankAccount: string
    message: string
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
          <h1 className="text-4xl font-bold text-white">{event.title}</h1>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-b-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date and Time */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">When</h2>
            <p className="text-lg">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-lg">{event.time}</p>
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Where</h2>
            <p className="text-lg font-medium">{event.venue.name}</p>
            <p className="text-gray-600">{event.venue.address}</p>
            {event.venue.mapsLink && (
              <a
                href={event.venue.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View on Google Maps
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">About the Event</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* Schedule */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
          <div className="space-y-4">
            {event.schedule.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">{item.time}</p>
                  <p className="text-gray-600">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <div>
                <p className="text-sm text-gray-500">Bride</p>
                <p>{event.contactInfo.brideContact}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <div>
                <p className="text-sm text-gray-500">Groom</p>
                <p>{event.contactInfo.groomContact}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <div>
                <p className="text-sm text-gray-500">RSVP</p>
                <p>{event.contactInfo.rsvpContact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Information */}
        {(event.giftInfo.bankAccount || event.giftInfo.message) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Gift Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Gift className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  {event.giftInfo.message && (
                    <p className="text-gray-600 mb-2">{event.giftInfo.message}</p>
                  )}
                  {event.giftInfo.bankAccount && (
                    <p className="font-medium">{event.giftInfo.bankAccount}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Controls */}
        {user && user.id === event.creator && (
          <div className="mt-8">
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white">
              Edit Event
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

