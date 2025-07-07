import { supabaseAdmin } from "./supabase"

export interface Booking {
  id: string
  time_slot_id?: string
  host_id?: string
  host_email?: string
  host_name?: string
  client_name: string
  client_email: string
  booking_date?: string
  booking_time?: string
  message?: string
  meeting_link?: string
  status: string
  created_at: string
  updated_at?: string
}

export interface CreateBookingData {
  host_email: string
  host_name: string
  guest_name: string
  guest_email: string
  booking_date: string
  booking_time: string
  message?: string
  meeting_link?: string
}

export interface BookingStats {
  total: number
  confirmed: number
  completed: number
  cancelled: number
  thisMonth: number
  upcoming: number
}

export class BookingService {
  static async createBooking(bookingData: CreateBookingData): Promise<Booking | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .insert({
          host_email: bookingData.host_email,
          host_name: bookingData.host_name,
          client_name: bookingData.guest_name,
          client_email: bookingData.guest_email,
          booking_date: bookingData.booking_date,
          booking_time: bookingData.booking_time,
          message: bookingData.message,
          meeting_link: bookingData.meeting_link,
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error creating booking:", error)
      return null
    }
  }

  static async getBookingsByHostEmail(hostEmail: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("host_email", hostEmail)
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error fetching bookings:", error)
      return []
    }
  }

  static async getBookingsByGuestEmail(guestEmail: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("client_email", guestEmail)
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error fetching guest bookings:", error)
      return []
    }
  }

  static async getBookingStats(hostEmail: string): Promise<BookingStats> {
    try {
      // Get all bookings for the host
      const { data: allBookings, error } = await supabaseAdmin.from("bookings").select("*").eq("host_email", hostEmail)

      if (error) {
        throw error
      }

      const bookings = allBookings || []
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const stats: BookingStats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
        thisMonth: bookings.filter((b) => {
          if (!b.booking_date) return false
          const bookingDate = new Date(b.booking_date)
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
        }).length,
        upcoming: bookings.filter((b) => {
          if (!b.booking_date) return false
          const bookingDate = new Date(b.booking_date)
          return bookingDate >= now && b.status === "confirmed"
        }).length,
      }

      return stats
    } catch (error) {
      console.error("Error fetching booking stats:", error)
      return {
        total: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        thisMonth: 0,
        upcoming: 0,
      }
    }
  }

  static async updateBookingStatus(bookingId: string, status: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error updating booking status:", error)
      return null
    }
  }
}
