import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Decorative geometric shapes */}
      <div className="fixed top-10 right-10 w-32 h-32 rounded-full bg-secondary opacity-10 blur-3xl" />
      <div className="fixed bottom-20 left-10 w-40 h-40 rounded-full bg-accent opacity-10 blur-3xl" />
      <div className="fixed top-1/2 right-1/4 w-24 h-24 bg-secondary opacity-5 blur-2xl transform -rotate-45" />

      <main className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-4 tracking-tight">
            TEAM BLUE
          </h1>
          <p className="subtitle text-lg md:text-xl mb-8">
            Welcome to the BLUE Team Management System
          </p>
          <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
            Manage and organize your team members efficiently. Add new members, view team details, and keep everything organized in one place.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link href="/add-member">
            <Button className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Add Member
            </Button>
          </Link>
          <Link href="/view-members">
            <Button className="btn-secondary px-8 py-4 text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity">
              View Members
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl w-full">
          <div className="bg-card rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-black">+</span>
            </div>
            <h3 className="text-xl font-black mb-2">Add Members</h3>
            <p className="text-muted-foreground text-sm">
              Quickly add new team members with their details and profile photos.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-black">👥</span>
            </div>
            <h3 className="text-xl font-black mb-2">View Team</h3>
            <p className="text-muted-foreground text-sm">
              Browse all team members and view their profiles at a glance.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-black">📋</span>
            </div>
            <h3 className="text-xl font-black mb-2">Full Details</h3>
            <p className="text-muted-foreground text-sm">
              Access complete information about each team member.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
