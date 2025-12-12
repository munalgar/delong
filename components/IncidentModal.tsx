"use client";

import Link from "next/link";
import { X, AlertTriangle } from "lucide-react";
import { Incident } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  incidents: Incident[];
}

export default function IncidentModal({
  isOpen,
  onClose,
  date,
  incidents,
}: IncidentModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Incidents on {format(parseISO(date), "MMMM d, yyyy")}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {incidents.length} incident{incidents.length !== 1 ? "s" : ""}{" "}
              reported
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No incidents reported on this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/incidents/${incident.id}?returnTo=/dashboard`}
                  className="block p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          incident.severity === "Critical"
                            ? "text-red-600"
                            : incident.severity === "Severe"
                            ? "text-orange-600"
                            : incident.severity === "Moderate"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            incident.severity === "Critical"
                              ? "bg-red-100 text-red-700"
                              : incident.severity === "Severe"
                              ? "bg-orange-100 text-orange-700"
                              : incident.severity === "Moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {incident.severity}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            incident.status === "Closed"
                              ? "bg-slate-100 text-slate-700"
                              : incident.status === "Under Review"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {incident.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {incident.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{incident.type}</span>
                        <span>•</span>
                        <span>{incident.department}</span>
                        <span>•</span>
                        <span>{incident.location}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {format(parseISO(incident.dateTime), "h:mm a")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
