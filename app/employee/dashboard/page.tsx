"use client";

import Link from "next/link";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  Calendar,
  ArrowRight,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { employees, trainingModules, incidents } from "@/lib/mock-data";
import { format, parseISO, differenceInDays } from "date-fns";

// Simulate logged-in employee (John Martinez)
const currentEmployee = employees.find((e) => e.id === "emp-001")!;

export default function EmployeeDashboardPage() {
  // Get training stats
  const completedTraining = currentEmployee.trainingAssignments.filter(
    (t) => t.status === "complete"
  ).length;
  const pendingTraining = currentEmployee.trainingAssignments.filter(
    (t) => t.status !== "complete"
  ).length;
  const overdueTraining = currentEmployee.trainingAssignments.filter(
    (t) => t.status === "overdue"
  ).length;

  // Get certification stats
  const validCerts = currentEmployee.certifications.filter(
    (c) => c.status === "valid"
  ).length;
  const expiringSoonCerts = currentEmployee.certifications.filter(
    (c) => c.status === "expiring-soon"
  ).length;
  const expiredCerts = currentEmployee.certifications.filter(
    (c) => c.status === "expired"
  ).length;

  // Get involved incidents
  const myIncidents = incidents.filter((i) =>
    currentEmployee.incidentIds.includes(i.id)
  );

  // Get upcoming training due dates
  const upcomingTraining = currentEmployee.trainingAssignments
    .filter((t) => t.status !== "complete")
    .map((t) => ({
      ...t,
      training: trainingModules.find((m) => m.id === t.trainingId),
      daysUntilDue: differenceInDays(parseISO(t.dueDate), new Date()),
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  // Get expiring certifications
  const expiringCerts = currentEmployee.certifications
    .filter((c) => c.status !== "expired")
    .map((c) => ({
      ...c,
      daysUntilExpiration: differenceInDays(
        parseISO(c.expirationDate),
        new Date()
      ),
    }))
    .sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "at-risk":
        return "bg-amber-100 text-amber-700";
      case "non-compliant":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {currentEmployee.name.split(" ")[0]}!
        </h1>
        <p className="text-slate-600 mt-1">
          Here&apos;s your safety compliance overview
        </p>
      </div>

      {/* Compliance Status Banner */}
      <div
        className={`rounded-xl p-6 mb-8 ${
          currentEmployee.complianceStatus === "compliant"
            ? "bg-green-50 border border-green-200"
            : currentEmployee.complianceStatus === "at-risk"
            ? "bg-amber-50 border border-amber-200"
            : currentEmployee.complianceStatus === "non-compliant"
            ? "bg-red-50 border border-red-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentEmployee.complianceStatus === "compliant"
                  ? "bg-green-100"
                  : currentEmployee.complianceStatus === "at-risk"
                  ? "bg-amber-100"
                  : currentEmployee.complianceStatus === "non-compliant"
                  ? "bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              {currentEmployee.complianceStatus === "compliant" ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle
                  className={`w-6 h-6 ${
                    currentEmployee.complianceStatus === "non-compliant"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-600">Your Compliance Status</p>
              <p
                className={`text-xl font-bold capitalize ${
                  currentEmployee.complianceStatus === "compliant"
                    ? "text-green-700"
                    : currentEmployee.complianceStatus === "at-risk"
                    ? "text-amber-700"
                    : currentEmployee.complianceStatus === "non-compliant"
                    ? "text-red-700"
                    : "text-blue-700"
                }`}
              >
                {currentEmployee.complianceStatus.replace("-", " ")}
              </p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getComplianceStatusColor(
              currentEmployee.complianceStatus
            )}`}
          >
            {overdueTraining > 0
              ? `${overdueTraining} overdue training`
              : expiredCerts > 0
              ? `${expiredCerts} expired certification`
              : "All requirements met"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Training Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {completedTraining}/{currentEmployee.trainingAssignments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Training</p>
              <p className="text-2xl font-bold text-slate-900">
                {pendingTraining}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Valid Certifications</p>
              <p className="text-2xl font-bold text-slate-900">
                {validCerts}/{currentEmployee.certifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Incidents Involved</p>
              <p className="text-2xl font-bold text-slate-900">
                {myIncidents.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Alerts */}
      {(overdueTraining > 0 || expiredCerts > 0 || expiringSoonCerts > 0) && (
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Action Required
            </h2>
          </div>
          <div className="p-6 space-y-3">
            {upcomingTraining
              .filter((t) => t.status === "overdue")
              .map((t) => (
                <Link
                  key={t.id}
                  href="/employee/training"
                  className="flex items-center gap-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Clock className="w-5 h-5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Overdue Training: {t.training?.title}
                    </p>
                    <p className="text-sm text-red-600">
                      Was due {format(parseISO(t.dueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </Link>
              ))}
            {currentEmployee.certifications
              .filter((c) => c.status === "expired")
              .map((c) => (
                <Link
                  key={c.id}
                  href="/employee/certifications"
                  className="flex items-center gap-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Expired Certification: {c.name}
                    </p>
                    <p className="text-sm text-red-600">
                      Expired on {format(parseISO(c.expirationDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </Link>
              ))}
            {currentEmployee.certifications
              .filter((c) => c.status === "expiring-soon")
              .map((c) => (
                <Link
                  key={c.id}
                  href="/employee/certifications"
                  className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Expiring Soon: {c.name}
                    </p>
                    <p className="text-sm text-amber-600">
                      Expires on {format(parseISO(c.expirationDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </Link>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Training */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Upcoming Training
            </h2>
            <Link
              href="/employee/training"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {upcomingTraining.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-slate-600">All training completed!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTraining.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        assignment.status === "overdue"
                          ? "bg-red-100"
                          : assignment.status === "at-risk"
                          ? "bg-amber-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <GraduationCap
                        className={`w-5 h-5 ${
                          assignment.status === "overdue"
                            ? "text-red-600"
                            : assignment.status === "at-risk"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {assignment.training?.title}
                      </p>
                      <p
                        className={`text-sm ${
                          assignment.status === "overdue"
                            ? "text-red-600"
                            : assignment.status === "at-risk"
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}
                      >
                        {assignment.status === "overdue"
                          ? `Overdue by ${Math.abs(assignment.daysUntilDue)} days`
                          : `Due in ${assignment.daysUntilDue} days`}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        assignment.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : assignment.status === "at-risk"
                          ? "bg-amber-100 text-amber-700"
                          : assignment.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {assignment.status.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certifications Overview */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              My Certifications
            </h2>
            <Link
              href="/employee/certifications"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {expiringCerts.slice(0, 3).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      cert.status === "expired"
                        ? "bg-red-100"
                        : cert.status === "expiring-soon"
                        ? "bg-amber-100"
                        : "bg-green-100"
                    }`}
                  >
                    <Award
                      className={`w-5 h-5 ${
                        cert.status === "expired"
                          ? "text-red-600"
                          : cert.status === "expiring-soon"
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{cert.name}</p>
                    <p
                      className={`text-sm ${
                        cert.status === "expired"
                          ? "text-red-600"
                          : cert.status === "expiring-soon"
                          ? "text-amber-600"
                          : "text-slate-500"
                      }`}
                    >
                      {cert.status === "expired"
                        ? "Expired"
                        : cert.daysUntilExpiration <= 30
                        ? `Expires in ${cert.daysUntilExpiration} days`
                        : `Expires ${format(
                            parseISO(cert.expirationDate),
                            "MMM d, yyyy"
                          )}`}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      cert.status === "expired"
                        ? "bg-red-100 text-red-700"
                        : cert.status === "expiring-soon"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {cert.status === "expiring-soon"
                      ? "Expiring Soon"
                      : cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/employee/report-incident"
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Report an Incident</p>
              <p className="text-sm text-slate-500">
                Submit a safety incident report
              </p>
            </div>
          </Link>

          <Link
            href="/employee/training"
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Continue Training</p>
              <p className="text-sm text-slate-500">
                {pendingTraining} modules pending
              </p>
            </div>
          </Link>

          <Link
            href="/employee/calendar"
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">View Calendar</p>
              <p className="text-sm text-slate-500">
                See upcoming deadlines
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
