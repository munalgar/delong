"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Users,
  BookOpen,
  FileWarning,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  employees,
  incidents,
  trainingModules,
  getActiveIncidents,
  getDaysSinceLastIncident,
  getOverdueTraining,
  getExpiredCertifications,
  getOutdatedModules,
  incidentHeatmapData,
  getTrainingById,
  getIncidentsByDate,
} from "@/lib/mock-data";
import { format, parseISO } from "date-fns";
import IncidentModal from "@/components/IncidentModal";
import { Incident } from "@/lib/types";

export default function DashboardPage() {
  const [activityView, setActivityView] = useState<"weekly" | "monthly">(
    "weekly"
  );
  const [heatmapMonth, setHeatmapMonth] = useState("2024-11");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedIncidents, setSelectedIncidents] = useState<Incident[]>([]);

  const activeIncidents = getActiveIncidents().sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
  const daysSinceLastIncident = getDaysSinceLastIncident();
  const overdueTraining = getOverdueTraining();
  const expiredCerts = getExpiredCertifications();
  const outdatedModules = getOutdatedModules();

  // Priority Alerts
  const alerts = [
    ...expiredCerts.map(({ employee, certification }) => ({
      id: `cert-${certification.id}`,
      type: "error" as const,
      icon: AlertCircle,
      title: "Expired Certification",
      description: `${employee.name}'s ${
        certification.name
      } expired on ${format(
        parseISO(certification.expirationDate),
        "MMM d, yyyy"
      )}`,
      link: `/employees/${employee.id}`,
    })),
    ...overdueTraining.map(({ employee, assignment, training }) => ({
      id: `training-${assignment.id}`,
      type: "warning" as const,
      icon: Clock,
      title: "Overdue Training",
      description: `${employee.name} - ${training.title} was due ${format(
        parseISO(assignment.dueDate),
        "MMM d, yyyy"
      )}`,
      link: `/employees/${employee.id}`,
    })),
    ...outdatedModules.map((module) => ({
      id: `module-${module.id}`,
      type: "info" as const,
      icon: FileWarning,
      title: "Outdated Training Module",
      description: `${module.title} - Last updated ${format(
        parseISO(module.lastUpdated),
        "MMM d, yyyy"
      )}`,
      link: `/training/${module.id}`,
    })),
  ];

  // Recent Activity
  const recentIncidents = incidents
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    )
    .slice(0, 3);

  const recentTrainingCompleted = employees
    .flatMap((emp) =>
      emp.trainingAssignments
        .filter((t) => t.status === "complete" && t.completedDate)
        .map((t) => ({
          employee: emp,
          assignment: t,
          training: getTrainingById(t.trainingId)!,
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.assignment.completedDate!).getTime() -
        new Date(a.assignment.completedDate!).getTime()
    )
    .slice(0, 3);

  // Heatmap
  const heatmapData =
    incidentHeatmapData[heatmapMonth as keyof typeof incidentHeatmapData] || [];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [year, month] = heatmapMonth.split("-");
  const monthName = monthNames[parseInt(month) - 1];

  const changeMonth = (delta: number) => {
    const [y, m] = heatmapMonth.split("-").map(Number);
    let newMonth = m + delta;
    let newYear = y;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setHeatmapMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };

  const handleDayClick = (day: number) => {
    const [y, m] = heatmapMonth.split("-").map(Number);
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
    const dayIncidents = getIncidentsByDate(y, m, day);
    setSelectedDate(dateStr);
    setSelectedIncidents(dayIncidents);
    setModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1"></p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Employees</p>
              <p className="text-2xl font-bold text-slate-900">
                {employees.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Training Modules</p>
              <p className="text-2xl font-bold text-slate-900">
                {trainingModules.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Incidents</p>
              <p className="text-2xl font-bold text-slate-900">
                {activeIncidents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Days Since Last Incident</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Priority Alerts
              </h2>
            </div>
            <div className="p-6">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>No priority alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {alerts.slice(0, 6).map((alert) => {
                    const Icon = alert.icon;
                    const bgColor =
                      alert.type === "error"
                        ? "bg-red-50"
                        : alert.type === "warning"
                        ? "bg-amber-50"
                        : "bg-blue-50";
                    const iconColor =
                      alert.type === "error"
                        ? "text-red-500"
                        : alert.type === "warning"
                        ? "text-amber-500"
                        : "text-blue-500";

                    return (
                      <Link
                        key={alert.id}
                        href={`${alert.link}?returnTo=/dashboard`}
                        className={`flex items-start gap-4 p-4 rounded-lg ${bgColor} hover:opacity-80 transition-opacity`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {alert.title}
                          </p>
                          <p className="text-sm text-slate-600">
                            {alert.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Incidents */}
        <div>
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Active Incidents
              </h2>
            </div>
            <div className="p-6">
              {activeIncidents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      {daysSinceLastIncident}
                    </span>
                  </div>
                  <p className="text-slate-600">Days since last incident</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeIncidents.slice(0, 3).map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/incidents/${incident.id}?returnTo=/dashboard`}
                      className="block p-4 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            incident.severity === "Critical"
                              ? "bg-red-700 text-white"
                              : incident.severity === "Severe"
                              ? "bg-red-100 text-red-700"
                              : incident.severity === "Moderate"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {incident.severity}
                        </span>
                        <span className="text-xs text-slate-500">
                          {incident.status}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900 text-sm">
                        {incident.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(parseISO(incident.dateTime), "MMM d, yyyy")}
                      </p>
                    </Link>
                  ))}
                  {activeIncidents.length > 3 && (
                    <Link
                      href="/incidents"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                    >
                      View all {activeIncidents.length} incidents{" "}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setActivityView("weekly")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activityView === "weekly"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-600"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setActivityView("monthly")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activityView === "monthly"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-600"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  Recent Incidents
                </h3>
                <div className="space-y-3">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <div className="flex-1">
                        <Link
                          href={`/incidents/${incident.id}?returnTo=/dashboard`}
                          className="text-sm font-medium text-slate-900 hover:text-orange-600"
                        >
                          {incident.title}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {format(
                            parseISO(incident.dateTime),
                            "MMM d, yyyy h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  Completed Training
                </h3>
                <div className="space-y-3">
                  {recentTrainingCompleted.map(
                    ({ employee, assignment, training }) => (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {employee.name} completed {training.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(
                              parseISO(assignment.completedDate!),
                              "MMM d, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Heatmap */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Incident Heatmap
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
                {monthName} {year}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-medium text-slate-400 pb-2"
                >
                  {day}
                </div>
              ))}
              {/* Add empty cells for proper day alignment */}
              {Array.from({
                length: new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  1
                ).getDay(),
              }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {heatmapData.map(({ day, count }) => (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square rounded flex items-center justify-center text-xs transition-all hover:scale-110 hover:shadow-md cursor-pointer ${
                    count === 0
                      ? "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      : count === 1
                      ? "bg-orange-200 text-orange-800 hover:bg-orange-300"
                      : count === 2
                      ? "bg-orange-400 text-white hover:bg-orange-500"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                  title={`${day} - ${count} incident(s)`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-100 rounded" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-200 rounded" />
                <span>1</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded" />
                <span>2</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-600 rounded" />
                <span>3+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/employees?filter=overdue"
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">
                View Overdue Training
              </p>
              <p className="text-sm text-slate-500">
                {overdueTraining.length} assignments overdue
              </p>
            </div>
          </Link>

          <Link
            href="/training?filter=outdated"
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileWarning className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">
                Review Outdated Modules
              </p>
              <p className="text-sm text-slate-500">
                {outdatedModules.length} modules need updates
              </p>
            </div>
          </Link>

          <Link
            href="/incidents?status=Reported"
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">
                Review Pending Incidents
              </p>
              <p className="text-sm text-slate-500">
                {incidents.filter((i) => i.status === "Reported").length}{" "}
                pending review
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Incident Modal */}
      <IncidentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        incidents={selectedIncidents}
      />
    </div>
  );
}
