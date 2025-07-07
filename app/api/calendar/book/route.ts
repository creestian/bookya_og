import { type NextRequest, NextResponse } from "next/server"
import { sendBookingConfirmationEmails } from "@/lib/email"
import { UserService } from "@/lib/user-service"
import { BookingService } from "@/lib/booking-service"

export async function POST(request: NextRequest) {
  try {
    const { username, date, time, guestName, guestEmail, message } = await request.json()

    console.log("📝 Booking request received:", {
      username,
      date,
      time,
      guestName,
      guestEmail,
      message: message ? "Yes" : "No",
    })

    // Validate required fields
    if (!username || !date || !time || !guestName || !guestEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          received: { username, date, time, guestName, guestEmail },
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Get host user profile from Supabase
    console.log("👤 Looking up host profile for username:", username)
    let hostProfile = await UserService.getUserByUsername(username)

    if (!hostProfile) {
      // Create a basic profile if user doesn't exist
      console.log("👤 Creating new host profile for username:", username)
      const hostEmail = `${username}@gmail.com` // This would be replaced with actual user lookup
      hostProfile = await UserService.upsertUser({
        email: hostEmail,
        name: username
          .split(".")
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        username: username,
      })

      if (!hostProfile) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create host profile",
          },
          { status: 500 },
        )
      }
    }

    console.log("👤 Host profile found:", {
      name: hostProfile.name,
      email: hostProfile.email,
      username: hostProfile.username,
    })

    // Generate Google Meet link (in a real app, this would use Google Calendar API)
    const meetingId = Math.random().toString(36).substring(2, 15)
    const meetingLink = `https://meet.google.com/${meetingId}`

    console.log("🔗 Meeting link generated:", meetingLink)

    // Create booking in Supabase
    console.log("💾 Creating booking in database...")
    const booking = await BookingService.createBooking({
      host_email: hostProfile.email,
      host_name: hostProfile.name,
      guest_name: guestName,
      guest_email: guestEmail,
      booking_date: date,
      booking_time: time,
      message,
      meeting_link: meetingLink,
    })

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create booking in database",
        },
        { status: 500 },
      )
    }

    console.log("✅ Booking created in database:", booking.id)

    // Send confirmation emails
    console.log("📧 Attempting to send confirmation emails...")

    const emailResult = await sendBookingConfirmationEmails({
      hostName: hostProfile.name,
      hostEmail: hostProfile.email,
      guestName,
      guestEmail,
      date,
      time,
      meetingLink,
      message,
    })

    if (emailResult.success) {
      console.log("✅ Emails sent successfully")
    } else {
      console.error("❌ Email sending failed:", emailResult.error)
    }

    // Create booking response
    const bookingResponse = {
      success: true,
      message: "Booking confirmed successfully",
      booking: {
        id: booking.id,
        hostName: hostProfile.name,
        hostEmail: hostProfile.email,
        guestName,
        guestEmail,
        date,
        time,
        meetingLink,
        message,
        status: booking.status,
        createdAt: booking.created_at,
      },
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
    }

    console.log("🎉 Booking completed successfully:", {
      bookingId: booking.id,
      emailSent: emailResult.success,
    })

    return NextResponse.json(bookingResponse)
  } catch (error) {
    console.error("❌ Booking creation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
