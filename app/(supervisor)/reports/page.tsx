"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, ChevronRight, FileText, Calendar } from "lucide-react";
import { reports, getIncidentById } from "@/lib/mock-data";
import { format, parseISO } from "date-fns";
import { ReportType, ReportStatus } from "@/lib/types";

const reportTypes: ReportType[] = ["Company Safety", "OSHA"];
const reportStatuses: ReportStatus[] = [
  "Draft",
  "Under Review",
  "Approved",
  "Denied",
  "Closed",
];

const TypeBadge = ({ type }: { type: ReportType }) => {
  const styles = {
    "Company Safety": "bg-orange-100 text-orange-700",
    OSHA: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type]}`}
    >
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles = {
    Draft: "bg-slate-100 text-slate-700",
    "Under Review": "bg-amber-100 text-amber-700",
    Approved: "bg-green-100 text-green-700",
    Denied: "bg-red-100 text-red-700",
    Closed: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ReportType | "">("");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || report.type === selectedType;
      const matchesStatus = !selectedStatus || report.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const sortedReports = [...filteredReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const stats = {
    total: reports.length,
    draft: reports.filter((r) => r.status === "Draft").length,
    underReview: reports.filter((r) => r.status === "Under Review").length,
    approved: reports.filter((r) => r.status === "Approved").length,
    closed: reports.filter((r) => r.status === "Closed").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">
          Review and manage incident reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total Reports</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-slate-600">{stats.draft}</p>
          <p className="text-sm text-slate-500">Draft</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-amber-600">
            {stats.underReview}
          </p>
          <p className="text-sm text-slate-500">Under Review</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-slate-500">Approved</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-slate-600">{stats.closed}</p>
          <p className="text-sm text-slate-500">Closed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-slate-700"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? "bg-orange-50 border-orange-300 text-orange-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="px-4 pb-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as ReportType | "")
                }
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              >
                <option value="">All Types</option>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ReportStatus | "")
                }
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              >
                <option value="">All Statuses</option>
                {reportStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {sortedReports.length} of {reports.length} reports
      </p>

      {/* Report List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {sortedReports.map((report) => {
            const incident = getIncidentById(report.incidentId);

            return (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="flex items-center p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText
                    className={`w-6 h-6 ${
                      report.type === "OSHA"
                        ? "text-blue-500"
                        : "text-orange-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-slate-900">
                      {report.title}
                    </h3>
                    <TypeBadge type={report.type} />
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-sm text-slate-500">
                    Related to: {incident?.title || "Unknown incident"}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created:{" "}
                      {format(parseISO(report.createdAt), "MMM d, yyyy")}
                    </span>
                    <span>{report.auditTrail.length} audit entries</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
            );
          })}
        </div>

        {sortedReports.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">
              No reports found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
