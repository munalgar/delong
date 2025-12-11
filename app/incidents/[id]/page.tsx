'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Users,
  Sparkles
} from 'lucide-react';
import { getIncidentById, getEmployeeById, getReportsByIncidentId } from '@/lib/mock-data';
import { format, parseISO } from 'date-fns';
import { Severity, IncidentStatus } from '@/lib/types';

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const styles = {
    Minor: 'bg-green-100 text-green-700',
    Moderate: 'bg-yellow-100 text-yellow-700',
    Severe: 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full ${styles[severity]}`}>
      <AlertTriangle className="w-4 h-4" />
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
    <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function IncidentDetailPage() {
  const params = useParams();
  const incident = getIncidentById(params.id as string);

  if (!incident) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Incident not found</p>
      </div>
    );
  }

  const involvedEmployees = incident.involvedEmployeeIds
    .map(id => getEmployeeById(id))
    .filter(Boolean);
  
  const reports = getReportsByIncidentId(incident.id);

  // Workflow steps
  const workflowSteps = [
    { status: 'Reported', completed: true },
    { status: 'Under Review', completed: incident.status === 'Under Review' || incident.status === 'Closed' },
    { status: 'Closed', completed: incident.status === 'Closed' }
  ];

  return (
    <div className="p-8">
      {/* Back button */}
      <Link href="/incidents" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Incidents
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-slate-900">{incident.title}</h1>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <p className="text-slate-600 max-w-3xl">{incident.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm mt-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{format(parseISO(incident.dateTime), 'MMMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{incident.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4" />
            <span>{incident.department}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <AlertTriangle className="w-4 h-4" />
            <span>{incident.type}</span>
          </div>
        </div>

        {/* Workflow */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-700 mb-3">Incident Workflow</p>
          <div className="flex items-center gap-4">
            {workflowSteps.map((step, index) => (
              <div key={step.status} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.completed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.status}
                </span>
                {index < workflowSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${step.completed ? 'bg-green-300' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Involved Employees */}
          {involvedEmployees.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Involved Employees</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {involvedEmployees.map(employee => employee && (
                  <Link
                    key={employee.id}
                    href={`/employees/${employee.id}`}
                    className="flex items-center p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium mr-4">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{employee.name}</h3>
                      <p className="text-sm text-slate-500">{employee.role} • {employee.department}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Documents & Photos */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">Documents & Photos</h2>
              </div>
            </div>
            <div className="p-6">
              {incident.photos.length === 0 && incident.documents.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No documents or photos attached</p>
              ) : (
                <div className="space-y-4">
                  {incident.photos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Photos</p>
                      <div className="grid grid-cols-3 gap-2">
                        {incident.photos.map((photo, index) => (
                          <div key={index} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {incident.documents.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Documents</p>
                      <div className="space-y-2">
                        {incident.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-700">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Report Actions */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">AI Reports</h2>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                <Sparkles className="w-4 h-4" />
                Generate Company Safety Report
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <FileText className="w-4 h-4" />
                Generate OSHA Compliance Report
              </button>
            </div>
          </div>

          {/* Related Reports */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">Related Reports</h2>
              </div>
            </div>
            <div className="p-4">
              {reports.length === 0 ? (
                <p className="text-slate-500 text-center py-4 text-sm">No reports generated yet</p>
              ) : (
                <div className="space-y-3">
                  {reports.map(report => (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="block p-3 border border-slate-200 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          report.type === 'OSHA' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {report.type}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          report.status === 'Approved' || report.status === 'Closed' ? 'bg-green-100 text-green-700' :
                          report.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                          report.status === 'Denied' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{report.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(parseISO(report.createdAt), 'MMM d, yyyy')}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {incident.status !== 'Closed' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {incident.status === 'Reported' && (
                  <button className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    Move to Under Review
                  </button>
                )}
                {incident.status === 'Under Review' && (
                  <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Close Incident
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
