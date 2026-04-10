import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | ContentPilot",
  description: "Create and manage your AI-generated social media content",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
