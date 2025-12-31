"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  RefreshCw,
  Shield,
} from "lucide-react";
import { employees } from "@/lib/mock-data";
import { format, parseISO, differenceInDays } from "date-fns";

// Simulate logged-in employee (John Martinez)
const currentEmployee = employees.find((e) => e.id === "emp-001")!;

type FilterStatus = "all" | "valid" | "expiring-soon" | "expired";

export default function MyCertificationsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // Get certifications with additional computed fields
  const myCertifications = currentEmployee.certifications.map((cert) => ({
    ...cert,
    daysUntilExpiration: differenceInDays(
      parseISO(cert.expirationDate),
      new Date()
    ),
  }));

  // Filter certifications
  const filteredCerts = myCertifications.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  // Sort: expired first, then expiring soon, then by expiration date
  const sortedCerts = [...filteredCerts].sort((a, b) => {
    const statusOrder: Record<string, number> = {
      expired: 0,
      "expiring-soon": 1,
      valid: 2,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.daysUntilExpiration - b.daysUntilExpiration;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-700";
      case "expiring-soon":
        return "bg-amber-100 text-amber-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return CheckCircle;
      case "expiring-soon":
        return Clock;
      case "expired":
        return AlertCircle;
      default:
        return Award;
    }
  };

  // Stats
  const stats = {
    total: myCertifications.length,
    valid: myCertifications.filter((c) => c.status === "valid").length,
    expiringSoon: myCertifications.filter((c) => c.status === "expiring-soon")
      .length,
    expired: myCertifications.filter((c) => c.status === "expired").length,
  };

  const selectedCertItem = selectedCert
    ? myCertifications.find((c) => c.id === selectedCert)
    : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Certifications</h1>
        <p className="text-slate-600 mt-1">
          View and manage your professional certifications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => setFilterStatus("all")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "all" ? "ring-2 ring-emerald-500" : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("valid")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "valid"
              ? "ring-2 ring-emerald-500"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.valid}</p>
              <p className="text-sm text-slate-500">Valid</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("expiring-soon")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "expiring-soon"
              ? "ring-2 ring-emerald-500"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.expiringSoon}
              </p>
              <p className="text-sm text-slate-500">Expiring Soon</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("expired")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "expired"
              ? "ring-2 ring-emerald-500"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.expired}
              </p>
              <p className="text-sm text-slate-500">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner for Expired/Expiring */}
      {(stats.expired > 0 || stats.expiringSoon > 0) && (
        <div
          className={`rounded-xl p-4 mb-8 ${
            stats.expired > 0
              ? "bg-red-50 border border-red-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              className={`w-5 h-5 ${
                stats.expired > 0 ? "text-red-500" : "text-amber-500"
              }`}
            />
            <div>
              <p
                className={`font-medium ${
                  stats.expired > 0 ? "text-red-800" : "text-amber-800"
                }`}
              >
                {stats.expired > 0
                  ? `You have ${stats.expired} expired certification(s)`
                  : `You have ${stats.expiringSoon} certification(s) expiring soon`}
              </p>
              <p
                className={`text-sm ${
                  stats.expired > 0 ? "text-red-600" : "text-amber-600"
                }`}
              >
                Please contact your supervisor to arrange renewal
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Certification List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {filterStatus === "all"
                  ? "All Certifications"
                  : filterStatus === "valid"
                  ? "Valid Certifications"
                  : filterStatus === "expiring-soon"
                  ? "Expiring Soon"
                  : "Expired Certifications"}
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {sortedCerts.length === 0 ? (
                <div className="p-12 text-center">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">
                    No certifications in this category
                  </p>
                </div>
              ) : (
                sortedCerts.map((cert) => {
                  const Icon = getStatusIcon(cert.status);
                  return (
                    <div
                      key={cert.id}
                      onClick={() => setSelectedCert(cert.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedCert === cert.id
                          ? "bg-emerald-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            cert.status === "valid"
                              ? "bg-green-100"
                              : cert.status === "expiring-soon"
                              ? "bg-amber-100"
                              : "bg-red-100"
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 ${
                              cert.status === "valid"
                                ? "text-green-600"
                                : cert.status === "expiring-soon"
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-medium text-slate-900">
                              {cert.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(
                                cert.status
                              )}`}
                            >
                              {cert.status === "expiring-soon"
                                ? "Expiring Soon"
                                : cert.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Issued: {format(parseISO(cert.issuedDate), "MMM d, yyyy")}
                            </span>
                            <span
                              className={`flex items-center gap-1 ${
                                cert.status === "expired"
                                  ? "text-red-600"
                                  : cert.status === "expiring-soon"
                                  ? "text-amber-600"
                                  : ""
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              {cert.status === "expired"
                                ? `Expired ${format(
                                    parseISO(cert.expirationDate),
                                    "MMM d, yyyy"
                                  )}`
                                : `Expires ${format(
                                    parseISO(cert.expirationDate),
                                    "MMM d, yyyy"
                                  )}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Certification Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            {selectedCertItem ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      selectedCertItem.status === "valid"
                        ? "bg-green-100"
                        : selectedCertItem.status === "expiring-soon"
                        ? "bg-amber-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Shield
                      className={`w-12 h-12 ${
                        selectedCertItem.status === "valid"
                          ? "text-green-600"
                          : selectedCertItem.status === "expiring-soon"
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                  {selectedCertItem.name}
                </h3>

                <div className="flex justify-center mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedCertItem.status
                    )}`}
                  >
                    {selectedCertItem.status === "expiring-soon"
                      ? "Expiring Soon"
                      : selectedCertItem.status === "valid"
                      ? "Valid"
                      : "Expired"}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Issued Date</span>
                    <span className="text-sm font-medium text-slate-900">
                      {format(
                        parseISO(selectedCertItem.issuedDate),
                        "MMMM d, yyyy"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">
                      Expiration Date
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        selectedCertItem.status === "expired"
                          ? "text-red-600"
                          : selectedCertItem.status === "expiring-soon"
                          ? "text-amber-600"
                          : "text-slate-900"
                      }`}
                    >
                      {format(
                        parseISO(selectedCertItem.expirationDate),
                        "MMMM d, yyyy"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Time Remaining</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedCertItem.status === "expired"
                          ? "text-red-600"
                          : selectedCertItem.status === "expiring-soon"
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {selectedCertItem.status === "expired"
                        ? `Expired ${Math.abs(
                            selectedCertItem.daysUntilExpiration
                          )} days ago`
                        : `${selectedCertItem.daysUntilExpiration} days`}
                    </span>
                  </div>

                  <div className="flex justify-between py-3">
                    <span className="text-sm text-slate-500">Holder</span>
                    <span className="text-sm font-medium text-slate-900">
                      {currentEmployee.name}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedCertItem.status === "valid" && (
                    <button className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Certificate
                    </button>
                  )}

                  {(selectedCertItem.status === "expired" ||
                    selectedCertItem.status === "expiring-soon") && (
                    <button className="w-full px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Request Renewal
                    </button>
                  )}

                  <button className="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    View History
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  Select a certification to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
