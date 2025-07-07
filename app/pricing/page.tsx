"use client"

import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PricingPage() {
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
          <h1 className="text-4xl md:text-6xl font-light mb-6">Simple Pricing for Everyone</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="card text-center relative">
              <div className="mb-6">
                <h3 className="text-2xl mb-2">Free</h3>
                <div className="price">$0</div>
                <p className="text-sm opacity-70">Forever free</p>
              </div>

              <div className="mb-8">
                <p className="mb-4 font-semibold">Perfect for individual freelancers</p>
                <ul className="text-left space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>1 user</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Unlimited calendars</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Unlimited event types</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Basic workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Google Calendar integration</span>
                  </li>
                </ul>
              </div>

              <Link href="/auth/signup" className="btn-primary w-full">
                Get Started Free
              </Link>
            </div>

            {/* Teams Tier */}
            <div className="card text-center relative border-2" style={{ borderColor: "var(--accent-glow)" }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>

              <div className="mb-6 mt-4">
                <h3 className="text-2xl mb-2">Teams</h3>
                <div className="price">$15</div>
                <p className="text-sm opacity-70">per month/user</p>
                <p className="text-xs mt-2 text-green-400">✨ 14-day free trial</p>
              </div>

              <div className="mb-8">
                <p className="mb-4 font-semibold">Highly recommended for small teams</p>
                <ul className="text-left space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Everything in Free, plus:</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>1 team</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Schedule meetings as a team</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Round-robin scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Collective events</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Routing forms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Remove branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Priority email & chat support</span>
                  </li>
                </ul>
              </div>

              <Link href="/auth/signup?plan=teams" className="btn-primary w-full">
                Start 14-Day Trial
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Organizations Tier */}
            <div className="card text-center relative">
              <div className="mb-6">
                <h3 className="text-2xl mb-2">Organizations</h3>
                <div className="price">$37</div>
                <p className="text-sm opacity-70">per month/user</p>
              </div>

              <div className="mb-8">
                <p className="mb-4 font-semibold">For larger teams with advanced needs</p>
                <ul className="text-left space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Everything in Teams, plus:</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>1 parent team + unlimited sub-teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>yourcompany.bookya.com subdomain</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>SOC2, HIPAA, ISO 27001 compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>SAML SSO and SCIM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Domain-wide delegation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Extensive whitelabeling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>

              <Link href="/auth/signup?plan=organizations" className="btn-primary w-full">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl mb-3">Can I change plans anytime?</h3>
              <p>
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate any billing differences.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl mb-3">What happens after my free trial ends?</h3>
              <p>
                After your 14-day trial, you'll be automatically moved to the paid plan you selected. You can cancel
                anytime before the trial ends with no charges.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl mb-3">Do you offer refunds?</h3>
              <p>
                Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund
                your payment in full.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl mb-3">Is my data secure?</h3>
              <p>
                Absolutely. We use enterprise-grade security, encrypt all data in transit and at rest, and are SOC2
                compliant for our Organization tier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl mb-6">Ready to simplify your booking process?</h2>
          <p className="text-xl mb-8">Start with our free plan and upgrade when you're ready for more features.</p>
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 floating-btn">
            Get Started Free
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Link href="/" className="logo text-2xl">
              BookYa
            </Link>
          </div>
          <p className="text-sm opacity-70">© 2024 BookYa. Simple booking for busy professionals.</p>
        </div>
      </footer>
    </div>
  )
}
