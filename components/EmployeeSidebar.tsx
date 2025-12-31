"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Calendar,
  GraduationCap,
  Award,
  MessageSquare,
  Shield,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/report-incident", label: "Report Incident", icon: AlertTriangle },
  { href: "/employee/calendar", label: "Calendar", icon: Calendar },
  { href: "/employee/training", label: "My Training", icon: GraduationCap },
  { href: "/employee/certifications", label: "My Certifications", icon: Award },
  { href: "/employee/chat", label: "AI Chat", icon: MessageSquare },
];

export default function EmployeeSidebar() {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      className={`${
        isMinimized ? "w-20" : "w-64"
      } bg-slate-900 text-white fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 overflow-hidden`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/employee/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isMinimized && (
            <div>
              <h1 className="text-lg font-bold">Delong Safety</h1>
              <p className="text-xs text-slate-400">Employee Portal</p>
            </div>
          )}
        </Link>
      </div>

      {/* Current User */}
      {!isMinimized && (
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">John Martinez</p>
              <p className="text-xs text-slate-400">Grain Handling</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center ${
                    isMinimized ? "justify-center" : "gap-3"
                  } px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  title={isMinimized ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isMinimized && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Switch to Supervisor View & Logout */}
      {!isMinimized && (
        <div className="p-4 border-t border-slate-700 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Switch to Supervisor View
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      )}

      {/* Toggle Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isMinimized ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Minimize</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      {!isMinimized && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center">
            <p>© 2024 Delong Safety</p>
            <p>Employee Portal</p>
          </div>
        </div>
      )}
    </aside>
  );
}
