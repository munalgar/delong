"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Upload,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { employees } from "@/lib/mock-data";
import { IncidentType, Severity, Department } from "@/lib/types";

// Simulate logged-in employee (John Martinez)
const currentEmployee = employees.find((e) => e.id === "emp-001")!;

const incidentTypes: IncidentType[] = [
  "Slip/Fall",
  "Equipment Malfunction",
  "Chemical Exposure",
  "Ergonomic Injury",
  "Fire/Explosion",
  "Vehicle Incident",
  "Other",
];

const severityLevels: Severity[] = ["Minor", "Moderate", "Severe", "Critical"];

const departments: Department[] = [
  "Grain Handling",
  "Logistics",
  "Maintenance",
  "Agronomy",
  "Admin",
];

export default function ReportIncidentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedTime, setSubmittedTime] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "" as IncidentType | "",
    severity: "" as Severity | "",
    department: currentEmployee.department as Department,
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    involvedOthers: false,
    otherEmployees: "",
    witnessNames: "",
    immediateActions: "",
    injuryOccurred: false,
    injuryDescription: "",
    propertyDamage: false,
    propertyDamageDescription: "",
  });

  // Generate reference ID based on submission time
  const referenceId = useMemo(() => {
    return submittedTime ? `INC-${submittedTime.toString().slice(-6)}` : "";
  }, [submittedTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log("Submitting incident report:", formData);
    setSubmittedTime(Date.now());
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Incident Report Submitted
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you for reporting this incident. Your report has been
              submitted and will be reviewed by the safety team. You may be
              contacted for additional information.
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Reference ID:{" "}
              <span className="font-mono font-medium">
                {referenceId}
              </span>
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/employee/dashboard"
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Return to Dashboard
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedTime(null);
                  setFormData({
                    title: "",
                    description: "",
                    type: "",
                    severity: "",
                    department: currentEmployee.department,
                    location: "",
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toTimeString().slice(0, 5),
                    involvedOthers: false,
                    otherEmployees: "",
                    witnessNames: "",
                    immediateActions: "",
                    injuryOccurred: false,
                    injuryDescription: "",
                    propertyDamage: false,
                    propertyDamageDescription: "",
                  });
                }}
                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Report Another Incident
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/employee/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Report an Incident</h1>
        <p className="text-slate-600 mt-1">
          Please provide as much detail as possible about the safety incident
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Important</p>
            <p className="text-sm text-amber-700">
              If this is a medical emergency, call 911 immediately. For
              life-threatening situations, prioritize getting help before
              completing this report.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Basic Information */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Incident Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of what happened"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Incident Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                >
                  <option value="">Select type...</option>
                  {incidentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Severity *
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                >
                  <option value="">Select severity...</option>
                  {severityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Building A - Warehouse Floor"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date *
                  </div>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time *
                  </div>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Detailed Description
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    What happened? *
                  </div>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Please describe in detail what happened, including events leading up to the incident..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Immediate actions taken
                </label>
                <textarea
                  name="immediateActions"
                  value={formData.immediateActions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe any immediate actions taken after the incident..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* People Involved */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              People Involved
            </h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="involvedOthers"
                    checked={formData.involvedOthers}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">
                    Other employees were involved in this incident
                  </span>
                </label>
              </div>

              {formData.involvedOthers && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Names of other employees involved
                  </label>
                  <input
                    type="text"
                    name="otherEmployees"
                    value={formData.otherEmployees}
                    onChange={handleChange}
                    placeholder="Enter names, separated by commas"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Witnesses (if any)
                </label>
                <input
                  type="text"
                  name="witnessNames"
                  value={formData.witnessNames}
                  onChange={handleChange}
                  placeholder="Enter witness names, separated by commas"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Injury & Damage */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Injury & Property Damage
            </h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="injuryOccurred"
                    checked={formData.injuryOccurred}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">
                    An injury occurred
                  </span>
                </label>
              </div>

              {formData.injuryOccurred && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe the injury
                  </label>
                  <textarea
                    name="injuryDescription"
                    value={formData.injuryDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe the nature and extent of the injury, and any medical attention received..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="propertyDamage"
                    checked={formData.propertyDamage}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">
                    Property or equipment was damaged
                  </span>
                </label>
              </div>

              {formData.propertyDamage && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe the damage
                  </label>
                  <textarea
                    name="propertyDamageDescription"
                    value={formData.propertyDamageDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe what was damaged and the estimated extent of damage..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Attachments (Optional)
            </h2>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-slate-400">
                Supports: Images, PDFs, Documents (Max 10MB each)
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                * Required fields
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
