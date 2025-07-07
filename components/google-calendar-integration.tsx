"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Calendar, Clock, RefreshCw, CheckCircle, AlertCircle, Users } from "lucide-react"

interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  status: string
  attendees?: Array<{ email: string }>
}

interface CalendarStats {
  totalEvents: number
  busySlots: number
  availableSlots: number
}

export function GoogleCalendarIntegration() {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    busySlots: 0,
    availableSlots: 40,
  })
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    if (session?.accessToken) {
      setIsConnected(true)
      syncCalendar()
    }
  }, [session])

  const syncCalendar = async () => {
    if (!session?.accessToken) {
      toast.error("No access token found. Please reconnect your Google account.")
      setIsConnected(false)
      return
    }

    setIsSyncing(true)
    try {
      const response = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setEvents(data.events || [])
        setStats({
          totalEvents: data.events?.length || 0,
          busySlots: data.events?.filter((e: CalendarEvent) => e.status === "confirmed").length || 0,
          availableSlots: 40 - (data.events?.filter((e: CalendarEvent) => e.status === "confirmed").length || 0),
        })
        setLastSync(new Date())
        toast.success(`Synced ${data.events?.length || 0} calendar events`)
      } else {
        throw new Error(data.error || "Failed to sync calendar")
      }
    } catch (error) {
      console.error("Calendar sync error:", error)
      toast.error("Sync failed: " + (error instanceof Error ? error.message : "Unknown error"))

      // If it's an auth error, mark as disconnected
      if (error instanceof Error && error.message.includes("401")) {
        setIsConnected(false)
      }
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setEvents([])
    setStats({ totalEvents: 0, busySlots: 0, availableSlots: 40 })
    setLastSync(null)
    toast.success("Google Calendar disconnected")
  }

  const formatEventTime = (event: CalendarEvent) => {
    const start = event.start.dateTime || event.start.date
    const end = event.end.dateTime || event.end.date

    if (!start) return "No time"

    const startDate = new Date(start)
    const endDate = new Date(end || start)

    if (event.start.date) {
      // All-day event
      return "All day"
    }

    return `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter((event) => {
        const eventDate = new Date(event.start.dateTime || event.start.date || "")
        return eventDate > now
      })
      .sort((a, b) => {
        const dateA = new Date(a.start.dateTime || a.start.date || "")
        const dateB = new Date(b.start.dateTime || b.start.date || "")
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 5)
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integration
          </CardTitle>
          <CardDescription>Sign in to connect your Google Calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please sign in to access calendar integration features.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integration
          </CardTitle>
          <CardDescription>Connect your calendar to sync availability and prevent double bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Your Google Calendar is connected and syncing automatically.
                  </p>
                  {lastSync && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Last synced: {lastSync.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">Calendar not connected</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Sign in with Google to enable calendar sync
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Provider */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Google Calendar</p>
                <p className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Not connected"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isConnected && (
                <Button variant="outline" size="sm" onClick={syncCalendar} disabled={isSyncing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </Button>
              )}
              {isConnected ? (
                <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              ) : (
                <Button size="sm" onClick={() => (window.location.href = "/api/auth/signin")}>
                  Connect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Stats */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.totalEvents}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.busySlots}</p>
                  <p className="text-sm text-muted-foreground">Busy Slots</p>
                  <p className="text-xs text-muted-foreground">Unavailable times</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.availableSlots}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-xs text-muted-foreground">Open slots</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upcoming Events */}
      {isConnected && events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next {getUpcomingEvents().length} calendar events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getUpcomingEvents().map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium">{event.summary || "Untitled Event"}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatEventTime(event)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.start.dateTime || event.start.date || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={event.status === "confirmed" ? "default" : "secondary"}>
                    {event.status === "confirmed" ? "Busy" : "Free"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
