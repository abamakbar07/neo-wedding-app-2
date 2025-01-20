"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

interface EventCustomizerProps {
  eventId: string
  initialCustomization?: EventCustomization
}

interface EventCustomization {
  layout: "classic" | "modern" | "rustic"
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  heroImage: string
}

export default function EventCustomizer({ eventId, initialCustomization }: EventCustomizerProps) {
  const router = useRouter()
  const [customization, setCustomization] = useState<EventCustomization>(
    initialCustomization || {
      layout: "classic",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      fontFamily: "Inter",
      heroImage: "",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomization((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/events/${eventId}/customize`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customization),
      })

      if (response.ok) {
        router.push(`/events/${eventId}`)
      } else {
        console.error("Failed to update event customization")
      }
    } catch (error) {
      console.error("An error occurred", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
          Layout
        </label>
        <Select
          id="layout"
          name="layout"
          value={customization.layout}
          onChange={handleChange}
          className="mt-1 block w-full"
        >
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="rustic">Rustic</option>
        </Select>
      </div>
      <div>
        <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
          Primary Color
        </label>
        <Input
          type="color"
          id="primaryColor"
          name="primaryColor"
          value={customization.primaryColor}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
          Secondary Color
        </label>
        <Input
          type="color"
          id="secondaryColor"
          name="secondaryColor"
          value={customization.secondaryColor}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
          Font Family
        </label>
        <Select
          id="fontFamily"
          name="fontFamily"
          value={customization.fontFamily}
          onChange={handleChange}
          className="mt-1 block w-full"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Merriweather">Merriweather</option>
        </Select>
      </div>
      <div>
        <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700">
          Hero Image URL
        </label>
        <Input
          type="text"
          id="heroImage"
          name="heroImage"
          value={customization.heroImage}
          onChange={handleChange}
          className="mt-1 block w-full"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <Button type="submit" className="w-full">
        Save Customization
      </Button>
    </form>
  )
}

