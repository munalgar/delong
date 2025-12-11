'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight, CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { employees } from '@/lib/mock-data';
import { Department, ComplianceStatus } from '@/lib/types';

const departments: Department[] = ['Grain Handling', 'Logistics', 'Maintenance', 'Agronomy', 'Admin'];
const complianceStatuses: { value: ComplianceStatus; label: string }[] = [
  { value: 'compliant', label: 'Compliant' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'non-compliant', label: 'Non-Compliant' }
];

const ComplianceIcon = ({ status }: { status: ComplianceStatus }) => {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'at-risk':
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'non-compliant':
      return <XCircle className="w-5 h-5 text-red-500" />;
  }
};

const ComplianceBadge = ({ status }: { status: ComplianceStatus }) => {
  const styles = {
    compliant: 'bg-green-100 text-green-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    'at-risk': 'bg-orange-100 text-orange-700',
    'non-compliant': 'bg-red-100 text-red-700'
  };
  
  const labels = {
    compliant: 'Compliant',
    'in-progress': 'In Progress',
    'at-risk': 'At Risk',
    'non-compliant': 'Non-Compliant'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ComplianceStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
      const matchesStatus = !selectedStatus || emp.complianceStatus === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, selectedDepartment, selectedStatus]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
        <p className="text-slate-600 mt-1">Manage employee safety profiles and compliance</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
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
            {(selectedDepartment || selectedStatus) && (
              <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                {(selectedDepartment ? 1 : 0) + (selectedStatus ? 1 : 0)}
              </span>
            )}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Compliance Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ComplianceStatus | '')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Statuses</option>
                {complianceStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            {(selectedDepartment || selectedStatus) && (
              <button
                onClick={() => {
                  setSelectedDepartment('');
                  setSelectedStatus('');
                }}
                className="self-end px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredEmployees.map(employee => (
            <Link
              key={employee.id}
              href={`/employees/${employee.id}`}
              className="flex items-center p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium text-lg mr-4">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-slate-900">{employee.name}</h3>
                  <ComplianceBadge status={employee.complianceStatus} />
                </div>
                <p className="text-sm text-slate-500">{employee.role}</p>
                <p className="text-sm text-slate-400">{employee.department}</p>
              </div>
              <div className="hidden md:flex items-center gap-6 mr-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900">{employee.certifications.length}</p>
                  <p className="text-xs text-slate-500">Certifications</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    {employee.trainingAssignments.filter(t => t.status === 'complete').length}/{employee.trainingAssignments.length}
                  </p>
                  <p className="text-xs text-slate-500">Training</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900">{employee.incidentIds.length}</p>
                  <p className="text-xs text-slate-500">Incidents</p>
                </div>
              </div>
              <ComplianceIcon status={employee.complianceStatus} />
              <ChevronRight className="w-5 h-5 text-slate-400 ml-2" />
            </Link>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No employees found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
