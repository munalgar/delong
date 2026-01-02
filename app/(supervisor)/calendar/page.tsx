"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  FileWarning,
  Filter,
} from "lucide-react";
import { employees, incidents, trainingModules } from "@/lib/mock-data";
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
} from "date-fns";
import { Incident } from "@/lib/types";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type:
    | "training-due"
    | "certification-expiring"
    | "certification-expired"
    | "incident";
  severity: "low" | "medium" | "high";
  link?: string;
  details?: string;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "training-due",
    "certification-expiring",
    "certification-expired",
    "incident",
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Generate all calendar events
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Training due dates
    employees.forEach((employee) => {
      employee.trainingAssignments.forEach((assignment) => {
        if (assignment.status !== "complete") {
          const dueDate = parseISO(assignment.dueDate);
          const training = trainingModules.find(
            (t) => t.id === assignment.trainingId
          );

          events.push({
            id: `training-${assignment.id}`,
            title: `${employee.name}: ${training?.title || "Training"}`,
            date: dueDate,
            type: "training-due",
            severity:
              assignment.status === "overdue"
                ? "high"
                : assignment.status === "at-risk"
                ? "medium"
                : "low",
            link: `/employees/${employee.id}`,
            details: `Due: ${format(dueDate, "MMM d, yyyy")}`,
          });
        }
      });
    });

    // Certification expiration dates
    employees.forEach((employee) => {
      employee.certifications.forEach((cert) => {
        const expirationDate = parseISO(cert.expirationDate);

        events.push({
          id: `cert-${cert.id}`,
          title: `${employee.name}: ${cert.name}`,
          date: expirationDate,
          type:
            cert.status === "expired"
              ? "certification-expired"
              : "certification-expiring",
          severity:
            cert.status === "expired"
              ? "high"
              : cert.status === "expiring-soon"
              ? "medium"
              : "low",
          link: `/employees/${employee.id}`,
          details: `${
            cert.status === "expired" ? "Expired" : "Expires"
          }: ${format(expirationDate, "MMM d, yyyy")}`,
        });
      });
    });

    // Incidents
    incidents.forEach((incident) => {
      const incidentDate = parseISO(incident.dateTime);

      events.push({
        id: `incident-${incident.id}`,
        title: incident.title,
        date: incidentDate,
        type: "incident",
        severity:
          incident.severity === "Critical" || incident.severity === "Severe"
            ? "high"
            : incident.severity === "Moderate"
            ? "medium"
            : "low",
        link: `/incidents/${incident.id}`,
        details: `${incident.type} - ${incident.severity}`,
      });
    });

    return events;
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => selectedFilters.includes(event.type));
  }, [allEvents, selectedFilters]);

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
    return filteredEvents.filter((event) => isSameDay(event.date, day));
  };

  // Navigate months
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Toggle filter
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Get color classes for event type
  const getEventColorClass = (type: string, severity: string) => {
    switch (type) {
      case "training-due":
        return severity === "high"
          ? "bg-red-100 text-red-700 border-red-200"
          : severity === "medium"
          ? "bg-orange-100 text-orange-700 border-orange-200"
          : "bg-blue-100 text-blue-700 border-blue-200";
      case "certification-expiring":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "certification-expired":
        return "bg-red-100 text-red-700 border-red-200";
      case "incident":
        return severity === "high"
          ? "bg-purple-100 text-purple-700 border-purple-200"
          : severity === "medium"
          ? "bg-purple-50 text-purple-600 border-purple-100"
          : "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "training-due":
        return BookOpen;
      case "certification-expiring":
        return Clock;
      case "certification-expired":
        return AlertCircle;
      case "incident":
        return FileWarning;
      default:
        return CheckCircle;
    }
  };

  // Selected day events
  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
        <p className="text-slate-600 mt-1">
          Track training deadlines, certifications, and incidents
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Month Navigation */}
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            Navigate to Current Month
          </button>
          <div className="flex items-center gap-4 mx-auto">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-semibold text-slate-900 min-w-[200px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Filter Toggle */}
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

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Show events:
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toggleFilter("training-due")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedFilters.includes("training-due")
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Training Due</span>
              </button>
              <button
                onClick={() => toggleFilter("certification-expiring")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedFilters.includes("certification-expiring")
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">Cert. Expiring</span>
              </button>
              <button
                onClick={() => toggleFilter("certification-expired")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedFilters.includes("certification-expired")
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Cert. Expired</span>
              </button>
              <button
                onClick={() => toggleFilter("incident")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedFilters.includes("incident")
                    ? "bg-purple-50 border-purple-200 text-purple-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileWarning className="w-4 h-4" />
                <span className="text-sm">Incidents</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Legend:</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Training Due</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-slate-600">
              Certification Expiring/At Risk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-600">
              Cerification Overdue/Expired
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-slate-600">Incidents</span>
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
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[120px] p-2 border-b border-r border-slate-200 cursor-pointer transition-colors ${
                      !isCurrentMonth
                        ? "bg-slate-50"
                        : "bg-white hover:bg-slate-50"
                    } ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isToday
                          ? "w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center"
                          : isCurrentMonth
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const Icon = getEventIcon(event.type);
                        return (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded border truncate ${getEventColorClass(
                              event.type,
                              event.severity
                            )}`}
                            title={event.title}
                          >
                            <div className="flex items-center gap-1">
                              <Icon className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                {event.title.split(":")[0]}
                              </span>
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
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedDayEvents.map((event) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${getEventColorClass(
                        event.type,
                        event.severity
                      )}`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {event.title}
                          </p>
                          {event.details && (
                            <p className="text-xs mt-1 opacity-75">
                              {event.details}
                            </p>
                          )}
                        </div>
                      </div>
                      {event.link && (
                        <a
                          href={event.link}
                          className="text-xs font-medium hover:underline"
                        >
                          View Details →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!selectedDate && (
              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Upcoming Events
                  </p>
                  <div className="space-y-2">
                    {filteredEvents
                      .filter((e) => e.date >= new Date())
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .slice(0, 5)
                      .map((event) => {
                        const Icon = getEventIcon(event.type);
                        return (
                          <div
                            key={event.id}
                            className={`p-2 rounded border text-xs ${getEventColorClass(
                              event.type,
                              event.severity
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
