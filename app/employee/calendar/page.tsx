"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";
import { employees, trainingModules } from "@/lib/mock-data";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";

// Simulate logged-in employee (John Martinez)
const currentEmployee = employees.find((e) => e.id === "emp-001")!;

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: "training-due" | "certification-expiring" | "certification-expired";
  status: string;
  link: string;
  details?: string;
};

export default function EmployeeCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar events for current employee
  const myEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Training due dates
    currentEmployee.trainingAssignments.forEach((assignment) => {
      const dueDate = parseISO(assignment.dueDate);
      const training = trainingModules.find((t) => t.id === assignment.trainingId);

      events.push({
        id: `training-${assignment.id}`,
        title: training?.title || "Training",
        date: dueDate,
        type: "training-due",
        status: assignment.status,
        link: "/employee/training",
        details: `Due: ${format(dueDate, "MMM d, yyyy")} - Status: ${assignment.status}`,
      });
    });

    // Certification expiration dates
    currentEmployee.certifications.forEach((cert) => {
      const expirationDate = parseISO(cert.expirationDate);

      events.push({
        id: `cert-${cert.id}`,
        title: cert.name,
        date: expirationDate,
        type: cert.status === "expired" ? "certification-expired" : "certification-expiring",
        status: cert.status,
        link: "/employee/certifications",
        details: `${cert.status === "expired" ? "Expired" : "Expires"}: ${format(
          expirationDate,
          "MMM d, yyyy"
        )}`,
      });
    });

    return events;
  }, []);

  // Get calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return myEvents.filter((event) => isSameDay(event.date, day));
  };

  // Navigate months
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get color classes for event type
  const getEventColorClass = (type: string, status: string) => {
    if (type === "training-due") {
      if (status === "complete") return "bg-green-100 text-green-700 border-green-200";
      if (status === "overdue") return "bg-red-100 text-red-700 border-red-200";
      if (status === "at-risk") return "bg-amber-100 text-amber-700 border-amber-200";
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (type === "certification-expired") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (type === "certification-expiring") {
      if (status === "expiring-soon") return "bg-amber-100 text-amber-700 border-amber-200";
      return "bg-green-100 text-green-700 border-green-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getEventIcon = (type: string, status: string) => {
    if (type === "training-due") {
      if (status === "complete") return CheckCircle;
      return BookOpen;
    }
    if (type.includes("certification")) {
      if (status === "expired") return AlertCircle;
      if (status === "expiring-soon") return Clock;
      return Award;
    }
    return Clock;
  };

  // Selected day events
  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  // Upcoming events
  const upcomingEvents = myEvents
    .filter((e) => e.date >= new Date() && e.status !== "complete")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Calendar</h1>
        <p className="text-slate-600 mt-1">
          Track your training deadlines and certification expirations
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-semibold text-slate-900 min-w-[200px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Training Due</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-600">Completed/Valid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-slate-600">At Risk/Expiring Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-600">Overdue/Expired</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-semibold text-slate-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isDayToday = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[120px] p-2 border-b border-r border-slate-200 cursor-pointer transition-colors ${
                      !isCurrentMonth
                        ? "bg-slate-50"
                        : "bg-white hover:bg-slate-50"
                    } ${isSelected ? "bg-emerald-50" : ""}`}
                  >
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isDayToday
                          ? "w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center"
                          : isCurrentMonth
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const Icon = getEventIcon(event.type, event.status);
                        return (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded border truncate ${getEventColorClass(
                              event.type,
                              event.status
                            )}`}
                            title={event.title}
                          >
                            <div className="flex items-center gap-1">
                              <Icon className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{event.title}</span>
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-slate-500 px-2">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "Select a date"}
            </h3>

            {selectedDate && selectedDayEvents.length === 0 && (
              <p className="text-slate-500 text-sm">No events on this date.</p>
            )}

            {selectedDate && selectedDayEvents.length > 0 && (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {selectedDayEvents.map((event) => {
                  const Icon = getEventIcon(event.type, event.status);
                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${getEventColorClass(
                        event.type,
                        event.status
                      )}`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          {event.details && (
                            <p className="text-xs mt-1 opacity-75">
                              {event.details}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link
                        href={event.link}
                        className="text-xs font-medium hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {!selectedDate && (
              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Upcoming Deadlines
                  </p>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No upcoming deadlines!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {upcomingEvents.map((event) => {
                        const Icon = getEventIcon(event.type, event.status);
                        return (
                          <div
                            key={event.id}
                            className={`p-2 rounded border text-xs ${getEventColorClass(
                              event.type,
                              event.status
                            )}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">
                                {format(event.date, "MMM d")}
                              </span>
                            </div>
                            <p className="truncate">{event.title}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
