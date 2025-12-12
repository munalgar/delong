"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react";
import { getTrainingById, employees, getEmployeeById } from "@/lib/mock-data";
import { format, parseISO } from "date-fns";
import { TrainingStatus } from "@/lib/types";

const StatusBadge = ({ status }: { status: TrainingStatus }) => {
  const config = {
    "not-started": {
      bg: "bg-slate-100",
      text: "text-slate-600",
      label: "Not Started",
    },
    "in-progress": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "In Progress",
    },
    "at-risk": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "At Risk",
    },
    overdue: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
    complete: { bg: "bg-green-100", text: "text-green-700", label: "Complete" },
  };

  const { bg, text, label } = config[status];

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

export default function TrainingDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/training";
  const training = getTrainingById(params.id as string);

  if (!training) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Training module not found</p>
      </div>
    );
  }

  // Get all assignments for this training
  const assignments = employees.flatMap((emp) =>
    emp.trainingAssignments
      .filter((t) => t.trainingId === training.id)
      .map((t) => ({
        ...t,
        employee: emp,
      }))
  );

  const stats = {
    total: assignments.length,
    notStarted: assignments.filter((a) => a.status === "not-started").length,
    inProgress: assignments.filter((a) => a.status === "in-progress").length,
    atRisk: assignments.filter((a) => a.status === "at-risk").length,
    complete: assignments.filter((a) => a.status === "complete").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  };

  return (
    <div className="p-8">
      {/* Back button */}
      <Link
        href={returnTo}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {returnTo === "/dashboard" ? "Dashboard" : "Training Library"}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {training.title}
              </h1>
              {training.isOutdated && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  Needs Update
                </span>
              )}
              {!training.isOutdated && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Up to Date
                </span>
              )}
            </div>
            <p className="text-slate-600">{training.description}</p>
          </div>
          <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-medium text-slate-700">
            v{training.version}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{training.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4" />
            <span>{training.department}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              Created {format(parseISO(training.createdDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              Updated {format(parseISO(training.lastUpdated), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Training Content
              </h2>
            </div>
            <div className="p-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 whitespace-pre-line">
                  {training.content}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Assignment Tracking
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Not Started</span>
                  <span className="font-semibold text-slate-900">
                    {stats.notStarted}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-600">In Progress</span>
                  <span className="font-semibold text-blue-700">
                    {stats.inProgress}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-yellow-600">At Risk</span>
                  <span className="font-semibold text-yellow-700">
                    {stats.atRisk}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-600">Complete</span>
                  <span className="font-semibold text-green-700">
                    {stats.complete}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-red-600">Overdue</span>
                  <span className="font-semibold text-red-700">
                    {stats.overdue}
                  </span>
                </div>
              </div>

              {stats.total > 0 && (
                <div className="mt-6">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${(stats.complete / stats.total) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{
                        width: `${(stats.inProgress / stats.total) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${(stats.atRisk / stats.total) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${(stats.overdue / stats.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-2 text-center">
                    {Math.round((stats.complete / stats.total) * 100)}%
                    completion rate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Employees */}
      {assignments.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">
              Assigned Employees
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/employees/${assignment.employee.id}`}
                className="flex items-center p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium mr-4">
                  {assignment.employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">
                    {assignment.employee.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {assignment.employee.department}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm text-slate-600">
                    Due: {format(parseISO(assignment.dueDate), "MMM d, yyyy")}
                  </p>
                  {assignment.completedDate && (
                    <p className="text-xs text-green-600">
                      Completed:{" "}
                      {format(
                        parseISO(assignment.completedDate),
                        "MMM d, yyyy"
                      )}
                    </p>
                  )}
                </div>
                <StatusBadge status={assignment.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
