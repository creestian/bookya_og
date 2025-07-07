import { type NextRequest, NextResponse } from "next/server"
import { GoogleCalendarService } from "@/lib/google-calendar"

export async function POST(request: NextRequest) {
  try {
    const { timeSlots, googleAccessToken, date } = await request.json()

    if (!googleAccessToken) {
      return NextResponse.json({ error: "No Google access token provided" }, { status: 400 })
    }

    if (!timeSlots || !Array.isArray(timeSlots)) {
      return NextResponse.json({ error: "Invalid time slots provided" }, { status: 400 })
    }

    // Set up time range for the day
    const startOfDay = new Date(date + "T00:00:00.000Z")
    const endOfDay = new Date(date + "T23:59:59.999Z")

    const googleCalendar = new GoogleCalendarService(googleAccessToken)

    try {
      // Fetch Google Calendar events for the day
      const events = await googleCalendar.getEvents(startOfDay.toISOString(), endOfDay.toISOString())

      // Filter out available time slots
      const availableSlots = timeSlots.filter((slot: any) => {
        const slotStart = new Date(date + "T" + slot.time + ":00.000Z")
        const slotEnd = new Date(slotStart.getTime() + slot.duration * 60000)

        // Check if slot conflicts with any busy calendar event
        const hasConflict = events.some((event) => {
          if (!GoogleCalendarService.isEventBusy(event)) {
            return false // Skip non-busy events
          }

          try {
            const { start: eventStart, end: eventEnd } = GoogleCalendarService.parseEventTime(event)

            // Check for time overlap
            return slotStart < eventEnd && slotEnd > eventStart
          } catch (error) {
            console.error("Error parsing event time:", error)
            return false
          }
        })

        return !hasConflict
      })

      const conflictCount = timeSlots.length - availableSlots.length

      return NextResponse.json({
        availableSlots,
        conflictCount,
        totalEvents: events.length,
        busyEvents: events.filter((e) => GoogleCalendarService.isEventBusy(e)).length,
      })
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Google Calendar access expired", needsReauth: true }, { status: 401 })
      }
      throw error
    }
  } catch (error) {
    console.error("Calendar availability check error:", error)
    return NextResponse.json({ error: "Failed to check calendar availability" }, { status: 500 })
  }
}
