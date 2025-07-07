import { type NextRequest, NextResponse } from "next/server"
import { getGoogleCalendarEvents, getOutlookCalendarEvents } from "@/lib/calendar-providers"

export async function POST(request: NextRequest) {
  try {
    const { date, timeSlots, googleToken, outlookToken } = await request.json()

    const startOfDay = new Date(date + "T00:00:00.000Z").toISOString()
    const endOfDay = new Date(date + "T23:59:59.999Z").toISOString()

    let allEvents: any[] = []

    // Fetch Google Calendar events
    if (googleToken) {
      try {
        const googleEvents = await getGoogleCalendarEvents(googleToken, startOfDay, endOfDay)
        allEvents = [...allEvents, ...googleEvents]
      } catch (error) {
        console.error("Failed to fetch Google Calendar events:", error)
      }
    }

    // Fetch Outlook Calendar events
    if (outlookToken) {
      try {
        const outlookEvents = await getOutlookCalendarEvents(outlookToken, startOfDay, endOfDay)
        allEvents = [...allEvents, ...outlookEvents]
      } catch (error) {
        console.error("Failed to fetch Outlook Calendar events:", error)
      }
    }

    // Check availability for each time slot
    const availableSlots = timeSlots.filter((slot: any) => {
      const slotStart = new Date(date + "T" + slot.time + ":00.000Z")
      const slotEnd = new Date(slotStart.getTime() + slot.duration * 60000)

      // Check if slot conflicts with any calendar event
      const hasConflict = allEvents.some((event) => {
        if (!event.busy) return false

        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)

        // Check for overlap
        return slotStart < eventEnd && slotEnd > eventStart
      })

      return !hasConflict
    })

    return NextResponse.json({ availableSlots, totalEvents: allEvents.length })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
