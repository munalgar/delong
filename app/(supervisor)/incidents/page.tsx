"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronRight,
  Plus,
  AlertTriangle,
  Calendar,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { incidents, employees, getEmployeeById } from "@/lib/mock-data";
import { format, parseISO, isAfter, isBefore, isEqual } from "date-fns";
import {
  Department,
  Severity,
  IncidentStatus,
  IncidentType,
} from "@/lib/types";

const departments: Department[] = [
  "Grain Handling",
  "Logistics",
  "Maintenance",
  "Agronomy",
  "Admin",
];
const severities: Severity[] = ["Minor", "Moderate", "Severe", "Critical"];
const statuses: IncidentStatus[] = ["Reported", "Under Review", "Closed"];
const incidentTypes: IncidentType[] = [
  "Slip/Fall",
  "Equipment Malfunction",
  "Chemical Exposure",
  "Ergonomic Injury",
  "Fire/Explosion",
  "Vehicle Incident",
  "Other",
];

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const styles = {
    Minor: "bg-green-100 text-green-700",
    Moderate: "bg-yellow-100 text-yellow-700",
    Severe: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[severity]}`}
    >
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }: { status: IncidentStatus }) => {
  const styles = {
    Reported: "bg-blue-100 text-blue-700",
    "Under Review": "bg-amber-100 text-amber-700",
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

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    []
  );
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<IncidentStatus[]>(
    []
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);

  // New incident form state
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    type: "" as IncidentType | "",
    severity: "" as Severity | "",
    department: "" as Department | "",
    location: "",
    dateTime: "",
    involvedEmployeeIds: [] as string[],
  });

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(incident.department);
      const matchesSeverity =
        selectedSeverities.length === 0 ||
        selectedSeverities.includes(incident.severity);
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(incident.status);
      const matchesEmployee =
        selectedEmployees.length === 0 ||
        incident.involvedEmployeeIds.some((empId) =>
          selectedEmployees.includes(empId)
        );

      // Date range filter
      const incidentDate = parseISO(incident.dateTime);
      const matchesDateFrom =
        !dateFrom ||
        isAfter(incidentDate, parseISO(dateFrom)) ||
        isEqual(incidentDate, parseISO(dateFrom));
      const matchesDateTo =
        !dateTo ||
        isBefore(incidentDate, parseISO(dateTo)) ||
        isEqual(incidentDate, parseISO(dateTo));

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSeverity &&
        matchesStatus &&
        matchesEmployee &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [
    searchQuery,
    selectedDepartments,
    selectedSeverities,
    selectedStatuses,
    selectedEmployees,
    dateFrom,
    dateTo,
  ]);

  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  const stats = {
    total: incidents.length,
    reported: incidents.filter((i) => i.status === "Reported").length,
    underReview: incidents.filter((i) => i.status === "Under Review").length,
    closed: incidents.filter((i) => i.status === "Closed").length,
  };

  const handleSubmitNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add logic to save the new incident
    console.log("New incident submitted:", newIncident);

    // Reset form and close modal
    setNewIncident({
      title: "",
      description: "",
      type: "",
      severity: "",
      department: "",
      location: "",
      dateTime: "",
      involvedEmployeeIds: [],
    });
    setShowNewIncidentModal(false);

    // In a real app, you would add this to the backend and refresh the list
    alert("Incident reported successfully!");
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setNewIncident((prev) => ({
      ...prev,
      involvedEmployeeIds: prev.involvedEmployeeIds.includes(employeeId)
        ? prev.involvedEmployeeIds.filter((id) => id !== employeeId)
        : [...prev.involvedEmployeeIds, employeeId],
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incidents</h1>
          <p className="text-slate-600 mt-1">
            Track and manage safety incidents
          </p>
        </div>
        <button
          onClick={() => setShowNewIncidentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Incidents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.reported}
              </p>
              <p className="text-sm text-slate-500">Reported</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.underReview}
              </p>
              <p className="text-sm text-slate-500">Under Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.closed}
              </p>
              <p className="text-sm text-slate-500">Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
            <input
              type="text"
              placeholder="Search incidents..."
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
          <div className="px-4 pb-4 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Severity
                </label>
                <div className="space-y-2">
                  {severities.map((severity) => (
                    <label
                      key={severity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSeverities.includes(severity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSeverities([
                              ...selectedSeverities,
                              severity,
                            ]);
                          } else {
                            setSelectedSeverities(
                              selectedSeverities.filter((s) => s !== severity)
                            );
                          }
                        }}
                        className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700">{severity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <label
                      key={dept}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments([
                              ...selectedDepartments,
                              dept,
                            ]);
                          } else {
                            setSelectedDepartments(
                              selectedDepartments.filter((d) => d !== dept)
                            );
                          }
                        }}
                        className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStatuses([...selectedStatuses, status]);
                          } else {
                            setSelectedStatuses(
                              selectedStatuses.filter((s) => s !== status)
                            );
                          }
                        }}
                        className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  title="Filter incidents from date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  title="Filter incidents to date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>

              {/* Involved Employees Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Involved Employees
                </label>
                <div className="space-y-2 max-h-28 overflow-y-auto">
                  {employees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmployees([
                              ...selectedEmployees,
                              emp.id,
                            ]);
                          } else {
                            setSelectedEmployees(
                              selectedEmployees.filter((id) => id !== emp.id)
                            );
                          }
                        }}
                        className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700">{emp.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display & Clear */}
            {(selectedDepartments.length > 0 ||
              selectedSeverities.length > 0 ||
              selectedStatuses.length > 0 ||
              selectedEmployees.length > 0 ||
              dateFrom ||
              dateTo) && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-700">
                  Active Filters:
                </span>

                {selectedSeverities.map((severity) => (
                  <span
                    key={severity}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                  >
                    {severity}
                    <button
                      onClick={() =>
                        setSelectedSeverities(
                          selectedSeverities.filter((s) => s !== severity)
                        )
                      }
                      className="hover:bg-orange-200 rounded-full"
                      title={`Remove ${severity} filter`}
                      aria-label={`Remove ${severity} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedDepartments.map((dept) => (
                  <span
                    key={dept}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {dept}
                    <button
                      onClick={() =>
                        setSelectedDepartments(
                          selectedDepartments.filter((d) => d !== dept)
                        )
                      }
                      className="hover:bg-blue-200 rounded-full"
                      title={`Remove ${dept} filter`}
                      aria-label={`Remove ${dept} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedStatuses.map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {status}
                    <button
                      onClick={() =>
                        setSelectedStatuses(
                          selectedStatuses.filter((s) => s !== status)
                        )
                      }
                      className="hover:bg-purple-200 rounded-full"
                      title={`Remove ${status} filter`}
                      aria-label={`Remove ${status} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedEmployees.map((empId) => {
                  const emp = getEmployeeById(empId);
                  return emp ? (
                    <span
                      key={empId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {emp.name}
                      <button
                        onClick={() =>
                          setSelectedEmployees(
                            selectedEmployees.filter((id) => id !== empId)
                          )
                        }
                        className="hover:bg-green-200 rounded-full"
                        title={`Remove ${emp.name} filter`}
                        aria-label={`Remove ${emp.name} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}

                {dateFrom && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                    From: {format(parseISO(dateFrom), "MMM d, yyyy")}
                    <button
                      onClick={() => setDateFrom("")}
                      className="hover:bg-slate-200 rounded-full"
                      title="Remove date from filter"
                      aria-label="Remove date from filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {dateTo && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                    To: {format(parseISO(dateTo), "MMM d, yyyy")}
                    <button
                      onClick={() => setDateTo("")}
                      className="hover:bg-slate-200 rounded-full"
                      title="Remove date to filter"
                      aria-label="Remove date to filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={() => {
                    setSelectedDepartments([]);
                    setSelectedSeverities([]);
                    setSelectedStatuses([]);
                    setSelectedEmployees([]);
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {sortedIncidents.length} of {incidents.length} incidents
      </p>

      {/* Incident List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {sortedIncidents.map((incident) => {
            const involvedEmployees = incident.involvedEmployeeIds
              .map((id) => getEmployeeById(id))
              .filter(Boolean);

            return (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="block p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {incident.title}
                      </h3>
                      <SeverityBadge severity={incident.severity} />
                      <StatusBadge status={incident.status} />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {incident.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(parseISO(incident.dateTime), "MMM d, yyyy h:mm a")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {incident.location}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                    {incident.department}
                  </span>
                  {involvedEmployees.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {involvedEmployees.length} involved
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {sortedIncidents.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">
              No incidents found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* New Incident Modal */}
      {showNewIncidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Report New Incident
              </h2>
              <button
                onClick={() => setShowNewIncidentModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewIncident} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="incident-title"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Incident Title *
                </label>
                <input
                  id="incident-title"
                  type="text"
                  required
                  value={newIncident.title}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  placeholder="Brief description of the incident"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="incident-description"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="incident-description"
                  required
                  value={newIncident.description}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  placeholder="Detailed description of what happened..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Incident Type */}
                <div>
                  <label
                    htmlFor="incident-type"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Incident Type *
                  </label>
                  <select
                    id="incident-type"
                    required
                    value={newIncident.type}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        type: e.target.value as IncidentType,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  >
                    <option value="">Select type...</option>
                    {incidentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label
                    htmlFor="incident-severity"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Severity *
                  </label>
                  <select
                    id="incident-severity"
                    required
                    value={newIncident.severity}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        severity: e.target.value as Severity,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  >
                    <option value="">Select severity...</option>
                    {severities.map((severity) => (
                      <option key={severity} value={severity}>
                        {severity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="incident-department"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Department *
                  </label>
                  <select
                    id="incident-department"
                    required
                    value={newIncident.department}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        department: e.target.value as Department,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  >
                    <option value="">Select department...</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="incident-location"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Location *
                  </label>
                  <input
                    id="incident-location"
                    type="text"
                    required
                    value={newIncident.location}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                    placeholder="Building, area, or equipment"
                  />
                </div>

                {/* Date and Time */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="incident-datetime"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Date and Time *
                  </label>
                  <input
                    id="incident-datetime"
                    type="datetime-local"
                    required
                    value={newIncident.dateTime}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        dateTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Involved Employees */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Involved Employees
                </label>
                <div className="border border-slate-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {employees.map((emp) => (
                      <label
                        key={emp.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={newIncident.involvedEmployeeIds.includes(
                            emp.id
                          )}
                          onChange={() => toggleEmployeeSelection(emp.id)}
                          className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-700">
                          {emp.name} - {emp.department}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {newIncident.involvedEmployeeIds.length} employee(s) selected
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Report Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
