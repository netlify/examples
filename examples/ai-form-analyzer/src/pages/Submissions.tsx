import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, Loader2, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from "lucide-react";

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

interface PaginationInfo {
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Submissions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingKey, setRetryingKey] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError("");

      try {
        const endpoint = currentPage === 1
          ? "/api/submissions"
          : `/api/submissions/page/${currentPage}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (response.ok) {
          setSubmissions(data.submissions);
          setPagination(data.pagination);
        } else {
          setError(data.message || "Failed to fetch submissions");
        }
      } catch (err) {
        setError("Failed to fetch submissions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentPage]);

  const goToPage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const handleRetryAnalysis = async (key: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();

    setRetryingKey(key);

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
        // Refresh the submissions list
        const endpoint = currentPage === 1
          ? "/api/submissions"
          : `/api/submissions/page/${currentPage}`;
        const submissionsResponse = await fetch(endpoint);
        const submissionsData = await submissionsResponse.json();

        if (submissionsResponse.ok) {
          setSubmissions(submissionsData.submissions);
          setPagination(submissionsData.pagination);
        }
      } else {
        alert(data.message || "Failed to retry analysis");
      }
    } catch (err) {
      console.error("Error retrying analysis:", err);
      alert("Failed to retry analysis");
    } finally {
      setRetryingKey(null);
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
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${badge.bg} ${badge.text_color}`}>
        <Icon className={`w-3.5 h-3.5 ${state === 'analyzing' ? 'animate-spin' : ''}`} />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-black z-50" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-black" />
              <span className="text-sm font-medium">Synergy Supreme</span>
            </div>
            <h1 className="text-4xl font-semibold mb-2">Meeting Requests</h1>
            <p className="text-gray-600">
              {pagination && `${pagination.totalCount} total submissions`}
            </p>
          </div>
          <Link
            to="/"
            className="bg-[#0f172a] text-white px-6 py-3 font-medium hover:bg-[#1e293b] transition-colors"
          >
            Back to Form
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 text-red-800 text-sm mb-8">
            {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No submissions yet.</p>
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {submissions.map((submission) => (
                <Link
                  key={submission.key}
                  to={`/submissions/${submission.key}`}
                  className="bg-white p-6 border border-gray-200 hover:border-gray-900 transition-colors"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-semibold">
                        {submission.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getAnalysisStateBadge(submission.analysisState)}
                        {(submission.analysisState === "error" ||
                          submission.analysisState === "pending" ||
                          !submission.analysisState ||
                          submission.analysisState === "analyzing") && (
                          <button
                            onClick={(e) => handleRetryAnalysis(submission.key, e)}
                            disabled={retryingKey === submission.key}
                            className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2 py-1 hover:bg-gray-700 transition-colors disabled:opacity-50"
                            title={
                              submission.analysisState === "error"
                                ? "Retry analysis"
                                : submission.analysisState === "analyzing"
                                ? "Retry if stuck"
                                : "Start analysis"
                            }
                          >
                            <RotateCcw className="w-3 h-3" />
                            {retryingKey === submission.key ? "..." : "Retry"}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{submission.company}</p>
                  </div>
                  {submission.summary && submission.analysisState === "completed" && (
                    <div className="text-sm text-gray-600 line-clamp-3 italic">
                      {submission.summary}
                    </div>
                  )}
                  {submission.summary && submission.analysisState === "spam" && submission.spamReasoning && (
                    <div className="text-sm text-gray-600 line-clamp-3 italic">
                      {submission.spamReasoning}
                    </div>
                  )}
                  {!submission.summary && (
                    <div className="text-sm text-gray-600 line-clamp-3">
                      {submission.notes}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 border transition-colors ${
                        page === currentPage
                          ? "bg-[#0f172a] text-white border-[#0f172a]"
                          : "border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
