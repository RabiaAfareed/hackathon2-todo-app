import Link from "next/link"
import { CheckCircle, Zap, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Phase 2: Full-Stack Implementation</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Task Management
            <span className="block text-accent mt-2">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Organize your work, track your progress, and achieve more with our intuitive task management platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/25"
            >
              Get Started
            </Link>
            <button className="w-full sm:w-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all">
              Learn More
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border">
              <CheckCircle className="w-8 h-8 text-success" />
              <h3 className="font-semibold text-card-foreground">Simple & Fast</h3>
              <p className="text-sm text-muted-foreground text-center">Quick task creation and management</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border">
              <Zap className="w-8 h-8 text-accent" />
              <h3 className="font-semibold text-card-foreground">Real-time Sync</h3>
              <p className="text-sm text-muted-foreground text-center">Stay updated across all devices</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-card-foreground">Secure</h3>
              <p className="text-sm text-muted-foreground text-center">Your data is safe and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
