"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, User, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    name: "",
    title: "",
    duration: 30,
    description: "",
  })
  const [bookingLink, setBookingLink] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/login")
      return
    }

    // Initialize user data from session
    setUserData((prev) => ({
      ...prev,
      name: session.user?.name || "",
    }))

    // Generate booking link
    if (session.user?.email) {
      const username = session.user.email.split("@")[0]
      setBookingLink(`${window.location.origin}/book/${username}`)
    }
  }, [session, status, router])

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleComplete = () => {
    // Save user preferences (in production, this would go to your database)
    const userProfile = {
      ...userData,
      email: session?.user?.email,
      createdAt: new Date().toISOString(),
      tier: "free",
    }
    localStorage.setItem("user", JSON.stringify(userProfile))

    toast({
      title: "Setup complete!",
      description: "Your booking page is ready. Welcome to BookYa!",
    })

    router.push("/dashboard")
  }

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingLink)
    toast({
      title: "Link copied!",
      description: "Your booking link has been copied to clipboard",
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen">
      <ThemeToggle />

      {/* Header */}
      <header className="border-b glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="logo text-2xl">
            BookYa
          </Link>
          <div className="flex items-center gap-2">
            <img src={session.user?.image || "/placeholder-user.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="text-sm">{session.user?.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= num
                        ? "bg-gradient-to-r from-accent to-accent-hover text-white"
                        : "glass-card text-muted-foreground"
                    }`}
                  >
                    {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  {num < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        step > num ? "bg-gradient-to-r from-accent to-accent-hover" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card className="glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome to BookYa!</CardTitle>
                <CardDescription>Let's set up your booking page in just a few steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="glass-input"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Your Title/Role</Label>
                  <Input
                    id="title"
                    value={userData.title}
                    onChange={(e) => setUserData({ ...userData, title: e.target.value })}
                    placeholder="e.g., UX Designer, Business Coach, Consultant"
                    className="glass-input"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Brief Description (Optional)</Label>
                  <Input
                    id="description"
                    value={userData.description}
                    onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                    placeholder="What do you help clients with?"
                    className="glass-input"
                  />
                </div>
                <Button
                  onClick={handleNext}
                  disabled={!userData.name}
                  className="w-full bg-gradient-to-r from-accent to-accent-hover hover:shadow-accent-glow"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Meeting Settings */}
          {step === 2 && (
            <Card className="glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Meeting Settings</CardTitle>
                <CardDescription>Configure your default meeting preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="duration">Default Meeting Duration</Label>
                  <select
                    id="duration"
                    value={userData.duration}
                    onChange={(e) => setUserData({ ...userData, duration: Number(e.target.value) })}
                    className="w-full p-3 glass-input rounded-lg border"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--accent)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div className="p-4 glass-card rounded-lg">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm space-y-2 opacity-70">
                    <li className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>We'll help you connect your Google Calendar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Set your availability hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Get your personalized booking link</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="glass-card hover:bg-accent/10">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-accent to-accent-hover hover:shadow-accent-glow"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Your Booking Link */}
          {step === 3 && (
            <Card className="glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">You're All Set! 🎉</CardTitle>
                <CardDescription>Your booking page is ready to share with clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 glass-card rounded-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent-hover rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {userData.name}
                    {userData.title && <span className="text-sm opacity-70 block">{userData.title}</span>}
                  </h3>
                  {userData.description && <p className="text-sm opacity-70 mb-4">{userData.description}</p>}
                  <div className="text-sm opacity-70">Default meeting: {userData.duration} minutes</div>
                </div>

                <div>
                  <Label>Your Booking Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={bookingLink} readOnly className="glass-input font-mono text-sm" />
                    <Button
                      onClick={copyBookingLink}
                      className="bg-gradient-to-r from-accent to-accent-hover hover:shadow-accent-glow"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open(bookingLink, "_blank")}
                    className="glass-card hover:bg-accent/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 bg-gradient-to-r from-accent to-accent-hover hover:shadow-accent-glow"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center text-sm opacity-70">
                  <p>You can customize everything later in your dashboard</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
