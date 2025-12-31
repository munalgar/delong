"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  GraduationCap,
  ArrowRight,
  Calendar,
  BookOpen,
} from "lucide-react";
import { employees, trainingModules } from "@/lib/mock-data";
import { format, parseISO, differenceInDays } from "date-fns";

// Simulate logged-in employee (John Martinez)
const currentEmployee = employees.find((e) => e.id === "emp-001")!;

type FilterStatus = "all" | "pending" | "complete" | "overdue";

export default function MyTrainingPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  // Get training assignments with module details
  const myTraining = currentEmployee.trainingAssignments.map((assignment) => ({
    ...assignment,
    training: trainingModules.find((t) => t.id === assignment.trainingId)!,
    daysUntilDue: differenceInDays(parseISO(assignment.dueDate), new Date()),
  }));

  // Filter training
  const filteredTraining = myTraining.filter((t) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending")
      return t.status !== "complete" && t.status !== "overdue";
    if (filterStatus === "complete") return t.status === "complete";
    if (filterStatus === "overdue") return t.status === "overdue";
    return true;
  });

  // Sort: overdue first, then by due date
  const sortedTraining = [...filteredTraining].sort((a, b) => {
    if (a.status === "complete" && b.status !== "complete") return 1;
    if (a.status !== "complete" && b.status === "complete") return -1;
    if (a.status === "overdue" && b.status !== "overdue") return -1;
    if (a.status !== "overdue" && b.status === "overdue") return 1;
    return a.daysUntilDue - b.daysUntilDue;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "at-risk":
        return "bg-amber-100 text-amber-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return CheckCircle;
      case "overdue":
        return AlertTriangle;
      case "at-risk":
        return Clock;
      case "in-progress":
        return PlayCircle;
      default:
        return Clock;
    }
  };

  // Stats
  const stats = {
    total: myTraining.length,
    completed: myTraining.filter((t) => t.status === "complete").length,
    pending: myTraining.filter(
      (t) => t.status !== "complete" && t.status !== "overdue"
    ).length,
    overdue: myTraining.filter((t) => t.status === "overdue").length,
  };

  const selectedTrainingItem = selectedTraining
    ? myTraining.find((t) => t.id === selectedTraining)
    : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Training</h1>
        <p className="text-slate-600 mt-1">
          View and complete your assigned training modules
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
              <GraduationCap className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Assigned</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("complete")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "complete"
              ? "ring-2 ring-emerald-500"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.completed}
              </p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("pending")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "pending"
              ? "ring-2 ring-emerald-500"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              <p className="text-sm text-slate-500">In Progress</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("overdue")}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
            filterStatus === "overdue"
              ? "ring-2 ring-emerald-500"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.overdue}</p>
              <p className="text-sm text-slate-500">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Overall Progress
          </h2>
          <span className="text-sm font-medium text-slate-600">
            {stats.completed} of {stats.total} complete (
            {Math.round((stats.completed / stats.total) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Training List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {filterStatus === "all"
                  ? "All Training"
                  : filterStatus === "complete"
                  ? "Completed Training"
                  : filterStatus === "pending"
                  ? "Pending Training"
                  : "Overdue Training"}
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {sortedTraining.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-600">No training in this category</p>
                </div>
              ) : (
                sortedTraining.map((item) => {
                  const Icon = getStatusIcon(item.status);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTraining(item.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedTraining === item.id
                          ? "bg-emerald-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            item.status === "complete"
                              ? "bg-green-100"
                              : item.status === "overdue"
                              ? "bg-red-100"
                              : item.status === "at-risk"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              item.status === "complete"
                                ? "text-green-600"
                                : item.status === "overdue"
                                ? "text-red-600"
                                : item.status === "at-risk"
                                ? "text-amber-600"
                                : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {item.training?.title}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                {item.training?.description}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status.replace("-", " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {item.training?.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {item.status === "complete" && item.completedDate
                                ? `Completed ${format(
                                    parseISO(item.completedDate),
                                    "MMM d, yyyy"
                                  )}`
                                : item.status === "overdue"
                                ? `Was due ${format(
                                    parseISO(item.dueDate),
                                    "MMM d, yyyy"
                                  )}`
                                : `Due ${format(
                                    parseISO(item.dueDate),
                                    "MMM d, yyyy"
                                  )}`}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Training Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            {selectedTrainingItem ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedTrainingItem.status === "complete"
                        ? "bg-green-100"
                        : selectedTrainingItem.status === "overdue"
                        ? "bg-red-100"
                        : selectedTrainingItem.status === "at-risk"
                        ? "bg-amber-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <BookOpen
                      className={`w-6 h-6 ${
                        selectedTrainingItem.status === "complete"
                          ? "text-green-600"
                          : selectedTrainingItem.status === "overdue"
                          ? "text-red-600"
                          : selectedTrainingItem.status === "at-risk"
                          ? "text-amber-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {selectedTrainingItem.training?.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      v{selectedTrainingItem.training?.version}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-sm text-slate-700">
                      {selectedTrainingItem.training?.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Duration
                    </p>
                    <p className="text-sm text-slate-900">
                      {selectedTrainingItem.training?.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Department
                    </p>
                    <p className="text-sm text-slate-900">
                      {selectedTrainingItem.training?.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        selectedTrainingItem.status
                      )}`}
                    >
                      {selectedTrainingItem.status.replace("-", " ")}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      {selectedTrainingItem.status === "complete"
                        ? "Completed On"
                        : "Due Date"}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        selectedTrainingItem.status === "overdue"
                          ? "text-red-600"
                          : "text-slate-900"
                      }`}
                    >
                      {selectedTrainingItem.status === "complete" &&
                      selectedTrainingItem.completedDate
                        ? format(
                            parseISO(selectedTrainingItem.completedDate),
                            "MMMM d, yyyy"
                          )
                        : format(
                            parseISO(selectedTrainingItem.dueDate),
                            "MMMM d, yyyy"
                          )}
                    </p>
                    {selectedTrainingItem.status !== "complete" && (
                      <p
                        className={`text-xs ${
                          selectedTrainingItem.status === "overdue"
                            ? "text-red-500"
                            : "text-slate-500"
                        }`}
                      >
                        {selectedTrainingItem.status === "overdue"
                          ? `${Math.abs(selectedTrainingItem.daysUntilDue)} days overdue`
                          : `${selectedTrainingItem.daysUntilDue} days remaining`}
                      </p>
                    )}
                  </div>
                </div>

                {selectedTrainingItem.status !== "complete" && (
                  <button className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Start Training
                  </button>
                )}

                {selectedTrainingItem.status === "complete" && (
                  <button className="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    View Certificate
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  Select a training module to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
