"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function DemoPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [step, setStep] = useState(1)

  const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(2)
  }

  const handleBooking = () => {
    setStep(3)
  }

  return (
    <div className="min-h-screen">
      <ThemeToggle />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            BookYa
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/demo">Demo</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light mb-4">BookYa Demo</h1>
            <p className="text-xl opacity-70">Experience how easy it is to book time with professionals using BookYa</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Demo Booking Interface */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <CardTitle>Book with Jane Doe</CardTitle>
                      <CardDescription>UX Design Consultant</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Clock className="w-4 h-4" />
                    <span>30 minutes • Google Meet</span>
                  </div>
                </CardHeader>

                <CardContent>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-medium mb-3 block">Select a date</Label>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {/* Simple date picker simulation */}
                          {Array.from({ length: 14 }, (_, i) => {
                            const date = new Date()
                            date.setDate(date.getDate() + i)
                            const isSelected = selectedDate === date.toDateString()
                            return (
                              <button
                                key={i}
                                onClick={() => setSelectedDate(date.toDateString())}
                                className={`p-2 text-sm rounded-lg border transition-all ${
                                  isSelected
                                    ? "bg-gradient-to-r from-accent to-accent-hover text-white border-accent"
                                    : "glass-card hover:border-accent/50"
                                }`}
                              >
                                <div className="text-xs opacity-70">
                                  {date.toLocaleDateString("en", { weekday: "short" })}
                                </div>
                                <div className="font-medium">{date.getDate()}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {selectedDate && (
                        <div>
                          <Label className="text-base font-medium mb-3 block">Available times</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {availableTimes.map((time) => (
                              <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className="p-3 text-sm glass-card hover:bg-accent/10 hover:border-accent/50 transition-all rounded-lg border"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="p-4 glass-card rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} />
                          <span className="font-medium">Selected Time</span>
                        </div>
                        <p className="text-sm opacity-70">
                          {new Date(selectedDate).toLocaleDateString("en", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at {selectedTime}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" placeholder="Enter your full name" className="glass-input" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" placeholder="Enter your email" className="glass-input" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input id="phone" placeholder="Enter your phone number" className="glass-input" />
                        </div>
                        <div>
                          <Label htmlFor="message">Message (optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell me what you'd like to discuss..."
                            className="glass-input"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep(1)} className="glass-card hover:bg-accent/10">
                          Back
                        </Button>
                        <Button
                          onClick={handleBooking}
                          className="flex-1 bg-gradient-to-r from-accent to-accent-hover hover:shadow-accent-glow"
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
                        <p className="opacity-70 mb-4">
                          You'll receive a confirmation email with the meeting details and calendar invite.
                        </p>
                        <div className="p-4 glass-card rounded-lg text-left">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>30 minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Jane Doe - UX Design Consultant</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setStep(1)
                          setSelectedDate("")
                          setSelectedTime("")
                        }}
                        variant="outline"
                        className="glass-card hover:bg-accent/10"
                      >
                        Book Another Time
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Information */}
            <div className="space-y-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>This is a Demo</CardTitle>
                  <CardDescription>
                    You're experiencing BookYa from a client's perspective. This is what your booking page would look
                    like.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-accent to-accent-hover rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Easy Date Selection</h4>
                        <p className="text-sm opacity-70">
                          Clients can quickly see available dates and pick what works for them.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-accent to-accent-hover rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Time Slot Selection</h4>
                        <p className="text-sm opacity-70">
                          Only available times are shown, preventing double bookings automatically.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-accent to-accent-hover rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Contact Information</h4>
                        <p className="text-sm opacity-70">
                          Collect the information you need with customizable form fields.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-accent to-accent-hover rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Instant Confirmation</h4>
                        <p className="text-sm opacity-70">
                          Both you and your client get immediate confirmation with calendar invites.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Ready to create your own?</CardTitle>
                  <CardDescription>Get your professional booking page set up in under 2 minutes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/auth/signup" className="btn-primary w-full text-center block py-3">
                    Create Your Booking Page
                    <ArrowRight className="inline-block ml-2 w-4 h-4" />
                  </Link>
                  <Link href="/pricing" className="btn-secondary w-full text-center block py-3">
                    View Pricing Plans
                  </Link>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Features You'll Get</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-hover rounded-full"></div>
                      <span>Google Calendar integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-hover rounded-full"></div>
                      <span>Automatic email confirmations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-hover rounded-full"></div>
                      <span>Mobile-responsive design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-hover rounded-full"></div>
                      <span>Customizable booking forms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-hover rounded-full"></div>
                      <span>Time zone detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-hover rounded-full"></div>
                      <span>Buffer time settings</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Link href="/" className="logo text-2xl mb-4 md:mb-0">
              BookYa
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Home
              </Link>
              <Link href="/pricing" className="hover:opacity-70 transition-opacity">
                Pricing
              </Link>
              <Link href="/demo" className="hover:opacity-70 transition-opacity">
                Demo
              </Link>
              <Link href="/auth/login" className="hover:opacity-70 transition-opacity">
                Login
              </Link>
              <Link href="/auth/signup" className="hover:opacity-70 transition-opacity">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="text-center text-sm opacity-70">
            <p>© 2024 BookYa. Simple booking for busy professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
