"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, User, ArrowRight } from "lucide-react";
import { employees } from "@/lib/mock-data";

// Get unique employees for selection
const supervisorEmployees = employees.filter(
  (e) =>
    e.role.includes("Supervisor") ||
    e.role.includes("Coordinator") ||
    e.role.includes("Lead")
);
const regularEmployees = employees.filter(
  (e) =>
    !e.role.includes("Supervisor") &&
    !e.role.includes("Coordinator") &&
    !e.role.includes("Lead")
);

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "supervisor" | "employee" | null
  >(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (!selectedRole) return;

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (selectedRole === "supervisor") {
        router.push("/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
    }, 500);
  };

  const employeeList =
    selectedRole === "supervisor" ? supervisorEmployees : regularEmployees;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
            <Image
              src="/delong-logo.svg"
              alt="Delong Safety"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Delong Safety</h1>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Sign in to your account
          </h2>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSelectedRole("supervisor");
                  setSelectedEmployee("");
                }}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "supervisor"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                    selectedRole === "supervisor"
                      ? "bg-orange-100"
                      : "bg-slate-100"
                  }`}
                >
                  <Users
                    className={`w-6 h-6 ${
                      selectedRole === "supervisor"
                        ? "text-orange-600"
                        : "text-slate-600"
                    }`}
                  />
                </div>
                <p
                  className={`font-medium ${
                    selectedRole === "supervisor"
                      ? "text-orange-700"
                      : "text-slate-700"
                  }`}
                >
                  Supervisor
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Manage team safety
                </p>
                {selectedRole === "supervisor" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setSelectedRole("employee");
                  setSelectedEmployee("");
                }}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "employee"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                    selectedRole === "employee"
                      ? "bg-emerald-100"
                      : "bg-slate-100"
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${
                      selectedRole === "employee"
                        ? "text-emerald-600"
                        : "text-slate-600"
                    }`}
                  />
                </div>
                <p
                  className={`font-medium ${
                    selectedRole === "employee"
                      ? "text-emerald-700"
                      : "text-slate-700"
                  }`}
                >
                  Employee
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Personal safety portal
                </p>
                {selectedRole === "employee" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Employee Selection (shown after role is selected) */}
          {selectedRole && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select user
              </label>
              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg  focus:border-transparent appearance-none text-slate-900 bg-white"
                >
                  <option value="">Choose a user...</option>
                  {employeeList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={!selectedRole || !selectedEmployee || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              selectedRole && selectedEmployee && !isLoading
                ? selectedRole === "supervisor"
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
