import type React from "react"
import {
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  Link,
  Mail,
  Play,
  LoaderPinwheelIcon as Spinner,
  User,
  Settings,
  LogOut,
  Home,
  CreditCard,
  Shield,
  Globe,
  Check,
  X,
  ChevronDown,
  Menu,
  Moon,
  Sun,
  Star,
  ArrowRight,
  Users,
  Zap,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  logo: Calendar,
  spinner: Spinner,
  calendar: Calendar,
  clock: Clock,
  copy: Copy,
  externalLink: ExternalLink,
  link: Link,
  mail: Mail,
  play: Play,
  user: User,
  settings: Settings,
  logout: LogOut,
  home: Home,
  creditCard: CreditCard,
  shield: Shield,
  globe: Globe,
  check: Check,
  close: X,
  chevronDown: ChevronDown,
  menu: Menu,
  moon: Moon,
  sun: Sun,
  star: Star,
  arrowRight: ArrowRight,
  users: Users,
  zap: Zap,
  barChart: BarChart3,
  google: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
      />
    </svg>
  ),
}

export default Icons
