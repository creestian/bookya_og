import nodemailer from "nodemailer"
import { emailConfig, isEmailConfigured } from "./email-config"

interface EmailData {
  hostName: string
  hostEmail: string
  guestName: string
  guestEmail: string
  date: string
  time: string
  meetingLink: string
  message?: string
}

export async function sendBookingConfirmationEmails(data: EmailData) {
  if (!isEmailConfigured()) {
    console.log("📧 Email not configured, skipping email sending")
    return { success: false, error: "Email not configured" }
  }

  try {
    // Create transporter for SMTP
    const transporter = nodemailer.createTransporter({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: emailConfig.smtp.auth,
    })

    // Format date and time
    const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Email to host
    const hostEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Meeting Booked</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .meeting-details { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎉 New Meeting Booked!</h2>
              <p>You have a new meeting request from <strong>${data.guestName}</strong></p>
            </div>
            
            <div class="meeting-details">
              <h3>📅 Meeting Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Guest:</strong> ${data.guestName}</p>
              <p><strong>Email:</strong> ${data.guestEmail}</p>
              ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
              <p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>
            </div>
            
            <p>You can reply directly to this email to contact ${data.guestName}.</p>
            
            <div class="footer">
              <p>This email was sent from BookYa on behalf of your booking system.</p>
              <p>Powered by <strong>BookYa</strong> - Simple booking for busy professionals</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Email to guest
    const guestEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Meeting Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .meeting-details { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Meeting Confirmed!</h2>
              <p>Your meeting with <strong>${data.hostName}</strong> has been confirmed</p>
            </div>
            
            <div class="meeting-details">
              <h3>📅 Meeting Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Host:</strong> ${data.hostName}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              ${data.message ? `<p><strong>Your message:</strong> ${data.message}</p>` : ""}
            </div>
            
            <p><strong>🔗 Join the meeting:</strong></p>
            <a href="${data.meetingLink}" class="button">Join Google Meet</a>
            
            <p>If you need to reschedule or have any questions, you can reply directly to this email to contact ${data.hostName}.</p>
            
            <div class="footer">
              <p>This meeting was scheduled through BookYa.</p>
              <p>Powered by <strong>BookYa</strong> - Simple booking for busy professionals</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email to host
    await transporter.sendMail({
      from: `"BookYa" <${emailConfig.from}>`,
      to: data.hostEmail,
      replyTo: data.guestEmail,
      subject: `New Meeting Booked - ${data.guestName}`,
      html: hostEmailHtml,
    })

    // Send email to guest
    await transporter.sendMail({
      from: `"BookYa" <${emailConfig.from}>`,
      to: data.guestEmail,
      replyTo: data.hostEmail,
      subject: `Meeting Confirmed with ${data.hostName}`,
      html: guestEmailHtml,
    })

    console.log("✅ Booking confirmation emails sent successfully")
    return { success: true }
  } catch (error) {
    console.error("❌ Error sending emails:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
