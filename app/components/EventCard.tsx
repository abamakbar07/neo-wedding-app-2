"use client"

import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EventCardProps {
  event: {
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
  variant?: "default" | "compact"
}

export default function EventCard({ event, variant = "default" }: EventCardProps) {
  const heroStyle = {
    backgroundImage: event.customization.heroImage ? `url(${event.customization.heroImage})` : undefined,
    backgroundColor: event.customization.primaryColor,
  }

  if (variant === "compact") {
    return (
      <Link href={`/events/${event._id}`}>
        <Card className="overflow-hidden hover:shadow-sm transition-shadow">
          <div className="flex items-center p-3 gap-3">
            <div className="h-12 w-12 rounded-lg relative flex-shrink-0" style={heroStyle}>
              {!event.customization.heroImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-white opacity-50" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium truncate">{event.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <CalendarDays className="w-3 h-3" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/events/${event._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 relative" style={heroStyle}>
          {!event.customization.heroImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CalendarDays className="w-12 h-12 text-white opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h3 className="text-2xl font-semibold text-white px-4 text-center">{event.title}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">{event.venue.name}</p>
                <p className="text-sm text-gray-600">{event.venue.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 