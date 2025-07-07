import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { GoogleCalendarService } from "@/lib/google-calendar"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 })
    }

    const accessToken = (session as any).accessToken

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 400 })
    }

    const calendarService = new GoogleCalendarService(accessToken)
    const events = await calendarService.getEvents(startDate, endDate)

    // Return formatted events
    const formattedEvents = events.map((event) => {
      const { start, end } = GoogleCalendarService.parseEventTime(event)
      return {
        id: event.id,
        title: event.summary || "Busy",
        start: start.toISOString(),
        end: end.toISOString(),
        busy: GoogleCalendarService.isEventBusy(event),
        status: event.status,
      }
    })

    return NextResponse.json({
      events: formattedEvents,
      total: formattedEvents.length,
    })
  } catch (error) {
    console.error("Get events error:", error)

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Calendar access expired. Please reconnect." }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
  }
}
