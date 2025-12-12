"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  BookOpen,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  incidentTrendData,
  departmentComplianceData,
  incidentDistribution,
  employees,
  incidents,
  trainingModules,
  getAtRiskEmployees,
  getExpiringCertifications,
} from "@/lib/mock-data";

export default function InsightsPage() {
  const [trendTimeRange, setTrendTimeRange] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [showPredictions, setShowPredictions] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [certLookahead, setCertLookahead] = useState(30);
  const [visibleDepartments, setVisibleDepartments] = useState<string[]>([
    "Grain Handling",
    "Logistics",
    "Maintenance",
    "Agronomy",
    "Admin",
  ]);

  const atRiskEmployees = getAtRiskEmployees();
  const expiringCerts = getExpiringCertifications(certLookahead);

  // Calculate overall compliance
  const totalEmployees = employees.length;
  const compliantEmployees = employees.filter(
    (e) => e.complianceStatus === "compliant"
  ).length;
  const overallCompliance = Math.round(
    (compliantEmployees / totalEmployees) * 100
  );

  // Predictive data (extended trend lines)
  const predictiveTrendData = showPredictions
    ? [
        ...incidentTrendData,
        { date: "2025-01", incidents: 2, compliance: 80, predicted: true },
        { date: "2025-02", incidents: 2, compliance: 81, predicted: true },
        { date: "2025-03", incidents: 1, compliance: 82, predicted: true },
      ]
    : incidentTrendData;

  // High-risk departments
  const departmentIncidents = incidents.reduce((acc, inc) => {
    acc[inc.department] = (acc[inc.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDepartments = Object.entries(departmentIncidents).sort(
    (a, b) => b[1] - a[1]
  );

  // High-risk training modules
  const trainingIncidentLinks = trainingModules
    .map((module) => {
      const relatedIncidents = incidents.filter((inc) => {
        // Simple heuristic: same department or keywords match
        return (
          inc.department === module.department ||
          inc.description
            .toLowerCase()
            .includes(module.title.toLowerCase().split(" ")[0])
        );
      });
      return { module, incidentCount: relatedIncidents.length };
    })
    .sort((a, b) => b.incidentCount - a.incidentCount);

  const toggleDepartment = (dept: string) => {
    setVisibleDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const departmentColors: Record<string, string> = {
    "Grain Handling": "#ef4444",
    Logistics: "#f97316",
    Maintenance: "#22c55e",
    Agronomy: "#3b82f6",
    Admin: "#8b5cf6",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Insights</h1>
        <p className="text-slate-600 mt-1">
          Analytics, trends, and safety predictions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Overall Compliance</span>
            {overallCompliance >= 80 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {overallCompliance}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {compliantEmployees} of {totalEmployees} employees
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">
              Total Incidents (YTD)
            </span>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {incidentTrendData.reduce((sum, d) => sum + d.incidents, 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across all departments</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">At-Risk Employees</span>
            <Users className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {atRiskEmployees.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Need immediate attention
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">
              Expiring Certs ({certLookahead}d)
            </span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {expiringCerts.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Within {certLookahead} days
          </p>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Incidents & Compliance Over Time */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Incidents & Compliance Trends
              </h2>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showPredictions}
                    onChange={(e) => setShowPredictions(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-slate-900">Show Predictions</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictiveTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="left" stroke="#ef4444" fontSize={12} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#22c55e"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="incidents"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444" }}
                  name="Incidents"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="compliance"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                  name="Compliance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Compliance */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Department Compliance
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.keys(departmentColors).map((dept) => (
                <button
                  key={dept}
                  onClick={() => toggleDepartment(dept)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    visibleDepartments.includes(dept)
                      ? "text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                  style={
                    visibleDepartments.includes(dept)
                      ? { backgroundColor: departmentColors[dept] }
                      : {}
                  }
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={departmentComplianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Legend />
                {visibleDepartments.map((dept) => (
                  <Line
                    key={dept}
                    type="monotone"
                    dataKey={dept}
                    stroke={departmentColors[dept]}
                    strokeWidth={2}
                    dot={{ fill: departmentColors[dept] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Incident Distribution */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Incident Distribution
              </h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType("pie")}
                  className={`px-2 py-1 text-xs rounded ${
                    chartType === "pie"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-900"
                  }`}
                >
                  Pie
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-2 py-1 text-xs rounded ${
                    chartType === "bar"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-900"
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={incidentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {incidentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <BarChart data={incidentDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    fontSize={10}
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* High-Risk Departments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                High-Risk Departments
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {sortedDepartments.map(([dept, count], index) => (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {dept}
                    </span>
                    <span className="text-sm text-slate-500">
                      {count} incidents
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? "bg-red-500"
                          : index === 1
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                      style={{
                        width: `${(count / sortedDepartments[0][1]) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* At-Risk Employees */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                At-Risk Employees
              </h2>
            </div>
          </div>
          <div className="p-4 max-h-[280px] overflow-y-auto">
            {atRiskEmployees.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No at-risk employees
              </p>
            ) : (
              <div className="space-y-3">
                {atRiskEmployees.map((emp) => (
                  <Link
                    key={emp.id}
                    href={`/employees/${emp.id}`}
                    className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-medium text-sm mr-3">
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {emp.name}
                      </p>
                      <p className="text-xs text-slate-500">{emp.department}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certification Calendar & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certification Expiration */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Certification Expirations
                </h2>
              </div>
              <select
                value={certLookahead}
                onChange={(e) => setCertLookahead(Number(e.target.value))}
                className="text-sm border border-slate-200 rounded-lg px-2 py-1 text-slate-900"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>365 days</option>
              </select>
            </div>
          </div>
          <div className="p-4 max-h-[300px] overflow-y-auto">
            {expiringCerts.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No certifications expiring within {certLookahead} days
              </p>
            ) : (
              <div className="space-y-3">
                {expiringCerts.map(({ employee, certification }) => (
                  <Link
                    key={`${employee.id}-${certification.id}`}
                    href={`/employees/${employee.id}`}
                    className="block p-3 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 text-sm">
                        {certification.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          certification.status === "expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {certification.status === "expired"
                          ? "Expired"
                          : "Expiring Soon"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{employee.name}</p>
                    <p className="text-xs text-slate-500">
                      Expires: {certification.expirationDate}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                AI Recommendations
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Grain Handling Training Gap
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Based on recent incidents, consider assigning "Grain Bin
                      Entry Safety" training to all Grain Handling employees. 2
                      incidents in the past month involved protocol violations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      PPE Compliance Improvement
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Chemical exposure incidents suggest PPE training refresher
                      would be beneficial for Agronomy department.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Seasonal Pattern Alert
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Historical data suggests incident rates increase 23% in
                      Q4. Consider proactive safety reminders and additional
                      training sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
