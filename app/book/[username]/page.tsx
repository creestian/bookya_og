"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, Video, MapPin, CheckCircle, Loader2, User } from "lucide-react"
import { format, startOfDay } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { UserService, type UserProfile } from "@/lib/user-service"

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookingPage() {
  const params = useParams()
  const username = params.username as string
  const { toast } = useToast()

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Form data
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [message, setMessage] = useState("")

  // Load user profile based on username
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!username) return

      setProfileLoading(true)
      try {
        console.log("👤 Looking up user profile for username:", username)
        let profile = await UserService.getUserByUsername(username)

        if (!profile) {
          // Create a basic profile if user doesn't exist
          console.log("👤 Creating basic profile for username:", username)
          const hostEmail = `${username}@gmail.com` // This would be replaced with actual user lookup
          profile = await UserService.upsertUser({
            email: hostEmail,
            username: username,
            name: username
              .split(".")
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" "),
          })
        }

        if (profile) {
          setUserProfile(profile)
          console.log("✅ User profile loaded:", profile.name)
        } else {
          throw new Error("Failed to load or create user profile")
        }
      } catch (error) {
        console.error("Failed to load user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setProfileLoading(false)
      }
    }

    loadUserProfile()
  }, [username, toast])

  // Generate available time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9 // 9 AM
    const endHour = 17 // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push({
          time,
          available: Math.random() > 0.3, // 70% chance of being available
        })
      }
    }

    return slots
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setSelectedTime("")
      setAvailableSlots(generateTimeSlots())
      setCurrentStep(2)
    }
  }

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCurrentStep(3)
  }

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !guestName || !guestEmail || !userProfile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/calendar/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userProfile.username,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          guestName,
          guestEmail,
          message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setBookingDetails(result)
        setIsBookingConfirmed(true)
        toast({
          title: "Booking Confirmed!",
          description: "Your meeting has been scheduled successfully.",
        })
      } else {
        throw new Error(result.error || "Booking failed")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">The user profile you're looking for doesn't exist.</p>
            <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isBookingConfirmed && bookingDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your meeting with {userProfile.name} has been scheduled</p>
            </div>

            <div className="space-y-2 text-left bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{format(selectedDate!, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Google Meet link will be sent via email</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 mt-0.5">📧</div>
                <div>
                  A calendar invitation and meeting details have been sent to <strong>{guestEmail}</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => (window.location.href = `mailto:${userProfile.email}`)}
              >
                Contact Host
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setIsBookingConfirmed(false)
                  setCurrentStep(1)
                  setSelectedDate(undefined)
                  setSelectedTime("")
                  setGuestName("")
                  setGuestEmail("")
                  setMessage("")
                }}
              >
                Book Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userInitials =
    userProfile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userProfile.avatar_url || "/placeholder.svg"} alt={userProfile.name || ""} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About {userProfile.name?.split(" ")[0] || "Host"}</h2>
              <p className="text-muted-foreground leading-relaxed">{userProfile.bio}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Meeting Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{userProfile.meeting_duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4" />
                  <span>Video call via Google Meet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.timezone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Flow */}
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && <div className={`w-8 h-0.5 mx-2 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className={currentStep >= 1 ? "text-foreground" : ""}>Date</span>
                <span>→</span>
                <span className={currentStep >= 2 ? "text-foreground" : ""}>Time</span>
                <span>→</span>
                <span className={currentStep >= 3 ? "text-foreground" : ""}>Details</span>
              </div>
            </div>

            {/* Step 1: Date Selection */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Date</CardTitle>
                  <CardDescription>Pick a day that works for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < startOfDay(new Date()) || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Time Selection */}
            {currentStep === 2 && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Time</CardTitle>
                  <CardDescription>Available times for {format(selectedDate, "EEEE, MMMM d")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                        className="justify-center"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                  <Button variant="ghost" onClick={() => setCurrentStep(1)} className="w-full mt-4">
                    ← Back to date selection
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Details Form */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                  <CardDescription>
                    Meeting on {selectedDate && format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optional)</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Anything you'd like to share about the meeting?"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                        ← Back
                      </Button>
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by</p>
          <p className="font-semibold text-lg">BookYa</p>
          <p>Simple booking for busy professionals</p>
          <Button variant="link" className="mt-2" onClick={() => (window.location.href = "/")}>
            Create Your Own Booking Page
          </Button>
        </div>
      </div>
    </div>
  )
}
