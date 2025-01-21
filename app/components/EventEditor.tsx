"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CalendarDays, MapPin, Phone, Gift, Clock, Plus, Trash2, Eye } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface EventEditorProps {
  event: {
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
    contactInfo: {
      brideContact: string
      groomContact: string
      rsvpContact: string
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
  onCancel: () => void
}

interface EventDetails {
  title: string
  date: string
  time: string
  venue: {
    name: string
    address: string
    mapsLink: string
  }
  description: string
  contactInfo: {
    brideContact: string
    groomContact: string
    rsvpContact: string
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

export default function EventEditor({ event, onCancel }: EventEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    title: event.title,
    date: event.date.split('T')[0],
    time: event.time,
    venue: event.venue,
    description: event.description,
    contactInfo: event.contactInfo,
    schedule: event.schedule,
    giftInfo: event.giftInfo,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const nameParts = name.split(".")
    
    if (nameParts.length === 1) {
      setEventDetails(prev => ({ ...prev, [name]: value }))
    } else {
      const [section, field] = nameParts
      setEventDetails(prev => {
        const sectionKey = section as keyof EventDetails
        if (typeof prev[sectionKey] === 'object' && prev[sectionKey] !== null) {
          return {
            ...prev,
            [section]: {
              ...prev[sectionKey],
              [field]: value
            }
          }
        }
        return prev
      })
    }
  }

  const handleScheduleChange = (index: number, field: string, value: string) => {
    setEventDetails(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const addScheduleItem = () => {
    setEventDetails(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: "", activity: "" }],
    }))
  }

  const removeScheduleItem = (index: number) => {
    setEventDetails(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Basic validations
    if (eventDetails.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters"
    }

    if (!eventDetails.date) {
      errors.date = "Date is required"
    } else {
      const eventDate = new Date(eventDetails.date)
      if (eventDate < new Date()) {
        errors.date = "Event date cannot be in the past"
      }
    }

    if (!eventDetails.time) {
      errors.time = "Time is required"
    }

    // Venue validations
    if (!eventDetails.venue.name.trim()) {
      errors["venue.name"] = "Venue name is required"
    }
    if (!eventDetails.venue.address.trim()) {
      errors["venue.address"] = "Venue address is required"
    }
    if (eventDetails.venue.mapsLink && !isValidUrl(eventDetails.venue.mapsLink)) {
      errors["venue.mapsLink"] = "Please enter a valid URL"
    }

    // Contact validations
    if (!eventDetails.contactInfo.brideContact.trim()) {
      errors["contactInfo.brideContact"] = "Bride contact is required"
    }
    if (!eventDetails.contactInfo.groomContact.trim()) {
      errors["contactInfo.groomContact"] = "Groom contact is required"
    }
    if (!eventDetails.contactInfo.rsvpContact.trim()) {
      errors["contactInfo.rsvpContact"] = "RSVP contact is required"
    }

    // Schedule validations
    if (eventDetails.schedule.length === 0) {
      errors.schedule = "At least one schedule item is required"
    } else {
      eventDetails.schedule.forEach((item, index) => {
        if (!item.time) {
          errors[`schedule.${index}.time`] = "Time is required"
        }
        if (!item.activity.trim()) {
          errors[`schedule.${index}.activity`] = "Activity is required"
        }
      })
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      toast.error("Please fix the validation errors")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update event")
      }

      toast.success("Event updated successfully!")
      router.refresh()
      onCancel()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getErrorMessage = (field: string) => {
    return validationErrors[field] ? (
      <p className="text-sm text-red-500 mt-1">{validationErrors[field]}</p>
    ) : null
  }

  const sortScheduleByTime = () => {
    setEventDetails(prev => ({
      ...prev,
      schedule: [...prev.schedule].sort((a, b) => a.time.localeCompare(b.time))
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2 mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">{eventDetails.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preview content similar to event detail page */}
                <div>
                  <h3 className="font-semibold mb-2">Date & Time</h3>
                  <p>{new Date(eventDetails.date).toLocaleDateString()}</p>
                  <p>{eventDetails.time}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Venue</h3>
                  <p>{eventDetails.venue.name}</p>
                  <p>{eventDetails.venue.address}</p>
                </div>
              </div>
              {/* Add more preview sections as needed */}
            </div>
          </DialogContent>
        </Dialog>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={sortScheduleByTime}
          className="gap-2"
        >
          <Clock className="w-4 h-4" />
          Sort Schedule
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <Input
              id="title"
              name="title"
              value={eventDetails.title}
              onChange={handleChange}
              required
              className={validationErrors.title ? "border-red-500" : ""}
            />
            {getErrorMessage("title")}
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={eventDetails.date}
              onChange={handleChange}
              required
              className={validationErrors.date ? "border-red-500" : ""}
            />
            {getErrorMessage("date")}
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <Input
              id="time"
              name="time"
              type="time"
              value={eventDetails.time}
              onChange={handleChange}
              required
              className={validationErrors.time ? "border-red-500" : ""}
            />
            {getErrorMessage("time")}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Venue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="venue.name" className="block text-sm font-medium text-gray-700 mb-1">
              Venue Name
            </label>
            <Input
              id="venue.name"
              name="venue.name"
              value={eventDetails.venue.name}
              onChange={handleChange}
              required
              className={validationErrors["venue.name"] ? "border-red-500" : ""}
            />
            {getErrorMessage("venue.name")}
          </div>
          <div>
            <label htmlFor="venue.address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Input
              id="venue.address"
              name="venue.address"
              value={eventDetails.venue.address}
              onChange={handleChange}
              required
              className={validationErrors["venue.address"] ? "border-red-500" : ""}
            />
            {getErrorMessage("venue.address")}
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
              placeholder="https://maps.google.com/..."
              className={validationErrors["venue.mapsLink"] ? "border-red-500" : ""}
            />
            {getErrorMessage("venue.mapsLink")}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={eventDetails.description}
          onChange={handleChange}
          rows={4}
          required
          className={validationErrors.description ? "border-red-500" : ""}
        />
        {getErrorMessage("description")}
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
              value={eventDetails.contactInfo.brideContact}
              onChange={handleChange}
              required
              className={validationErrors["contactInfo.brideContact"] ? "border-red-500" : ""}
            />
            {getErrorMessage("contactInfo.brideContact")}
          </div>
          <div>
            <label htmlFor="contactInfo.groomContact" className="block text-sm font-medium text-gray-700 mb-1">
              Groom Contact
            </label>
            <Input
              id="contactInfo.groomContact"
              name="contactInfo.groomContact"
              value={eventDetails.contactInfo.groomContact}
              onChange={handleChange}
              required
              className={validationErrors["contactInfo.groomContact"] ? "border-red-500" : ""}
            />
            {getErrorMessage("contactInfo.groomContact")}
          </div>
          <div>
            <label htmlFor="contactInfo.rsvpContact" className="block text-sm font-medium text-gray-700 mb-1">
              RSVP Contact
            </label>
            <Input
              id="contactInfo.rsvpContact"
              name="contactInfo.rsvpContact"
              value={eventDetails.contactInfo.rsvpContact}
              onChange={handleChange}
              required
              className={validationErrors["contactInfo.rsvpContact"] ? "border-red-500" : ""}
            />
            {getErrorMessage("contactInfo.rsvpContact")}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Schedule</h2>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addScheduleItem}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {eventDetails.schedule.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  type="time"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                  required
                  className={validationErrors[`schedule.${index}.time`] ? "border-red-500" : ""}
                />
                {getErrorMessage(`schedule.${index}.time`)}
              </div>
              <div className="flex-[2]">
                <Input
                  type="text"
                  value={item.activity}
                  onChange={(e) => handleScheduleChange(index, "activity", e.target.value)}
                  placeholder="Activity"
                  required
                  className={validationErrors[`schedule.${index}.activity`] ? "border-red-500" : ""}
                />
                {getErrorMessage(`schedule.${index}.activity`)}
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeScheduleItem(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Gift Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="giftInfo.bankAccount" className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account Details
            </label>
            <Input
              id="giftInfo.bankAccount"
              name="giftInfo.bankAccount"
              value={eventDetails.giftInfo.bankAccount}
              onChange={handleChange}
              placeholder="Bank account number or payment details"
              className={validationErrors["giftInfo.bankAccount"] ? "border-red-500" : ""}
            />
            {getErrorMessage("giftInfo.bankAccount")}
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
              placeholder="Optional message about gifts"
              className={validationErrors["giftInfo.message"] ? "border-red-500" : ""}
            />
            {getErrorMessage("giftInfo.message")}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
} 