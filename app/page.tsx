"use client"

import Link from "next/link"
import { ArrowRight, Calendar, CheckCircle, Users, Zap, Clock, Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            BookYa
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/demo">Demo</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6">
            Simple Booking for <span className="gradient-text">Busy Professionals</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Stop the back-and-forth emails. Let clients book you directly with smart calendar integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 floating-btn">
              Start Free Today
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-4">
              See Demo
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-70">
            ✨ Free forever plan • 🚀 Setup in 2 minutes • 📅 Google Calendar sync
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Everything you need to get booked</h2>
            <p className="text-xl opacity-70">Professional booking pages that work seamlessly with your calendar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl mb-3">Smart Calendar Sync</h3>
              <p className="opacity-70">
                Automatically prevent double bookings with real-time Google Calendar integration.
              </p>
            </div>

            <div className="card text-center">
              <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl mb-3">Lightning Fast Setup</h3>
              <p className="opacity-70">Get your booking page live in under 2 minutes. No complex setup required.</p>
            </div>

            <div className="card text-center">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl mb-3">Team Scheduling</h3>
              <p className="opacity-70">Round-robin scheduling and team availability for growing businesses.</p>
            </div>

            <div className="card text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl mb-3">Flexible Time Slots</h3>
              <p className="opacity-70">Set custom durations, buffer times, and recurring availability patterns.</p>
            </div>

            <div className="card text-center">
              <Star className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl mb-3">Professional Pages</h3>
              <p className="opacity-70">Beautiful, mobile-responsive booking pages that reflect your brand.</p>
            </div>

            <div className="card text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl mb-3">Instant Confirmations</h3>
              <p className="opacity-70">Automatic email confirmations with calendar invites for both parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-16">How BookYa Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl mb-3">Connect Your Calendar</h3>
              <p className="opacity-70">
                Link your Google Calendar with one click. We'll sync your availability automatically.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl mb-3">Set Your Availability</h3>
              <p className="opacity-70">
                Choose when you're available for bookings. Set duration, buffer times, and recurring slots.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl mb-3">Share Your Link</h3>
              <p className="opacity-70">
                Get your personal booking link and share it anywhere - email, website, social media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-8">Trusted by professionals worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--accent)" }} />
                ))}
              </div>
              <p className="mb-4">
                "BookYa saved me hours every week. My clients love how easy it is to book time with me."
              </p>
              <p className="text-sm opacity-70">— Sarah Chen, Design Consultant</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--accent)" }} />
                ))}
              </div>
              <p className="mb-4">
                "The Google Calendar sync is flawless. No more double bookings or scheduling conflicts."
              </p>
              <p className="text-sm opacity-70">— Marcus Rodriguez, Business Coach</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--accent)" }} />
                ))}
              </div>
              <p className="mb-4">"Setup was incredibly fast. I was taking bookings within minutes of signing up."</p>
              <p className="text-sm opacity-70">— Jennifer Park, Freelance Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-8">Simple Pricing</h2>
          <p className="text-xl opacity-70 mb-12">Start free, upgrade when you need more features</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <h3 className="text-xl mb-2">Free</h3>
              <div className="price mb-4">$0</div>
              <p className="text-sm opacity-70 mb-4">Perfect for individuals</p>
              <ul className="text-sm space-y-2 mb-6">
                <li>✓ Unlimited bookings</li>
                <li>✓ Google Calendar sync</li>
                <li>✓ Basic customization</li>
              </ul>
            </div>

            <div className="card text-center border-2" style={{ borderColor: "var(--accent)" }}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  Popular
                </span>
              </div>
              <h3 className="text-xl mb-2 mt-2">Teams</h3>
              <div className="price mb-4">$15</div>
              <p className="text-sm opacity-70 mb-4">For small teams</p>
              <ul className="text-sm space-y-2 mb-6">
                <li>✓ Everything in Free</li>
                <li>✓ Team scheduling</li>
                <li>✓ Remove branding</li>
                <li>✓ Priority support</li>
              </ul>
            </div>

            <div className="card text-center">
              <h3 className="text-xl mb-2">Organizations</h3>
              <div className="price mb-4">$37</div>
              <p className="text-sm opacity-70 mb-4">For larger teams</p>
              <ul className="text-sm space-y-2 mb-6">
                <li>✓ Everything in Teams</li>
                <li>✓ Custom subdomain</li>
                <li>✓ SAML SSO</li>
                <li>✓ Advanced analytics</li>
              </ul>
            </div>
          </div>

          <Link href="/pricing" className="btn-primary text-lg px-8 py-4">
            View Full Pricing
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl mb-6">Ready to simplify your booking process?</h2>
          <p className="text-xl mb-8">
            Join thousands of professionals who've streamlined their scheduling with BookYa.
          </p>
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 floating-btn">
            Get Started Free
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Link href="/" className="logo text-2xl mb-4 md:mb-0">
              BookYa
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Home
              </Link>
              <Link href="/pricing" className="hover:opacity-70 transition-opacity">
                Pricing
              </Link>
              <Link href="/demo" className="hover:opacity-70 transition-opacity">
                Demo
              </Link>
              <Link href="/auth/login" className="hover:opacity-70 transition-opacity">
                Login
              </Link>
              <Link href="/auth/signup" className="hover:opacity-70 transition-opacity">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="text-center text-sm opacity-70">
            <p>© 2024 BookYa. Simple booking for busy professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
