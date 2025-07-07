"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CalendarConnection {
  provider: string
  connected: boolean
  email?: string
  lastSync?: string
}

interface CalendarIntegrationProps {
  onAvailabilityChange: (availableSlots: any[]) => void
  timeSlots: any[]
}

export function CalendarIntegration({ onAvailabilityChange, timeSlots }: CalendarIntegrationProps) {
  const { toast } = useToast()
  const [connections, setConnections] = useState<CalendarConnection[]>([
    { provider: "Google Calendar", connected: false },
    { provider: "Outlook Calendar", connected: false },
  ])
  const [autoSync, setAutoSync] = useState(true)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    // Check URL params for connection status
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.get("google_connected") === "true") {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.provider === "Google Calendar"
            ? { ...conn, connected: true, email: "user@gmail.com", lastSync: new Date().toISOString() }
            : conn,
        ),
      )
      toast({
        title: "Google Calendar connected!",
        description: "Your availability will now sync automatically",
      })
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
    }

    if (urlParams.get("outlook_connected") === "true") {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.provider === "Outlook Calendar"
            ? { ...conn, connected: true, email: "user@outlook.com", lastSync: new Date().toISOString() }
            : conn,
        ),
      )
      toast({
        title: "Outlook Calendar connected!",
        description: "Your availability will now sync automatically",
      })
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
    }

    if (urlParams.get("error")) {
      toast({
        title: "Connection failed",
        description: "There was an error connecting your calendar. Please try again.",
        variant: "destructive",
      })
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [toast])

  const connectCalendar = (provider: string) => {
    const authUrl = provider === "Google Calendar" ? "/api/auth/google" : "/api/auth/outlook"
    window.location.href = authUrl
  }

  const disconnectCalendar = (provider: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.provider === provider ? { ...conn, connected: false, email: undefined, lastSync: undefined } : conn,
      ),
    )
    toast({
      title: "Calendar disconnected",
      description: `${provider} has been disconnected from your account`,
    })
  }

  const checkAvailability = async () => {
    setIsChecking(true)
    try {
      // In a real app, you'd use actual tokens stored securely
      const mockTokens = {
        googleToken: connections.find((c) => c.provider === "Google Calendar")?.connected ? "mock-google-token" : null,
        outlookToken: connections.find((c) => c.provider === "Outlook Calendar")?.connected
          ? "mock-outlook-token"
          : null,
      }

      // For demo purposes, simulate availability check
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock filtering out some slots as busy
      const availableSlots = timeSlots.filter((_, index) => index % 3 !== 0) // Remove every 3rd slot as "busy"

      onAvailabilityChange(availableSlots)

      // Update last sync time
      setConnections((prev) =>
        prev.map((conn) => (conn.connected ? { ...conn, lastSync: new Date().toISOString() } : conn)),
      )

      toast({
        title: "Availability updated",
        description: `Found ${availableSlots.length} available slots after checking your calendars`,
      })
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "There was an error checking your calendar availability",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return "Never"
    const date = new Date(lastSync)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your calendars to automatically sync availability and prevent double bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-sync toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-sync">Auto-sync availability</Label>
            <p className="text-sm text-gray-600">Automatically check calendars when clients book</p>
          </div>
          <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
        </div>

        {/* Calendar connections */}
        <div className="space-y-4">
          <h4 className="font-medium">Connected Calendars</h4>
          {connections.map((connection) => (
            <div key={connection.provider} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{connection.provider === "Google Calendar" ? "🗓️" : "📅"}</div>
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
                  <Button size="sm" onClick={() => connectCalendar(connection.provider)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Manual sync button */}
        {connections.some((c) => c.connected) && (
          <div className="pt-4 border-t">
            <Button onClick={checkAvailability} disabled={isChecking} className="w-full">
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking availability...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check availability now
                </>
              )}
            </Button>
            <p className="text-xs text-gray-600 text-center mt-2">
              This will check your connected calendars for conflicts
            </p>
          </div>
        )}

        {/* Setup instructions */}
        {!connections.some((c) => c.connected) && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Click "Connect" next to your preferred calendar</p>
              <p>2. Sign in and grant calendar read permissions</p>
              <p>3. Your availability will automatically sync</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
