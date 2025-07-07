export interface GoogleCalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  status: string
  transparency?: string
}

export interface GoogleCalendarResponse {
  items: GoogleCalendarEvent[]
  nextPageToken?: string
}

export class GoogleCalendarService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getEvents(timeMin: string, timeMax: string): Promise<GoogleCalendarEvent[]> {
    try {
      const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events")
      url.searchParams.set("timeMin", timeMin)
      url.searchParams.set("timeMax", timeMax)
      url.searchParams.set("singleEvents", "true")
      url.searchParams.set("orderBy", "startTime")
      url.searchParams.set("maxResults", "250")

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("UNAUTHORIZED")
        }
        const errorText = await response.text()
        console.error("Google Calendar API error:", errorText)
        throw new Error(`Google Calendar API error: ${response.status}`)
      }

      const data: GoogleCalendarResponse = await response.json()
      return data.items || []
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error)
      throw error
    }
  }

  async refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh token")
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error("Error refreshing Google access token:", error)
      throw error
    }
  }

  static isEventBusy(event: GoogleCalendarEvent): boolean {
    // Event is busy if:
    // 1. Status is 'confirmed' (not cancelled)
    // 2. Transparency is not 'transparent' (default is opaque/busy)
    return event.status === "confirmed" && event.transparency !== "transparent"
  }

  static parseEventTime(event: GoogleCalendarEvent): { start: Date; end: Date } {
    const startTime = event.start.dateTime || event.start.date
    const endTime = event.end.dateTime || event.end.date

    if (!startTime || !endTime) {
      throw new Error("Event missing start or end time")
    }

    return {
      start: new Date(startTime),
      end: new Date(endTime),
    }
  }
}
