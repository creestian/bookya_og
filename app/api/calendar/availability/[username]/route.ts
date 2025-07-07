import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Look up the user by username in your database
    // 2. Get their Google Calendar access token
    // 3. Check their calendar for the specified date
    // 4. Return available time slots

    // Mock availability data
    const startOfDay = new Date(`${date}T09:00:00`)
    const endOfDay = new Date(`${date}T17:00:00`)

    const timeSlots = []
    const current = new Date(startOfDay)

    while (current < endOfDay) {
      const timeString = current.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })

      // Mock availability (70% chance of being available)
      const available = Math.random() > 0.3

      timeSlots.push({
        time: timeString,
        available,
        datetime: current.toISOString(),
      })

      current.setMinutes(current.getMinutes() + 30)
    }

    return NextResponse.json({
      date,
      timeSlots,
      timezone: "America/Los_Angeles",
    })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
