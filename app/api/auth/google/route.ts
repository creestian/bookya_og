import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Handle OAuth errors
  if (error) {
    console.error("Google OAuth error:", error)
    const redirectUrl = new URL("/auth/signup", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    redirectUrl.searchParams.set("error", "google_auth_failed")
    redirectUrl.searchParams.set("error_description", "Google authentication was cancelled or failed")
    return NextResponse.redirect(redirectUrl.toString())
  }

  if (!code) {
    // Step 1: Redirect to Google OAuth
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")

    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15)

    // Check if we have real credentials or should use demo mode
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      // Demo mode - simulate successful OAuth
      const demoRedirectUrl = new URL("/auth/signup", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
      demoRedirectUrl.searchParams.set("google_demo", "true")
      demoRedirectUrl.searchParams.set("demo_email", "demo@gmail.com")
      demoRedirectUrl.searchParams.set("demo_name", "Demo User")
      return NextResponse.redirect(demoRedirectUrl.toString())
    }

    // Real OAuth flow
    googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID)
    googleAuthUrl.searchParams.set("redirect_uri", REDIRECT_URI)
    googleAuthUrl.searchParams.set("response_type", "code")
    googleAuthUrl.searchParams.set("scope", "openid email profile https://www.googleapis.com/auth/calendar.readonly")
    googleAuthUrl.searchParams.set("access_type", "offline")
    googleAuthUrl.searchParams.set("prompt", "consent")
    googleAuthUrl.searchParams.set("state", state)

    return NextResponse.redirect(googleAuthUrl.toString())
  }

  try {
    // Step 2: Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID || "",
        client_secret: GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("Token exchange failed:", errorData)
      throw new Error("Failed to exchange code for tokens")
    }

    const tokens = await tokenResponse.json()

    // Step 3: Get user info
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const userInfo = await userInfoResponse.json()

    // Step 4: Redirect back to signup with user info
    const redirectUrl = new URL("/auth/signup", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    redirectUrl.searchParams.set("google_success", "true")
    redirectUrl.searchParams.set("google_email", userInfo.email)
    redirectUrl.searchParams.set("google_name", userInfo.name)
    redirectUrl.searchParams.set("google_picture", userInfo.picture || "")

    // In production, you would store these tokens in your database
    // For now, we'll pass them as URL params (not recommended for production)
    redirectUrl.searchParams.set("access_token", tokens.access_token)
    if (tokens.refresh_token) {
      redirectUrl.searchParams.set("refresh_token", tokens.refresh_token)
    }

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error("Google OAuth error:", error)
    const redirectUrl = new URL("/auth/signup", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    redirectUrl.searchParams.set("error", "google_auth_failed")
    redirectUrl.searchParams.set("error_description", "Failed to authenticate with Google")
    return NextResponse.redirect(redirectUrl.toString())
  }
}
