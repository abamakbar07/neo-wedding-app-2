"use client"

import { useState } from "react"

interface EventInvitationProps {
  eventId: string
  eventName: string
  eventDate: string
}

export default function EventInvitation({ eventId, eventName, eventDate }: EventInvitationProps) {
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null)

  const handleRsvp = async (response: "yes" | "no") => {
    // TODO: Implement RSVP logic with API call
    setRsvp(response)
    console.log(`RSVP ${response} for event ${eventId}`)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold mb-2">{eventName}</h2>
      <p className="text-gray-600 mb-4">Date: {eventDate}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => handleRsvp("yes")}
          className={`px-4 py-2 rounded ${rsvp === "yes" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Yes
        </button>
        <button
          onClick={() => handleRsvp("no")}
          className={`px-4 py-2 rounded ${rsvp === "no" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          No
        </button>
      </div>
    </div>
  )
}

