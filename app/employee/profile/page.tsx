"use client";

import Link from "next/link";
import { currentEmployee } from "@/lib/mock-data";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
  Shield,
  Settings,
  CheckCircle,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const employee = currentEmployee;

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "at-risk":
        return "bg-orange-100 text-orange-700";
      case "non-compliant":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">
            View your profile information and account details
          </p>
        </div>
        <Link
          href="/employee/settings"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Edit in Settings
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {employee.name}
            </h2>
            <p className="text-lg text-slate-600">{employee.role}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-slate-500">
                {employee.department} Department
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(
                  employee.complianceStatus
                )}`}
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                {employee.complianceStatus.charAt(0).toUpperCase() +
                  employee.complianceStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-slate-900 font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="text-slate-900 font-medium">{employee.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Employment Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Employee ID</p>
                <p className="text-slate-900 font-medium">{employee.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Hire Date</p>
                <p className="text-slate-900 font-medium">
                  {new Date(employee.hireDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Login</p>
                <p className="text-slate-900 font-medium">
                  {new Date(employee.lastLogin).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Supervisor</p>
                <p className="text-slate-900 font-medium">Sarah Johnson</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Compliance Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Current Status</p>
                <p className="text-slate-900 font-medium capitalize">
                  {employee.complianceStatus}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/employee/certifications"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View My Certifications →
              </Link>
            </div>
            <div>
              <Link
                href="/employee/training"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View My Training →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
