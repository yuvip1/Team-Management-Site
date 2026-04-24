import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function ViewMembers() {
  const [, setLocation] = useLocation();
  const { data: members, isLoading, error } = trpc.members.list.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      {/* Decorative shapes */}
      <div className="fixed top-20 right-20 w-32 h-32 rounded-full bg-secondary opacity-10 blur-3xl" />
      <div className="fixed bottom-32 left-20 w-40 h-40 rounded-full bg-accent opacity-10 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => setLocation("/")}
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">Our Team</h1>
              <p className="subtitle">Meet the amazing members of TEAM BLUE</p>
            </div>
            <Button
              onClick={() => setLocation("/add-member")}
              className="btn-primary px-6 py-3 font-semibold rounded-lg w-fit"
            >
              + Add Member
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-destructive">
            <p className="font-semibold">Error loading members</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!members || members.length === 0) && (
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <p className="text-muted-foreground text-lg mb-6">No team members yet</p>
            <Button
              onClick={() => setLocation("/add-member")}
              className="btn-primary px-6 py-3 font-semibold rounded-lg"
            >
              Add the First Member
            </Button>
          </div>
        )}

        {/* Members Grid */}
        {!isLoading && !error && members && members.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Image Container */}
                <div className="relative w-full h-48 bg-muted overflow-hidden">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-accent">
                      <span className="text-4xl font-black text-foreground/30">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black mb-1 line-clamp-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Roll: {member.rollNumber}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-muted-foreground min-w-fit">
                        Year:
                      </span>
                      <span className="text-sm">{member.year}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-muted-foreground min-w-fit">
                        Degree:
                      </span>
                      <span className="text-sm line-clamp-2">{member.degree}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button
                    onClick={() => setLocation(`/member/${member.id}`)}
                    className="w-full btn-secondary px-4 py-2 font-semibold rounded-lg text-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
