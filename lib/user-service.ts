import { supabaseAdmin } from "./supabase"

export interface UserProfile {
  id: string
  email: string
  name: string
  username?: string
  title?: string
  bio?: string
  avatar_url?: string
  timezone?: string
  meeting_duration?: number
  tier?: string
  trial_ends_at?: string
  created_at: string
  updated_at?: string
}

export interface CreateUserData {
  email: string
  name: string
  username?: string
  title?: string
  bio?: string
  avatar_url?: string
  timezone?: string
  meeting_duration?: number
  tier?: string
}

export class UserService {
  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error("Error fetching user by email:", error)
      return null
    }
  }

  static async getUserByUsername(username: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabaseAdmin.from("users").select("*").eq("username", username).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error("Error fetching user by username:", error)
      return null
    }
  }

  static async upsertUser(userData: CreateUserData): Promise<UserProfile | null> {
    try {
      // Generate username from email if not provided
      if (!userData.username && userData.email) {
        userData.username = userData.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ".")
      }

      // Set default values
      const userDataWithDefaults = {
        ...userData,
        title: userData.title || "Professional",
        bio:
          userData.bio ||
          "I help businesses and individuals achieve their goals through professional consultation and expertise.",
        timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        meeting_duration: userData.meeting_duration || 30,
        tier: userData.tier || "free",
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabaseAdmin
        .from("users")
        .upsert(userDataWithDefaults, {
          onConflict: "email",
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error upserting user:", error)
      return null
    }
  }

  static async updateUser(email: string, updates: Partial<CreateUserData>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error updating user:", error)
      return null
    }
  }
}
