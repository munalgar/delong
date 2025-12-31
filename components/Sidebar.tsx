"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  AlertTriangle,
  FileText,
  TrendingUp,
  MessageSquare,
  Shield,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/training", label: "Training", icon: GraduationCap },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/insights", label: "Insights", icon: TrendingUp },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function Sidebar() {
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
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isMinimized && (
            <div>
              <h1 className="text-lg font-bold">Delong Safety</h1>
              <p className="text-xs text-slate-400">Safety Management</p>
            </div>
          )}
        </Link>
      </div>

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
                      ? "bg-orange-500 text-white"
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

      {/* Switch to Employee View & Logout */}
      {!isMinimized && (
        <div className="p-4 border-t border-slate-700 space-y-2">
          <Link
            href="/employee/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            Switch to Employee View
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

      {/* Footer */}
      {!isMinimized && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center">
            <p>© 2024 Delong Safety</p>
            <p>Supervisor Portal</p>
          </div>
        </div>
      )}
    </aside>
  );
}
