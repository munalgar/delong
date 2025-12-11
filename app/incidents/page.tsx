'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight, Plus, AlertTriangle, Calendar, MapPin, Users } from 'lucide-react';
import { incidents, employees, getEmployeeById } from '@/lib/mock-data';
import { format, parseISO } from 'date-fns';
import { Department, Severity, IncidentStatus } from '@/lib/types';

const departments: Department[] = ['Grain Handling', 'Logistics', 'Maintenance', 'Agronomy', 'Admin'];
const severities: Severity[] = ['Minor', 'Moderate', 'Severe', 'Critical'];
const statuses: IncidentStatus[] = ['Reported', 'Under Review', 'Closed'];

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const styles = {
    Minor: 'bg-green-100 text-green-700',
    Moderate: 'bg-yellow-100 text-yellow-700',
    Severe: 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }: { status: IncidentStatus }) => {
  const styles = {
    Reported: 'bg-blue-100 text-blue-700',
    'Under Review': 'bg-amber-100 text-amber-700',
    Closed: 'bg-slate-100 text-slate-700'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || incident.department === selectedDepartment;
      const matchesSeverity = !selectedSeverity || incident.severity === selectedSeverity;
      const matchesStatus = !selectedStatus || incident.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesSeverity && matchesStatus;
    });
  }, [searchQuery, selectedDepartment, selectedSeverity, selectedStatus]);

  const sortedIncidents = [...filteredIncidents].sort((a, b) => 
    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  const stats = {
    total: incidents.length,
    reported: incidents.filter(i => i.status === 'Reported').length,
    underReview: incidents.filter(i => i.status === 'Under Review').length,
    closed: incidents.filter(i => i.status === 'Closed').length
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incidents</h1>
          <p className="text-slate-600 mt-1">Track and manage safety incidents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
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
              <p className="text-2xl font-bold text-slate-900">{stats.reported}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.underReview}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.closed}</p>
              <p className="text-sm text-slate-500">Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="px-4 pb-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value as Department | '')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as Severity | '')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Severities</option>
                {severities.map(sev => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as IncidentStatus | '')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
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
          {sortedIncidents.map(incident => {
            const involvedEmployees = incident.involvedEmployeeIds.map(id => getEmployeeById(id)).filter(Boolean);
            
            return (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="block p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{incident.title}</h3>
                      <SeverityBadge severity={incident.severity} />
                      <StatusBadge status={incident.status} />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{incident.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(parseISO(incident.dateTime), 'MMM d, yyyy h:mm a')}
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
            <p className="text-slate-500">No incidents found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
