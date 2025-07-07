"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, Users, Settings, ExternalLink, Copy, CheckCircle, Loader2 } from "lucide-react"
import { GoogleCalendarIntegration } from "@/components/google-calendar-integration"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { UserService, type UserProfile } from "@/lib/user-service"
import { BookingService } from "@/lib/booking-service"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    thisMonth: 0,
    upcoming: 0,
  })
  const [loading, setLoading] = useState(true)

  // Load user profile and booking stats
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.email) return

      setLoading(true)
      try {
        // Load or create user profile
        let profile = await UserService.getUserByEmail(session.user.email)

        if (!profile) {
          // Create new user profile
          profile = await UserService.upsertUser({
            email: session.user.email,
            name: session.user.name || undefined,
            avatar_url: session.user.image || undefined,
          })
        }

        if (profile) {
          setUserProfile(profile)

          // Load booking stats
          const stats = await BookingService.getBookingStats(session.user.email)
          setBookingStats(stats)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.email) {
      loadUserData()
    }
  }, [session, toast])

  const bookingUsername = userProfile?.username || session?.user?.email?.split("@")[0] || "user"
  const bookingLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://bookya.vercel.app"}/book/${bookingUsername}`

  const copyBookingLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Your booking link has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Please sign in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userInitials =
    userProfile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    session.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    session.user?.email?.[0]?.toUpperCase() ||
    "U"

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.name || session.user?.name || session.user?.email?.split("@")[0]}
          </p>
        </div>
        <Button asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile?.avatar_url || session.user?.image || ""} alt={userProfile?.name || ""} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{userProfile?.name || "Professional"}</h3>
              <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
              <Badge variant="secondary" className="mt-1">
                {userProfile?.title || "Professional"}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProfile?.bio && (
              <div>
                <label className="text-sm font-medium">Bio</label>
                <p className="text-sm text-muted-foreground mt-1">{userProfile.bio}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Your Booking Link</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 p-2 bg-muted rounded text-sm">{bookingLink}</code>
                <Button variant="outline" size="sm" onClick={copyBookingLink} className="shrink-0 bg-transparent">
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/book/${bookingUsername}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Meeting Duration:</span>
                <p>{userProfile?.meeting_duration || 30} minutes</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timezone:</span>
                <p>{userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.total}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Confirmed meetings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">Bookings this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished meetings</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>
            Connect your calendar to sync availability and automatically create meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleCalendarIntegration />
        </CardContent>
      </Card>
    </div>
  )
}
