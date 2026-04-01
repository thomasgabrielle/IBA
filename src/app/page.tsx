import Navbar from "@/components/Navbar";
import ContributingFactorsPanel from "@/components/ContributingFactorsPanel";
import RightPanel from "@/components/RightPanel";

export default function AnalystPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Yellow banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-yellow-800">
          <span className="text-yellow-600 font-bold">!</span>
          Inference-based analysis.
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Two-panel layout */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex gap-4 max-w-[1600px] mx-auto">
          <div className="w-1/2 min-w-0">
            <ContributingFactorsPanel />
          </div>
          <div className="w-1/2 min-w-0">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
