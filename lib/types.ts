// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  role: string;
  hireDate: string;
  certifications: Certification[];
  trainingAssignments: TrainingAssignment[];
  incidentIds: string[];
  complianceStatus: ComplianceStatus;
}

export type Department =
  | "Grain Handling"
  | "Logistics"
  | "Maintenance"
  | "Agronomy"
  | "Admin";

export type ComplianceStatus =
  | "compliant"
  | "in-progress"
  | "at-risk"
  | "non-compliant";

// Certification Types
export interface Certification {
  id: string;
  name: string;
  issuedDate: string;
  expirationDate: string;
  status: CertificationStatus;
}

export type CertificationStatus = "valid" | "expiring-soon" | "expired";

// Training Types
export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  department: Department | "All";
  createdDate: string;
  lastUpdated: string;
  isOutdated: boolean;
  version: string;
}

export interface TrainingAssignment {
  id: string;
  trainingId: string;
  employeeId: string;
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  status: TrainingStatus;
}

export type TrainingStatus =
  | "not-started"
  | "in-progress"
  | "at-risk"
  | "overdue"
  | "complete";

// Incident Types
export interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: Severity;
  department: Department;
  location: string;
  dateTime: string;
  involvedEmployeeIds: string[];
  status: IncidentStatus;
  photos: string[];
  documents: string[];
  reportIds: string[];
}

export type IncidentType =
  | "Slip/Fall"
  | "Equipment Malfunction"
  | "Chemical Exposure"
  | "Ergonomic Injury"
  | "Fire/Explosion"
  | "Vehicle Incident"
  | "Other";

export type Severity = "Minor" | "Moderate" | "Severe" | "Critical";

export type IncidentStatus = "Reported" | "Under Review" | "Closed";

// Report Types
export interface Report {
  id: string;
  incidentId: string;
  type: ReportType;
  title: string;
  content: string;
  status: ReportStatus;
  createdAt: string;
  auditTrail: AuditEntry[];
}

export type ReportType = "Company Safety" | "OSHA";

export type ReportStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Denied"
  | "Closed";

export interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

// Chat Types
export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Analytics Types
export interface IncidentTrendData {
  date: string;
  incidents: number;
  compliance: number;
}

export interface DepartmentCompliance {
  department: Department;
  compliance: number;
  date: string;
}

export interface Alert {
  id: string;
  type: "certification" | "training" | "incident" | "module";
  severity: "warning" | "error" | "info";
  title: string;
  description: string;
  link?: string;
  employeeId?: string;
  trainingId?: string;
}

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: Department;
  hireDate: string;
  lastLogin: string;
}

export interface SupervisorProfile extends UserProfile {
  employeesManaged: number;
  certifications: string[];
}

export interface EmployeeProfile extends UserProfile {
  supervisorId: string;
  complianceStatus: ComplianceStatus;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  incidentNotifications: boolean;
  trainingReminders: boolean;
  certificationExpiry: boolean;
}

export interface UserSettings {
  profile: UserProfile;
  notifications: NotificationPreferences;
  theme: "light" | "dark" | "system";
  language: string;
}
