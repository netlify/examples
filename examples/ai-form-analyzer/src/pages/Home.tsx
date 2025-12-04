import { useState, useMemo, type FormEvent } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    preferredTime: "",
    notes: "",
  });

  // Calculate minimum datetime (24 hours from now)
  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() + 24);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    return now.toISOString().slice(0, 16);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/new-meeting-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormData({
          name: "",
          company: "",
          email: "",
          preferredTime: "",
          notes: "",
        });
      } else {
        setFormStatus("error");
        setErrorMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
      setErrorMessage(
        `Failed to submit form: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Accent bar at top */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-black z-50" />

      {/* Floating feedback at top center */}
      {formStatus === "success" && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 bg-green-50 border border-green-200 p-4 text-green-800 text-sm shadow-lg max-w-md w-full mx-4">
          Thank you! Your meeting request has been submitted successfully.
        </div>
      )}

      {formStatus === "error" && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 bg-red-50 border border-red-200 p-4 text-red-800 text-sm shadow-lg max-w-md w-full mx-4">
          {errorMessage}
        </div>
      )}

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-black" />
              <span className="text-sm font-medium">Synergy Supreme</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
              Let's disrupt some paradigms
            </h1>
            <p className="text-gray-600">
              Schedule a deep-dive to ideate on low-hanging fruit and circle back on your bandwidth concerns.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 text-base placeholder-gray-500 transition-colors"
              />
            </div>

            <div>
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 text-base placeholder-gray-500 transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 text-base placeholder-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Preferred meeting time (must be at least 24 hours in the future)
              </label>
              <input
                type="datetime-local"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                min={minDateTime}
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 text-base placeholder-gray-500 transition-colors"
              />
            </div>

            <div>
              <textarea
                name="notes"
                placeholder="How can we help?"
                value={formData.notes}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 text-base placeholder-gray-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === "loading"}
              className="w-full bg-[#0f172a] text-white py-4 font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {formStatus === "loading" ? "Submitting..." : "Get started"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Prefer email?{" "}
              <a
                href="mailto:hello@synergysupreme.biz"
                className="text-gray-900 underline hover:no-underline"
              >
                hello@synergysupreme.biz
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Testimonial */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-amber-500 via-rose-500 to-purple-700 items-center justify-center p-16 relative overflow-hidden">
        <div className="max-w-xl text-white z-10">
          <blockquote className="text-3xl md:text-4xl font-medium leading-tight mb-12">
            "Synergy Supreme helped us pivot our pivot. We went from disrupting nothing to disrupting everything. Series Z incoming."
          </blockquote>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <div className="text-white/80 mb-1">Partner ↓</div>
                <div className="font-medium">Blockchain Burritos</div>
              </div>
              <div>
                <div className="text-white/80 mb-1">Year ↓</div>
                <div className="font-medium">Q4 2024</div>
              </div>
              <div>
                <div className="text-white/80 mb-1">Website ↓</div>
                <div className="font-medium">blockchainburritos.io</div>
              </div>
              <div>
                <div className="text-white/80 mb-1">Investment ↓</div>
                <div className="font-medium">$420,690,000</div>
              </div>
            </div>

            <div>
              <div className="text-white/80 text-sm mb-2">Services ↓</div>
              <div className="space-y-1 text-sm font-medium">
                <div>Paradigm Shifting</div>
                <div>Synergy Optimization</div>
                <div>Disruptive Innovation</div>
                <div>Agile Buzzword Integration</div>
                <div>Thought Leadership As A Service</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <span className="text-amber-600 font-bold text-xl">BB</span>
            </div>
            <span className="text-2xl font-bold">Blockchain Burritos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
