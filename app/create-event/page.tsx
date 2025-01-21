"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User } from "../../contexts/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventDetails {
  title: string;
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
    mapsLink: string;
  };
  description: string;
  invitationCode: string;
  contactInfo: {
    brideContact: string;
    groomContact: string;
    rsvpContact: string;
  };
  customization: {
    layout: "classic" | "modern" | "rustic";
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    heroImage: string;
  };
  giftInfo: {
    bankAccount: string;
    message: string;
  };
}

interface ScheduleItem {
  time: string;
  activity: string;
}

export default function CreateEvent() {
  const router = useRouter()
  const { user } = useAuth() as { user: User | null }
  const [error, setError] = useState<string>("")
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{ time: "", activity: "" }])
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    title: "",
    date: "",
    time: "",
    venue: {
      name: "",
      address: "",
      mapsLink: "",
    },
    description: "",
    invitationCode: generateInvitationCode(),
    contactInfo: {
      brideContact: "",
      groomContact: "",
      rsvpContact: "",
    },
    customization: {
      layout: "classic",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      fontFamily: "Inter",
      heroImage: "",
    },
    giftInfo: {
      bankAccount: "",
      message: "",
    },
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
    const nameParts = name.split(".")
    
    if (nameParts.length === 1) {
      setEventDetails((prev) => ({ ...prev, [name]: value }))
    } else {
      const [section, field] = nameParts
      setEventDetails((prev: EventDetails) => {
        const sectionKey = section as keyof EventDetails
        const currentSection = prev[sectionKey] as Record<string, string>
        
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value,
          },
        }
      })
    }
  }

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...scheduleItems]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setScheduleItems(newSchedule)
  }

  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, { time: "", activity: "" }])
  }

  const removeScheduleItem = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index))
  }

  const handleLayoutChange = (value: string) => {
    setEventDetails((prev: EventDetails) => ({
      ...prev,
      customization: {
        ...prev.customization,
        layout: value as "classic" | "modern" | "rustic",
      },
    }))
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
        creator: user._id,
        guests: [],
        schedule: scheduleItems,
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
      router.push(`/events/${data._id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Wedding Event</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              value={eventDetails.title}
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
              type="date"
              required
              value={eventDetails.date}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Event Time
            </label>
            <Input
              id="time"
              name="time"
              type="time"
              required
              value={eventDetails.time}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Venue Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venue.name" className="block text-sm font-medium text-gray-700 mb-1">
                Venue Name
              </label>
              <Input
                id="venue.name"
                name="venue.name"
                type="text"
                required
                value={eventDetails.venue.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="venue.address" className="block text-sm font-medium text-gray-700 mb-1">
                Venue Address
              </label>
              <Input
                id="venue.address"
                name="venue.address"
                type="text"
                required
                value={eventDetails.venue.address}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="venue.mapsLink" className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Link
              </label>
              <Input
                id="venue.mapsLink"
                name="venue.mapsLink"
                type="url"
                value={eventDetails.venue.mapsLink}
                onChange={handleChange}
                className="w-full"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="contactInfo.brideContact" className="block text-sm font-medium text-gray-700 mb-1">
                Bride Contact
              </label>
              <Input
                id="contactInfo.brideContact"
                name="contactInfo.brideContact"
                type="text"
                required
                value={eventDetails.contactInfo.brideContact}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="contactInfo.groomContact" className="block text-sm font-medium text-gray-700 mb-1">
                Groom Contact
              </label>
              <Input
                id="contactInfo.groomContact"
                name="contactInfo.groomContact"
                type="text"
                required
                value={eventDetails.contactInfo.groomContact}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="contactInfo.rsvpContact" className="block text-sm font-medium text-gray-700 mb-1">
                RSVP Contact
              </label>
              <Input
                id="contactInfo.rsvpContact"
                name="contactInfo.rsvpContact"
                type="text"
                required
                value={eventDetails.contactInfo.rsvpContact}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Event Schedule</h2>
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  type="time"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                  placeholder="Time"
                  required
                />
              </div>
              <div className="flex-[2]">
                <Input
                  type="text"
                  value={item.activity}
                  onChange={(e) => handleScheduleChange(index, "activity", e.target.value)}
                  placeholder="Activity"
                  required
                />
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeScheduleItem(index)}
                  className="mt-0"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addScheduleItem}>
            Add Schedule Item
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gift Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="giftInfo.bankAccount" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account Details
              </label>
              <Input
                id="giftInfo.bankAccount"
                name="giftInfo.bankAccount"
                type="text"
                value={eventDetails.giftInfo.bankAccount}
                onChange={handleChange}
                className="w-full"
                placeholder="Bank account number or payment details"
              />
            </div>
            <div>
              <label htmlFor="giftInfo.message" className="block text-sm font-medium text-gray-700 mb-1">
                Gift Message
              </label>
              <Textarea
                id="giftInfo.message"
                name="giftInfo.message"
                value={eventDetails.giftInfo.message}
                onChange={handleChange}
                className="w-full"
                placeholder="Optional message about gifts"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Customization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Layout Style
              </label>
              <Select value={eventDetails.customization.layout} onValueChange={handleLayoutChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="rustic">Rustic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="customization.primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <Input
                id="customization.primaryColor"
                name="customization.primaryColor"
                type="color"
                value={eventDetails.customization.primaryColor}
                onChange={handleChange}
                className="w-full h-10"
              />
            </div>
            <div>
              <label htmlFor="customization.secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <Input
                id="customization.secondaryColor"
                name="customization.secondaryColor"
                type="color"
                value={eventDetails.customization.secondaryColor}
                onChange={handleChange}
                className="w-full h-10"
              />
            </div>
            <div>
              <label htmlFor="customization.heroImage" className="block text-sm font-medium text-gray-700 mb-1">
                Hero Image URL
              </label>
              <Input
                id="customization.heroImage"
                name="customization.heroImage"
                type="url"
                value={eventDetails.customization.heroImage}
                onChange={handleChange}
                className="w-full"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
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
          Create Wedding Event
        </Button>
      </form>
    </div>
  )
}


