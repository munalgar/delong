'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight, Clock, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { trainingModules, employees } from '@/lib/mock-data';
import { format, parseISO } from 'date-fns';
import { Department } from '@/lib/types';

const departments: (Department | 'All')[] = ['All', 'Grain Handling', 'Logistics', 'Maintenance', 'Agronomy', 'Admin'];

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All' | ''>('');
  const [showOutdatedOnly, setShowOutdatedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredModules = useMemo(() => {
    return trainingModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || module.department === selectedDepartment;
      const matchesOutdated = !showOutdatedOnly || module.isOutdated;

      return matchesSearch && matchesDepartment && matchesOutdated;
    });
  }, [searchQuery, selectedDepartment, showOutdatedOnly]);

  // Get assignment stats for each module
  const getModuleStats = (moduleId: string) => {
    const assignments = employees.flatMap(e => 
      e.trainingAssignments.filter(t => t.trainingId === moduleId)
    );
    
    return {
      total: assignments.length,
      complete: assignments.filter(a => a.status === 'complete').length,
      inProgress: assignments.filter(a => a.status === 'in-progress' || a.status === 'at-risk').length,
      overdue: assignments.filter(a => a.status === 'overdue').length,
      notStarted: assignments.filter(a => a.status === 'not-started').length
    };
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Training Library</h1>
        <p className="text-slate-600 mt-1">Manage training modules and track employee progress</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search training modules..."
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
                onChange={(e) => setSelectedDepartment(e.target.value as Department | 'All' | '')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOutdatedOnly}
                  onChange={(e) => setShowOutdatedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-slate-700">Show outdated only</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{trainingModules.length}</p>
              <p className="text-sm text-slate-500">Total Modules</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{trainingModules.filter(m => !m.isOutdated).length}</p>
              <p className="text-sm text-slate-500">Up to Date</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{trainingModules.filter(m => m.isOutdated).length}</p>
              <p className="text-sm text-slate-500">Needs Update</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {employees.flatMap(e => e.trainingAssignments).filter(t => t.status !== 'complete').length}
              </p>
              <p className="text-sm text-slate-500">Pending Assignments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredModules.length} of {trainingModules.length} modules
      </p>

      {/* Module List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map(module => {
          const stats = getModuleStats(module.id);
          
          return (
            <Link
              key={module.id}
              href={`/training/${module.id}`}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{module.title}</h3>
                    {module.isOutdated && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                        Needs Update
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{module.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                  {module.department}
                </span>
                <span className="text-xs">v{module.version}</span>
              </div>

              {stats.total > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 mb-2">Assignment Status</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-slate-600">{stats.complete} Complete</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-slate-600">{stats.inProgress} In Progress</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs text-slate-600">{stats.overdue} Overdue</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-slate-400">
                Last updated: {format(parseISO(module.lastUpdated), 'MMM d, yyyy')}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-slate-500">No training modules found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
