"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CalendarConnection {
  provider: string
  connected: boolean
  email?: string
  lastSync?: string
  icon: string
}

interface SimpleCalendarIntegrationProps {
  onAvailabilityChange: (availableSlots: any[]) => void
  timeSlots: any[]
}

export function SimpleCalendarIntegration({ onAvailabilityChange, timeSlots }: SimpleCalendarIntegrationProps) {
  const { toast } = useToast()
  const [connections, setConnections] = useState<CalendarConnection[]>([
    { provider: "Google Calendar", connected: false, icon: "🗓️" },
  ])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Check for existing connections in localStorage
    const savedConnections = localStorage.getItem("calendarConnections")
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections))
    }
  }, [])

  const connectCalendar = async (provider: string) => {
    setIsConnecting(provider)

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful connection
      const updatedConnections = connections.map((conn) =>
        conn.provider === provider
          ? {
              ...conn,
              connected: true,
              email: "user@gmail.com",
              lastSync: new Date().toISOString(),
            }
          : conn,
      )

      setConnections(updatedConnections)
      localStorage.setItem("calendarConnections", JSON.stringify(updatedConnections))

      toast({
        title: `${provider} connected!`,
        description: "Your calendar is now synced and will automatically check for conflicts.",
      })

      // Auto-sync after connection
      setTimeout(() => syncAvailability(), 1000)
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "There was an error connecting your calendar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(null)
    }
  }

  const disconnectCalendar = (provider: string) => {
    const updatedConnections = connections.map((conn) =>
      conn.provider === provider ? { ...conn, connected: false, email: undefined, lastSync: undefined } : conn,
    )

    setConnections(updatedConnections)
    localStorage.setItem("calendarConnections", JSON.stringify(updatedConnections))

    toast({
      title: "Calendar disconnected",
      description: `${provider} has been disconnected from your account.`,
    })
  }

  const syncAvailability = async () => {
    const connectedCalendars = connections.filter((c) => c.connected)
    if (connectedCalendars.length === 0) {
      toast({
        title: "No calendars connected",
        description: "Connect a calendar first to sync your availability.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)

    try {
      // Simulate checking calendar events
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock filtering out conflicting slots
      const availableSlots = timeSlots.filter((_, index) => {
        // Simulate some slots being busy based on connected calendars
        if (connectedCalendars.length === 1) {
          return index % 4 !== 0 // Remove every 4th slot
        } else {
          return index % 3 !== 0 // Remove every 3rd slot if multiple calendars
        }
      })

      onAvailabilityChange(availableSlots)

      // Update last sync time
      const updatedConnections = connections.map((conn) =>
        conn.connected ? { ...conn, lastSync: new Date().toISOString() } : conn,
      )
      setConnections(updatedConnections)
      localStorage.setItem("calendarConnections", JSON.stringify(updatedConnections))

      const conflictCount = timeSlots.length - availableSlots.length

      toast({
        title: "Availability synced!",
        description: `Found ${availableSlots.length} available slots. ${conflictCount} slots were blocked due to calendar conflicts.`,
      })
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "There was an error syncing your calendar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return "Never"
    const date = new Date(lastSync)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your calendars to automatically prevent double bookings. We'll sync your availability in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar connections */}
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.provider} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{connection.icon}</div>
                <div>
                  <p className="font-medium">{connection.provider}</p>
                  {connection.connected ? (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Connected as {connection.email}
                      </p>
                      <p>Last sync: {formatLastSync(connection.lastSync)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-gray-400" />
                      Not connected
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {connection.connected ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => disconnectCalendar(connection.provider)}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => connectCalendar(connection.provider)}
                    disabled={isConnecting === connection.provider}
                  >
                    {isConnecting === connection.provider ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sync button */}
        {connections.some((c) => c.connected) && (
          <div className="pt-4 border-t">
            <Button onClick={syncAvailability} disabled={isSyncing} className="w-full">
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing availability...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync availability now
                </>
              )}
            </Button>
            <p className="text-xs text-gray-600 text-center mt-2">
              This will check your connected calendars for conflicts and update your available time slots
            </p>
          </div>
        )}

        {/* Instructions */}
        {!connections.some((c) => c.connected) && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">🚀 Quick Setup</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Click "Connect" next to your calendar</p>
              <p>2. Sign in with your Google account</p>
              <p>3. Grant permission to read your calendar</p>
              <p>4. We'll automatically sync your availability!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
