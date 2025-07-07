import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    // Redirect to Microsoft OAuth
    const microsoftAuthUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")
    microsoftAuthUrl.searchParams.set("client_id", process.env.MICROSOFT_CLIENT_ID || "")
    microsoftAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/outlook`)
    microsoftAuthUrl.searchParams.set("response_type", "code")
    microsoftAuthUrl.searchParams.set("scope", "https://graph.microsoft.com/calendars.read")
    microsoftAuthUrl.searchParams.set("response_mode", "query")

    return NextResponse.redirect(microsoftAuthUrl.toString())
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || "",
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/outlook`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Failed to get tokens")
    }

    // In a real app, store these tokens securely in your database
    // For demo purposes, we'll redirect with success
    const redirectUrl = new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    redirectUrl.searchParams.set("outlook_connected", "true")

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error("Outlook OAuth error:", error)
    const redirectUrl = new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    redirectUrl.searchParams.set("error", "outlook_auth_failed")

    return NextResponse.redirect(redirectUrl.toString())
  }
}
