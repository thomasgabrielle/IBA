import Navbar from "@/components/Navbar";
import AWLAMatrix from "@/components/AWLAMatrix";

export default function AWLAPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Admin sub-nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="text-blue-600 text-sm font-medium border border-blue-200 rounded px-3 py-1">
            Acute Food Insecurity Analysis – MM May 2025
          </div>
          <nav className="flex gap-6 text-sm text-gray-600">
            {["Units", "Parameters", "Status & Plausibility", "Evidence Review", "SAT Form", "AT Matrix", "Report"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`hover:text-gray-900 ${tab === "AT Matrix" ? "text-gray-900 font-medium" : ""}`}
                >
                  {tab}
                </button>
              )
            )}
          </nav>
        </div>
      </div>

      <main className="flex-1 p-6">
        <div className="max-w-[1200px] mx-auto">
          <a href="/" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to analyst interface
          </a>
          <AWLAMatrix />
        </div>
      </main>
    </div>
  );
}
