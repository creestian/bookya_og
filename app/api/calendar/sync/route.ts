import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      return NextResponse.json({ error: "No access token found", needsReauth: true }, { status: 401 })
    }

    // Fetch calendar events from Google Calendar API
    const calendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
        new URLSearchParams({
          timeMin: new Date().toISOString(),
          timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
          singleEvents: "true",
          orderBy: "startTime",
          maxResults: "50",
        }),
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json()
      console.error("Google Calendar API error:", errorData)

      if (calendarResponse.status === 401) {
        return NextResponse.json({ error: "Access token expired", needsReauth: true }, { status: 401 })
      }

      throw new Error(`Google Calendar API error: ${calendarResponse.status}`)
    }

    const calendarData = await calendarResponse.json()
    const events = calendarData.items || []

    // Process events to determine busy slots
    const busyEvents = events.filter((event: any) => {
      // Consider events as busy if they have a start time and are confirmed
      return event.start?.dateTime && event.status === "confirmed"
    })

    return NextResponse.json({
      success: true,
      events: events.map((event: any) => ({
        id: event.id,
        summary: event.summary || "Untitled Event",
        start: event.start,
        end: event.end,
        status: event.status,
        attendees: event.attendees || [],
        location: event.location,
        description: event.description,
      })),
      eventsCount: events.length,
      busyEventsCount: busyEvents.length,
      busySlots: busyEvents.length,
    })
  } catch (error) {
    console.error("Calendar sync error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to sync calendar",
        success: false,
      },
      { status: 500 },
    )
  }
}
