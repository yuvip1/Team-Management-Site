import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function MemberDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const memberId = params?.id || null;

  const { data: member, isLoading, error } = trpc.members.getById.useQuery(
    { id: memberId! },
    { enabled: memberId !== null }
  );

  if (!memberId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-4">Invalid member ID</p>
          <Button
            onClick={() => setLocation("/view-members")}
            className="btn-primary px-6 py-3 font-semibold rounded-lg"
          >
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      {/* Decorative shapes */}
      <div className="fixed top-20 right-20 w-32 h-32 rounded-full bg-secondary opacity-10 blur-3xl" />
      <div className="fixed bottom-32 left-20 w-40 h-40 rounded-full bg-accent opacity-10 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/view-members")}
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2"
          >
            ← Back to Team
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-destructive text-center">
            <p className="font-semibold">Member not found</p>
            <p className="text-sm mt-1">{error.message}</p>
            <Button
              onClick={() => setLocation("/view-members")}
              className="btn-primary px-6 py-3 font-semibold rounded-lg mt-4"
            >
              Back to Team
            </Button>
          </div>
        )}

        {/* Member Details */}
        {!isLoading && !error && member && (
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
            {/* Image Section */}
            <div className="w-full h-80 bg-muted overflow-hidden">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-accent">
                  <span className="text-9xl font-black text-foreground/20">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              {/* Name and Basic Info */}
              <div className="mb-8 pb-8 border-b border-border">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{member.name}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Roll Number
                    </p>
                    <p className="text-lg font-semibold">{member.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Year
                    </p>
                    <p className="text-lg font-semibold">{member.year}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Degree
                    </p>
                    <p className="text-lg font-semibold">{member.degree}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-8">
                {member.aboutProject && (
                  <div>
                    <h2 className="text-2xl font-black mb-3">About Project</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {member.aboutProject}
                    </p>
                  </div>
                )}

                {member.hobbies && (
                  <div>
                    <h2 className="text-2xl font-black mb-3">Hobbies</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {member.hobbies}
                    </p>
                  </div>
                )}

                {member.certificate && (
                  <div>
                    <h2 className="text-2xl font-black mb-3">Certifications</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {member.certificate}
                    </p>
                  </div>
                )}

                {member.internship && (
                  <div>
                    <h2 className="text-2xl font-black mb-3">Internship Experience</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {member.internship}
                    </p>
                  </div>
                )}

                {member.aboutYourAim && (
                  <div>
                    <h2 className="text-2xl font-black mb-3">Goals & Aspirations</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {member.aboutYourAim}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-12 pt-8 border-t border-border">
                <Button
                  onClick={() => setLocation("/view-members")}
                  className="flex-1 px-6 py-3 border-2 border-foreground text-foreground bg-transparent font-semibold rounded-lg hover:bg-foreground hover:text-background transition-colors"
                >
                  Back to Team
                </Button>
                <Button
                  onClick={() => setLocation("/add-member")}
                  className="flex-1 btn-primary px-6 py-3 font-semibold rounded-lg"
                >
                  Add Another Member
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
