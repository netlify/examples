import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface Submission {
  key: string;
  name: string;
  company: string;
  email: string;
  preferredTime: string;
  notes: string;
  submittedAt: string;
  analysisState?: "pending" | "analyzing" | "completed" | "spam" | "error";
  isSpam?: boolean;
  summary?: string;
  recommendation?: string;
  analysisError?: string;
  spamReasoning?: string;
}

export default function SubmissionDetail() {
  const { key } = useParams<{ key: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/submission/${key}`);
        const data = await response.json();

        if (response.ok) {
          setSubmission(data.submission);
        } else {
          setError(data.message || "Failed to fetch submission");
        }
      } catch (err) {
        setError("Failed to fetch submission");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchSubmission();
    }
  }, [key]);

  const handleRetryAnalysis = async () => {
    if (!key) return;

    setRetrying(true);

    try {
      const response = await fetch("/api/retry-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the submission to see updated state
        const submissionResponse = await fetch(`/api/submission/${key}`);
        const submissionData = await submissionResponse.json();

        if (submissionResponse.ok) {
          setSubmission(submissionData.submission);
        }
      } else {
        alert(data.message || "Failed to retry analysis");
      }
    } catch (err) {
      console.error("Error retrying analysis:", err);
      alert("Failed to retry analysis");
    } finally {
      setRetrying(false);
    }
  };

  const getAnalysisStateBadge = (state?: Submission["analysisState"]) => {
    const badges = {
      pending: { text: "Pending Analysis", bg: "bg-gray-100", text_color: "text-gray-700", icon: Clock },
      analyzing: { text: "Analyzing...", bg: "bg-blue-100", text_color: "text-blue-700", icon: Loader2 },
      completed: { text: "Analyzed", bg: "bg-green-100", text_color: "text-green-700", icon: CheckCircle2 },
      spam: { text: "Spam", bg: "bg-red-100", text_color: "text-red-700", icon: XCircle },
      error: { text: "Analysis Error", bg: "bg-yellow-100", text_color: "text-yellow-700", icon: AlertTriangle },
    };

    const badge = state ? badges[state] : badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium ${badge.bg} ${badge.text_color}`}>
        <Icon className={`w-4 h-4 ${state === 'analyzing' ? 'animate-spin' : ''}`} />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-black z-50" />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-black" />
            <span className="text-sm font-medium">Synergy Supreme</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold">Meeting Request</h1>
            <Link
              to="/submissions"
              className="bg-[#0f172a] text-white px-6 py-3 font-medium hover:bg-[#1e293b] transition-colors"
            >
              Back to List
            </Link>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading submission...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 text-red-800 text-sm mb-8">
            {error}
          </div>
        )}

        {!loading && !error && submission && (
          <div className="space-y-6">
            {/* Analysis Status Card */}
            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Analysis Status</h2>
                {getAnalysisStateBadge(submission.analysisState)}
              </div>

              {submission.analysisState === "spam" && (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
                    This submission has been flagged as spam and may not warrant a meeting.
                  </div>
                  {submission.spamReasoning && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Reasoning
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">{submission.spamReasoning}</p>
                    </div>
                  )}
                </div>
              )}

              {submission.analysisState === "error" && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 text-yellow-800 text-sm">
                    Analysis failed: {submission.analysisError || "Unknown error"}
                  </div>
                  <button
                    onClick={handleRetryAnalysis}
                    disabled={retrying}
                    className="w-full bg-[#0f172a] text-white py-3 px-4 font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {retrying ? "Retrying..." : "Retry Analysis"}
                  </button>
                </div>
              )}

              {submission.analysisState === "completed" && submission.summary && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Summary
                    </label>
                    <p className="text-gray-900">{submission.summary}</p>
                  </div>
                  {submission.recommendation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Recommendation
                      </label>
                      <p className="text-gray-900">{submission.recommendation}</p>
                    </div>
                  )}
                </div>
              )}

              {(!submission.analysisState || submission.analysisState === "pending") && (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    AI analysis has not started yet or may have failed to trigger.
                  </p>
                  <button
                    onClick={handleRetryAnalysis}
                    disabled={retrying}
                    className="w-full bg-[#0f172a] text-white py-3 px-4 font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {retrying ? "Starting Analysis..." : "Start Analysis"}
                  </button>
                </div>
              )}

              {submission.analysisState === "analyzing" && (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    AI analysis is in progress. If this state persists for more than a minute, the analysis may have failed.
                  </p>
                  <button
                    onClick={handleRetryAnalysis}
                    disabled={retrying}
                    className="w-full bg-gray-700 text-white py-3 px-4 font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {retrying ? "Retrying..." : "Retry Analysis (if stuck)"}
                  </button>
                </div>
              )}
            </div>

            {/* Submission Details Card */}
            <div className="bg-white p-8 border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Submission Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p className="text-lg">{submission.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company
                  </label>
                  <p className="text-lg">{submission.company}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-lg">
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-gray-900 underline hover:no-underline"
                    >
                      {submission.email}
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Preferred Time
                  </label>
                  <p className="text-lg">
                    {new Date(submission.preferredTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Notes
                  </label>
                  <p className="text-lg whitespace-pre-wrap">{submission.notes}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Submitted
                  </label>
                  <p className="text-lg">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Submission ID
                  </label>
                  <p className="text-sm font-mono text-gray-600">{submission.key}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
