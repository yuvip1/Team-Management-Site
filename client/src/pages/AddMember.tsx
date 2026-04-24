import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AddMember() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    year: "",
    degree: "",
    aboutProject: "",
    hobbies: "",
    certificate: "",
    internship: "",
    aboutYourAim: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const createMember = trpc.members.create.useMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      if (imageFile) {
        imageBase64 = imagePreview.split(",")[1];
        imageMimeType = imageFile.type;
      }

      await createMember.mutateAsync({
        name: formData.name,
        rollNumber: formData.rollNumber,
        year: formData.year,
        degree: formData.degree,
        aboutProject: formData.aboutProject || undefined,
        hobbies: formData.hobbies || undefined,
        certificate: formData.certificate || undefined,
        internship: formData.internship || undefined,
        aboutYourAim: formData.aboutYourAim || undefined,
        imageBase64,
        imageName: imageFile?.name,
        imageMimeType,
      });

      toast.success("Team member added successfully!");
      setLocation("/view-members");
    } catch (error: any) {
      toast.error(error.message || "Failed to add team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      {/* Decorative shapes */}
      <div className="fixed top-20 right-20 w-32 h-32 rounded-full bg-secondary opacity-10 blur-3xl" />
      <div className="fixed bottom-32 left-20 w-40 h-40 rounded-full bg-accent opacity-10 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Add Team Member</h1>
          <p className="subtitle">Fill in the details to add a new team member</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 border border-border shadow-sm">
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="mb-8 pb-8 border-b border-border">
              <label className="block text-sm font-semibold mb-4">Profile Image</label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                      <span className="text-muted-foreground text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-secondary file:text-secondary-foreground
                      hover:file:opacity-90"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG, or WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Roll Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 001"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Year <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Degree <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
                placeholder="e.g., B.Tech Computer Science"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-semibold mb-2">About Project</label>
              <textarea
                name="aboutProject"
                value={formData.aboutProject}
                onChange={handleInputChange}
                placeholder="Describe your involvement in the project"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Hobbies</label>
              <textarea
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                placeholder="List your hobbies and interests"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Certificate</label>
              <textarea
                name="certificate"
                value={formData.certificate}
                onChange={handleInputChange}
                placeholder="Mention relevant certifications"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Internship</label>
              <textarea
                name="internship"
                value={formData.internship}
                onChange={handleInputChange}
                placeholder="Describe your internship experience"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">About Your Aim</label>
              <textarea
                name="aboutYourAim"
                value={formData.aboutYourAim}
                onChange={handleInputChange}
                placeholder="Share your goals and aspirations"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                type="button"
                onClick={() => setLocation("/")}
                className="flex-1 px-6 py-3 border-2 border-foreground text-foreground bg-transparent font-semibold rounded-lg hover:bg-foreground hover:text-background transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary px-6 py-3 font-semibold rounded-lg disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
