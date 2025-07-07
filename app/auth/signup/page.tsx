"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { Icons } from "@/components/icons"
import { ArrowRight, Mail } from "lucide-react"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    try {
      await signIn("google", {
        callbackUrl: "/onboarding",
        redirect: true,
      })
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, you'd handle the form submission here
      console.log("Form submitted:", formData)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BookYa
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h2>
            <p className="text-muted-foreground">Start booking clients in under 2 minutes</p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-11 bg-background/50 border-border/50 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3">
                <Icons.google className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
              </div>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-11 bg-background/50 border-border/50 focus:border-accent focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11 bg-background/50 border-border/50 focus:border-accent focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-11 bg-background/50 border-border/50 focus:border-accent focus:ring-accent/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-medium shadow-lg hover:shadow-accent/25 transition-all duration-200"
              >
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-accent hover:text-accent/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
