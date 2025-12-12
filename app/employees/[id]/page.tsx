"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
  Lightbulb,
  Plus,
} from "lucide-react";
import {
  getEmployeeById,
  getTrainingById,
  getIncidentById,
} from "@/lib/mock-data";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  TrainingStatus,
  CertificationStatus,
  ComplianceStatus,
} from "@/lib/types";

const TrainingStatusBadge = ({ status }: { status: TrainingStatus }) => {
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

const CertStatusBadge = ({ status }: { status: CertificationStatus }) => {
  const config = {
    valid: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle,
      label: "Valid",
    },
    "expiring-soon": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: Clock,
      label: "Expiring Soon",
    },
    expired: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: XCircle,
      label: "Expired",
    },
  };

  const { bg, text, icon: Icon, label } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const ComplianceBadge = ({ status }: { status: ComplianceStatus }) => {
  const config = {
    compliant: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle,
    },
    "in-progress": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: Clock,
    },
    "at-risk": {
      bg: "bg-orange-100",
      text: "text-orange-700",
      icon: AlertTriangle,
    },
    "non-compliant": { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  };

  const labels = {
    compliant: "Compliant",
    "in-progress": "In Progress",
    "at-risk": "At Risk",
    "non-compliant": "Non-Compliant",
  };

  const { bg, text, icon: Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full ${bg} ${text}`}
    >
      <Icon className="w-4 h-4" />
      {labels[status]}
    </span>
  );
};

export default function EmployeeProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/employees";
  const employee = getEmployeeById(params.id as string);
  const [trainingFilter, setTrainingFilter] = useState<
    "all" | "assigned" | "in-progress" | "overdue"
  >("all");
  const [expandedTraining, setExpandedTraining] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "",
    department: employee?.department || "Grain Handling",
  });

  if (!employee) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Employee not found</p>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
    });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
    });
  };

  const handleSave = () => {
    // In a real application, you would save the data to a backend here
    console.log("Saving employee data:", editedData);
    // For now, just exit edit mode
    setIsEditMode(false);
    // Note: In a real implementation, you would update the employee data in the backend
    // and possibly refresh the page or update local state
  };

  const filteredTraining = employee.trainingAssignments.filter((t) => {
    if (trainingFilter === "all") return true;
    if (trainingFilter === "assigned") return t.status === "not-started";
    if (trainingFilter === "in-progress")
      return t.status === "in-progress" || t.status === "at-risk";
    if (trainingFilter === "overdue") return t.status === "overdue";
    return true;
  });

  const certStats = {
    total: employee.certifications.length,
    valid: employee.certifications.filter((c) => c.status === "valid").length,
    expiring: employee.certifications.filter(
      (c) => c.status === "expiring-soon"
    ).length,
    expired: employee.certifications.filter((c) => c.status === "expired")
      .length,
  };

  // Recommended certifications based on department
  const recommendedCerts = {
    "Grain Handling": [
      "Grain Handling Safety",
      "Confined Space Entry",
      "Fall Protection",
    ],
    Logistics: [
      "Forklift Certification",
      "DOT Compliance",
      "Hazmat Transportation",
    ],
    Maintenance: ["Arc Flash Training", "LOTO Certification", "HVAC Safety"],
    Agronomy: [
      "Pesticide Applicator License",
      "Soil Science Certification",
      "Crop Protection",
    ],
    Admin: ["First Aid/CPR", "Emergency Response", "Safety Management"],
  };

  const employeeRecommendedCerts = recommendedCerts[employee.department] || [];
  const unacquiredCerts = employeeRecommendedCerts.filter(
    (cert) =>
      !employee.certifications.some((c) => c.name.includes(cert.split(" ")[0]))
  );

  const trainingStats = {
    total: employee.trainingAssignments.length,
    complete: employee.trainingAssignments.filter(
      (t) => t.status === "complete"
    ).length,
    inProgress: employee.trainingAssignments.filter(
      (t) => t.status === "in-progress" || t.status === "at-risk"
    ).length,
    overdue: employee.trainingAssignments.filter((t) => t.status === "overdue")
      .length,
  };

  // Recommended training based on department and current assignments
  const allTrainingModules = [
    {
      id: "tm-001",
      title: "Grain Bin Entry Safety",
      department: "Grain Handling",
    },
    {
      id: "tm-002",
      title: "Forklift Operation Certification",
      department: "Logistics",
    },
    {
      id: "tm-003",
      title: "Chemical Handling & HAZMAT",
      department: "Agronomy",
    },
    {
      id: "tm-004",
      title: "Electrical Safety Fundamentals",
      department: "Maintenance",
    },
    {
      id: "tm-005",
      title: "Fire Safety & Emergency Response",
      department: "All",
    },
    { id: "tm-006", title: "PPE Selection & Use", department: "All" },
    { id: "tm-007", title: "Ergonomics & Manual Handling", department: "All" },
    { id: "tm-008", title: "Confined Space Entry", department: "Maintenance" },
  ];

  const recommendedTraining = allTrainingModules
    .filter(
      (module) =>
        (module.department === employee.department ||
          module.department === "All") &&
        !employee.trainingAssignments.some(
          (assignment) => assignment.trainingId === module.id
        )
    )
    .slice(0, 3);

  return (
    <div className="p-8">
      {/* Back button */}
      <Link
        href={returnTo}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {returnTo === "/dashboard" ? "Dashboard" : "Employees"}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-2xl">
            {(isEditMode ? editedData.name : employee.name)
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            {isEditMode ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({ ...editedData, name: e.target.value })
                    }
                    aria-label="Employee name"
                    className="text-2xl font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <ComplianceBadge status={employee.complianceStatus} />
                </div>
                <select
                  value={editedData.role}
                  onChange={(e) =>
                    setEditedData({ ...editedData, role: e.target.value })
                  }
                  aria-label="Employee role"
                  className="text-lg text-slate-600 border border-slate-300 rounded-lg px-3 py-1 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Grain Elevator Operator">
                    Grain Elevator Operator
                  </option>
                  <option value="Warehouse Supervisor">
                    Warehouse Supervisor
                  </option>
                  <option value="Lead Maintenance Technician">
                    Lead Maintenance Technician
                  </option>
                  <option value="Field Agronomist">Field Agronomist</option>
                  <option value="Safety Coordinator">Safety Coordinator</option>
                  <option value="Quality Control Specialist">
                    Quality Control Specialist
                  </option>
                  <option value="Truck Driver">Truck Driver</option>
                  <option value="HVAC Technician">HVAC Technician</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Administrative Assistant">
                    Administrative Assistant
                  </option>
                </select>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-600" />
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) =>
                        setEditedData({ ...editedData, email: e.target.value })
                      }
                      aria-label="Email address"
                      className="text-slate-600 border border-slate-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-600" />
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) =>
                        setEditedData({ ...editedData, phone: e.target.value })
                      }
                      aria-label="Phone number"
                      className="text-slate-600 border border-slate-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <select
                      value={editedData.department}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          department: e.target
                            .value as typeof editedData.department,
                        })
                      }
                      aria-label="Department"
                      className="text-slate-600 border border-slate-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Grain Handling">Grain Handling</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Agronomy">Agronomy</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Hired {format(parseISO(employee.hireDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {employee.name}
                  </h1>
                  <ComplianceBadge status={employee.complianceStatus} />
                </div>
                <p className="text-lg text-slate-600 mb-4">{employee.role}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Hired {format(parseISO(employee.hireDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certifications */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Certifications
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">
                    {certStats.valid}
                  </p>
                  <p className="text-xs text-green-600">Valid</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">
                    {certStats.expiring}
                  </p>
                  <p className="text-xs text-yellow-600">Expiring</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-600">
                    {certStats.expired}
                  </p>
                  <p className="text-xs text-red-600">Expired</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {employee.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-900 text-sm">
                      {cert.name}
                    </h3>
                    <CertStatusBadge status={cert.status} />
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>
                      Issued: {format(parseISO(cert.issuedDate), "MMM d, yyyy")}
                    </p>
                    <p>
                      Expires:{" "}
                      {format(parseISO(cert.expirationDate), "MMM d, yyyy")}
                    </p>
                    {cert.status !== "expired" && (
                      <p
                        className={
                          cert.status === "expiring-soon"
                            ? "text-yellow-600 font-medium"
                            : ""
                        }
                      >
                        {differenceInDays(
                          parseISO(cert.expirationDate),
                          new Date()
                        )}{" "}
                        days remaining
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {unacquiredCerts.length > 0 && (
                <>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-orange-500" />
                      <h3 className="text-sm font-semibold text-slate-700">
                        Recommended
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {unacquiredCerts.map((cert, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between"
                        >
                          <span className="text-xs text-slate-700">{cert}</span>
                          <Plus className="w-3 h-3 text-orange-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Training */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Training Overview
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <p className="text-xl font-bold text-slate-700">
                    {trainingStats.total}
                  </p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">
                    {trainingStats.complete}
                  </p>
                  <p className="text-xs text-green-600">Complete</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">
                    {trainingStats.inProgress}
                  </p>
                  <p className="text-xs text-blue-600">In Progress</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-600">
                    {trainingStats.overdue}
                  </p>
                  <p className="text-xs text-red-600">Overdue</p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                {(["all", "assigned", "in-progress", "overdue"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setTrainingFilter(filter)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        trainingFilter === filter
                          ? "bg-orange-100 text-orange-700 font-medium"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {filter === "all"
                        ? "All"
                        : filter === "in-progress"
                        ? "In Progress"
                        : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {filteredTraining.length === 0 && trainingFilter !== "all" ? (
                <p className="text-center text-slate-500 py-8">
                  No training assignments found
                </p>
              ) : (
                <>
                  {filteredTraining.map((assignment) => {
                    const training = getTrainingById(assignment.trainingId);
                    const isExpanded = expandedTraining === assignment.id;

                    return (
                      <div
                        key={assignment.id}
                        className="border border-slate-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedTraining(
                              isExpanded ? null : assignment.id
                            )
                          }
                          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-slate-900">
                                {training?.title}
                              </h3>
                              <TrainingStatusBadge status={assignment.status} />
                            </div>
                            <p className="text-sm text-slate-500">
                              Due:{" "}
                              {format(
                                parseISO(assignment.dueDate),
                                "MMM d, yyyy"
                              )}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                            <div className="pt-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Assigned Date:
                                </span>
                                <span className="text-slate-700">
                                  {format(
                                    parseISO(assignment.assignedDate),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Due Date:
                                </span>
                                <span
                                  className={`${
                                    assignment.status === "overdue"
                                      ? "text-red-600 font-medium"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {format(
                                    parseISO(assignment.dueDate),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              {assignment.completedDate && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500">
                                    Completed Date:
                                  </span>
                                  <span className="text-green-600 font-medium">
                                    {format(
                                      parseISO(assignment.completedDate),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Duration:
                                </span>
                                <span className="text-slate-700">
                                  {training?.duration}
                                </span>
                              </div>
                              <div className="pt-2">
                                <Link
                                  href={`/training/${training?.id}`}
                                  className="text-orange-600 hover:text-orange-700 font-medium"
                                >
                                  View Training Module →
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {trainingFilter === "all" &&
                    recommendedTraining.length > 0 && (
                      <>
                        <div className="pt-3 border-t-2 border-orange-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-orange-500" />
                            <h3 className="text-base font-semibold text-slate-700">
                              Recommended Training
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {recommendedTraining.map((module) => (
                              <div
                                key={module.id}
                                className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 mb-1">
                                      {module.title}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                      Recommended for{" "}
                                      {module.department === "All"
                                        ? "all departments"
                                        : module.department}
                                    </p>
                                  </div>
                                  <Plus className="w-5 h-5 text-orange-600 shrink-0" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incident History */}
      {employee.incidentIds.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                Incident History
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {employee.incidentIds.map((incidentId) => {
                const incident = getIncidentById(incidentId);
                if (!incident) return null;

                return (
                  <Link
                    key={incident.id}
                    href={`/incidents/${incident.id}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
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
                      <span className="text-sm text-slate-500">
                        {incident.status}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900">
                      {incident.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {format(parseISO(incident.dateTime), "MMM d, yyyy")} •{" "}
                      {incident.location}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
