'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { getReportById, getIncidentById } from '@/lib/mock-data';
import { format, parseISO } from 'date-fns';
import { ReportType, ReportStatus } from '@/lib/types';

const TypeBadge = ({ type }: { type: ReportType }) => {
  const styles = {
    'Company Safety': 'bg-orange-100 text-orange-700',
    'OSHA': 'bg-blue-100 text-blue-700'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full ${styles[type]}`}>
      <FileText className="w-4 h-4" />
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles = {
    Draft: 'bg-slate-100 text-slate-700',
    'Under Review': 'bg-amber-100 text-amber-700',
    Approved: 'bg-green-100 text-green-700',
    Denied: 'bg-red-100 text-red-700',
    Closed: 'bg-slate-100 text-slate-700'
  };

  return (
    <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function ReportDetailPage() {
  const params = useParams();
  const report = getReportById(params.id as string);

  if (!report) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Report not found</p>
      </div>
    );
  }

  const incident = getIncidentById(report.incidentId);
  const canEdit = report.status === 'Under Review' || report.status === 'Draft';
  const canApprove = report.status === 'Under Review';
  const canReopen = report.status === 'Closed' || report.status === 'Denied';

  return (
    <div className="p-8">
      {/* Back button */}
      <Link href="/reports" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-slate-900">{report.title}</h1>
              <TypeBadge type={report.type} />
              <StatusBadge status={report.status} />
            </div>
            {incident && (
              <Link 
                href={`/incidents/${incident.id}`}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Related Incident: {incident.title} →
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 mt-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Created: {format(parseISO(report.createdAt), 'MMMM d, yyyy h:mm a')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Report Content</h2>
              {canEdit && (
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            <div className="p-6">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-line text-slate-700">
                  {report.content.split('\n').map((line, index) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-lg font-semibold text-slate-900 mt-6 mb-2">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="font-semibold text-slate-800">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
                    }
                    if (line.trim() === '') {
                      return <br key={index} />;
                    }
                    return <p key={index}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {canApprove && (
                <>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Approve Report
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <XCircle className="w-4 h-4" />
                    Deny Report
                  </button>
                </>
              )}
              {report.status === 'Approved' && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Close Report
                </button>
              )}
              {canReopen && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  Reopen Report
                </button>
              )}
              {report.status === 'Draft' && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                  Submit for Review
                </button>
              )}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900">Audit Trail</h2>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {report.auditTrail.map((entry, index) => (
                  <div key={index} className="relative pl-6 pb-4 last:pb-0">
                    {index !== report.auditTrail.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-slate-200" />
                    )}
                    <div className="absolute left-0 top-1 w-[18px] h-[18px] rounded-full bg-orange-100 border-2 border-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                      <p className="text-xs text-slate-500">{entry.user}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(parseISO(entry.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                      {entry.details && (
                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                          {entry.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
