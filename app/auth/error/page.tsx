"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BookYa
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h2>
            <p className="text-muted-foreground">Something went wrong</p>
          </div>

          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">{getErrorMessage(error)}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
