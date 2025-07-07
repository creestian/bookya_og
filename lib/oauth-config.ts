// This is YOUR centralized OAuth configuration
// You set this up once in YOUR Google Cloud Console
export const OAUTH_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!, // Your app's Google Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Your app's Google Client Secret
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
  },
}

// Database schema for storing user tokens (you would implement this)
export interface UserCalendarConnection {
  userId: string
  provider: "google"
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  email: string
  connected: boolean
  createdAt: Date
  updatedAt: Date
}
