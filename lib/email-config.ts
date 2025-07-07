export const emailConfig = {
  provider: process.env.EMAIL_PROVIDER || "smtp",
  from: process.env.FROM_EMAIL || "noreply@narodai.com",

  // Resend configuration
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },

  // SMTP configuration for your Ferozo server
  smtp: {
    host: process.env.SMTP_HOST || "c2751521.ferozo.com",
    port: Number.parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "noreply@narodai.com",
      pass: process.env.SMTP_PASS,
    },
  },
}

export const isEmailConfigured = () => {
  if (emailConfig.provider === "resend") {
    return !!emailConfig.resend.apiKey
  }

  if (emailConfig.provider === "smtp") {
    return !!(emailConfig.smtp.host && emailConfig.smtp.auth.user && emailConfig.smtp.auth.pass)
  }

  return false
}
