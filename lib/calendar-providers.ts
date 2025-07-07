export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  busy: boolean
}

export interface CalendarProvider {
  name: string
  icon: string
  authUrl: string
  connected: boolean
}

export const calendarProviders: CalendarProvider[] = [
  {
    name: "Google Calendar",
    icon: "🗓️",
    authUrl: "/api/auth/google",
    connected: false,
  },
  {
    name: "Outlook Calendar",
    icon: "📅",
    authUrl: "/api/auth/outlook",
    connected: false,
  },
]

export async function getGoogleCalendarEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<CalendarEvent[]> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch Google Calendar events")
  }

  const data = await response.json()
  return (
    data.items?.map((event: any) => ({
      id: event.id,
      title: event.summary || "Busy",
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      busy: event.transparency !== "transparent",
    })) || []
  )
}

export async function getOutlookCalendarEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<CalendarEvent[]> {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendar/events?$filter=start/dateTime ge '${timeMin}' and end/dateTime le '${timeMax}'&$orderby=start/dateTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch Outlook Calendar events")
  }

  const data = await response.json()
  return (
    data.value?.map((event: any) => ({
      id: event.id,
      title: event.subject || "Busy",
      start: event.start.dateTime,
      end: event.end.dateTime,
      busy: event.showAs !== "free",
    })) || []
  )
}
