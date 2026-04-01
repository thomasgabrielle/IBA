"use client";

import { useEffect, useRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { DataSource } from "@/lib/data";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DataSourceModalProps {
  sources: DataSource[];
  currentIndex: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

export default function DataSourceModal({
  sources,
  currentIndex,
  onChangeIndex,
  onClose,
}: DataSourceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const source = sources[currentIndex];

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const chartData = {
    labels: source.chartData.map((d) => d.label),
    datasets: [
      {
        data: source.chartData.map((d) => d.value),
        backgroundColor: source.chartData.map((d) => d.color),
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-gray-100 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-end gap-2 px-6 pt-4">
          <button
            onClick={() => onChangeIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button
            onClick={() => onChangeIndex(currentIndex + 1)}
            disabled={currentIndex === sources.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="ml-2 text-gray-500 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 p-6 pt-3">
          {/* Main content */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">
              {source.name} - {source.unit}
            </h2>

            {/* Chart */}
            <div className="flex justify-center mb-8">
              <div className={source.chartType === "pie" ? "w-72 h-72" : "w-full max-w-lg h-64"}>
                {source.chartType === "pie" ? (
                  <Pie data={chartData} options={pieOptions} />
                ) : (
                  <Bar data={chartData} options={barOptions} />
                )}
              </div>
            </div>

            {/* Legend for pie */}
            {source.chartType === "pie" && (
              <div className="flex flex-wrap gap-4 justify-center mb-6 text-sm text-gray-600">
                {source.chartData.map((d) => (
                  <div key={d.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Data Table */}
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Table</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-12"></th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Category</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Value</th>
                </tr>
              </thead>
              <tbody>
                {source.tableData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 text-gray-700">{row.category}</td>
                    <td className="px-4 py-2 text-gray-700">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Metadata sidebar */}
          <div className="w-72 shrink-0 bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-4">
              {[
                { label: "Evidence Dashboard", value: source.metadata.evidenceDashboard },
                { label: "Locale", value: source.metadata.locale },
                { label: "Source", value: source.metadata.source },
                { label: "Description", value: source.metadata.description },
                { label: "Reliability Score", value: source.metadata.reliabilityScore },
                { label: "Collection date to", value: source.metadata.collectionDateTo },
                { label: "Collection date from", value: source.metadata.collectionDateFrom },
              ].map(({ label, value }) => (
                <div key={label} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-xs font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
