import {
  Employee,
  TrainingModule,
  Incident,
  Report,
  ChatConversation,
  IncidentTrendData,
  Department,
  SupervisorProfile,
  EmployeeProfile,
  UserSettings,
} from "./types";

// Current User Profiles
export const currentSupervisor: SupervisorProfile = {
  id: "sup-001",
  name: "Sarah Johnson",
  email: "sarah.johnson@delongsafety.com",
  phone: "(555) 123-4567",
  role: "Safety Supervisor",
  department: "Admin",
  hireDate: "2019-03-15",
  lastLogin: "2026-01-01T08:30:00Z",
  employeesManaged: 24,
  certifications: ["OSHA 30-Hour", "First Aid/CPR", "Hazmat Operations"],
};

export const currentEmployee: EmployeeProfile = {
  id: "emp-001",
  name: "John Martinez",
  email: "john.martinez@delongsafety.com",
  phone: "(555) 234-5678",
  role: "Grain Handler",
  department: "Grain Handling",
  hireDate: "2021-06-01",
  lastLogin: "2026-01-01T07:45:00Z",
  supervisorId: "sup-001",
  complianceStatus: "compliant",
};

export const supervisorSettings: UserSettings = {
  profile: currentSupervisor,
  notifications: {
    emailAlerts: true,
    incidentNotifications: true,
    trainingReminders: true,
    certificationExpiry: true,
  },
  theme: "light",
  language: "en",
};

export const employeeSettings: UserSettings = {
  profile: currentEmployee,
  notifications: {
    emailAlerts: true,
    incidentNotifications: true,
    trainingReminders: true,
    certificationExpiry: true,
  },
  theme: "light",
  language: "en",
};

// Training Modules
export const trainingModules: TrainingModule[] = [
  {
    id: "tm-001",
    title: "Grain Bin Entry Safety",
    description:
      "Essential safety protocols for entering and working in grain storage bins.",
    content:
      "This comprehensive training covers confined space entry procedures, atmospheric testing, lockout/tagout procedures, rescue planning, and personal protective equipment requirements for grain bin operations.",
    duration: "2 hours",
    department: "Grain Handling",
    createdDate: "2023-01-15",
    lastUpdated: "2024-06-20",
    isOutdated: false,
    version: "3.2",
  },
  {
    id: "tm-002",
    title: "Forklift Operation Certification",
    description: "Complete forklift safety and operation training program.",
    content:
      "Covers pre-operation inspection, load handling, traveling with loads, refueling procedures, pedestrian safety, and emergency procedures.",
    duration: "4 hours",
    department: "Logistics",
    createdDate: "2022-08-10",
    lastUpdated: "2023-03-15",
    isOutdated: true,
    version: "2.1",
  },
  {
    id: "tm-003",
    title: "Chemical Handling & HAZMAT",
    description:
      "Safe handling procedures for agricultural chemicals and hazardous materials.",
    content:
      "Training on SDS interpretation, proper storage, PPE requirements, spill response, and emergency procedures for chemical exposure.",
    duration: "3 hours",
    department: "Agronomy",
    createdDate: "2023-06-01",
    lastUpdated: "2024-09-10",
    isOutdated: false,
    version: "4.0",
  },
  {
    id: "tm-004",
    title: "Electrical Safety Fundamentals",
    description: "Basic electrical safety for maintenance personnel.",
    content:
      "Covers electrical hazard identification, lockout/tagout, arc flash prevention, and emergency response to electrical incidents.",
    duration: "2.5 hours",
    department: "Maintenance",
    createdDate: "2023-03-20",
    lastUpdated: "2024-01-15",
    isOutdated: false,
    version: "2.5",
  },
  {
    id: "tm-005",
    title: "Fire Safety & Emergency Response",
    description:
      "Fire prevention, suppression, and emergency evacuation procedures.",
    content:
      "Comprehensive fire safety training including fire extinguisher use, evacuation routes, assembly points, and emergency communication.",
    duration: "1.5 hours",
    department: "All",
    createdDate: "2022-11-01",
    lastUpdated: "2023-11-01",
    isOutdated: true,
    version: "1.8",
  },
  {
    id: "tm-006",
    title: "PPE Selection & Use",
    description:
      "Proper selection, use, and maintenance of personal protective equipment.",
    content:
      "Training on respirators, eye protection, hearing protection, gloves, safety footwear, and high-visibility clothing.",
    duration: "1 hour",
    department: "All",
    createdDate: "2024-02-01",
    lastUpdated: "2024-10-01",
    isOutdated: false,
    version: "5.0",
  },
  {
    id: "tm-007",
    title: "Ergonomics & Manual Handling",
    description: "Proper lifting techniques and workstation ergonomics.",
    content:
      "Covers proper lifting mechanics, team lifting, mechanical aids, workstation setup, and repetitive strain prevention.",
    duration: "1 hour",
    department: "All",
    createdDate: "2023-09-15",
    lastUpdated: "2024-08-20",
    isOutdated: false,
    version: "3.0",
  },
  {
    id: "tm-008",
    title: "Confined Space Entry",
    description:
      "Advanced confined space entry procedures and rescue operations.",
    content:
      "Detailed training on permit systems, atmospheric monitoring, ventilation, entry procedures, and rescue planning.",
    duration: "3 hours",
    department: "Maintenance",
    createdDate: "2023-04-10",
    lastUpdated: "2024-04-10",
    isOutdated: false,
    version: "2.8",
  },
  {
    id: "tm-009",
    title: "Defensive Driving for Commercial Vehicles",
    description: "Safe driving practices for commercial vehicle operators.",
    content:
      "Covers hazard recognition, space management, speed control, adverse conditions, and emergency maneuvers for commercial drivers.",
    duration: "4 hours",
    department: "Logistics",
    createdDate: "2024-01-15",
    lastUpdated: "2024-10-20",
    isOutdated: false,
    version: "2.0",
  },
  {
    id: "tm-010",
    title: "Grain Dust Explosion Prevention",
    description:
      "Understanding and preventing grain dust explosions in storage facilities.",
    content:
      "Covers dust accumulation hazards, ignition sources, housekeeping requirements, explosion venting, and emergency response procedures.",
    duration: "2 hours",
    department: "Grain Handling",
    createdDate: "2024-03-01",
    lastUpdated: "2024-11-15",
    isOutdated: false,
    version: "1.5",
  },
];

// Employees
export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "John Martinez",
    email: "jmartinez@delongsafety.com",
    phone: "(555) 123-4567",
    department: "Grain Handling",
    role: "Grain Elevator Operator",
    hireDate: "2019-03-15",
    certifications: [
      {
        id: "cert-001",
        name: "Confined Space Entry",
        issuedDate: "2023-06-15",
        expirationDate: "2025-06-15",
        status: "valid",
      },
      {
        id: "cert-002",
        name: "First Aid/CPR",
        issuedDate: "2023-02-20",
        expirationDate: "2025-02-20",
        status: "expiring-soon",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-001",
        trainingId: "tm-001",
        employeeId: "emp-001",
        assignedDate: "2024-09-01",
        dueDate: "2024-10-01",
        completedDate: "2024-09-25",
        status: "complete",
      },
      {
        id: "ta-002",
        trainingId: "tm-005",
        employeeId: "emp-001",
        assignedDate: "2024-12-01",
        dueDate: "2025-01-15",
        status: "in-progress",
      },
      {
        id: "ta-003",
        trainingId: "tm-006",
        employeeId: "emp-001",
        assignedDate: "2024-10-15",
        dueDate: "2024-11-30",
        status: "overdue",
      },
    ],
    incidentIds: ["inc-002"],
    complianceStatus: "at-risk",
  },
  {
    id: "emp-002",
    name: "Sarah Chen",
    email: "schen@delongsafety.com",
    phone: "(555) 234-5678",
    department: "Logistics",
    role: "Warehouse Supervisor",
    hireDate: "2018-07-22",
    certifications: [
      {
        id: "cert-003",
        name: "Forklift Operator",
        issuedDate: "2024-02-10",
        expirationDate: "2027-02-10",
        status: "valid",
      },
      {
        id: "cert-004",
        name: "OSHA 30-Hour General Industry",
        issuedDate: "2022-05-15",
        expirationDate: "2027-05-15",
        status: "valid",
      },
      {
        id: "cert-005",
        name: "Hazmat Handler",
        issuedDate: "2023-08-01",
        expirationDate: "2024-08-01",
        status: "expired",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-004",
        trainingId: "tm-002",
        employeeId: "emp-002",
        assignedDate: "2024-08-01",
        dueDate: "2024-09-01",
        completedDate: "2024-08-28",
        status: "complete",
      },
      {
        id: "ta-005",
        trainingId: "tm-007",
        employeeId: "emp-002",
        assignedDate: "2024-10-01",
        dueDate: "2024-11-01",
        completedDate: "2024-10-20",
        status: "complete",
      },
      {
        id: "ta-019",
        trainingId: "tm-009",
        employeeId: "emp-002",
        assignedDate: "2024-12-15",
        dueDate: "2025-01-30",
        status: "not-started",
      },
    ],
    incidentIds: [],
    complianceStatus: "at-risk",
  },
  {
    id: "emp-003",
    name: "Michael Thompson",
    email: "mthompson@delongsafety.com",
    phone: "(555) 345-6789",
    department: "Maintenance",
    role: "Lead Maintenance Technician",
    hireDate: "2017-02-10",
    certifications: [
      {
        id: "cert-006",
        name: "Electrical Safety Qualified Person",
        issuedDate: "2024-01-15",
        expirationDate: "2027-01-15",
        status: "valid",
      },
      {
        id: "cert-007",
        name: "AWS Welding Certification",
        issuedDate: "2023-11-01",
        expirationDate: "2026-11-01",
        status: "valid",
      },
      {
        id: "cert-008",
        name: "Confined Space Entry",
        issuedDate: "2024-03-20",
        expirationDate: "2026-03-20",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-006",
        trainingId: "tm-004",
        employeeId: "emp-003",
        assignedDate: "2024-09-15",
        dueDate: "2024-10-15",
        completedDate: "2024-10-10",
        status: "complete",
      },
      {
        id: "ta-007",
        trainingId: "tm-008",
        employeeId: "emp-003",
        assignedDate: "2024-10-01",
        dueDate: "2024-11-01",
        completedDate: "2024-10-28",
        status: "complete",
      },
    ],
    incidentIds: ["inc-001"],
    complianceStatus: "compliant",
  },
  {
    id: "emp-004",
    name: "Emily Rodriguez",
    email: "erodriguez@delongsafety.com",
    phone: "(555) 456-7890",
    department: "Agronomy",
    role: "Field Agronomist",
    hireDate: "2020-05-18",
    certifications: [
      {
        id: "cert-009",
        name: "Commercial Pesticide Applicator",
        issuedDate: "2024-04-01",
        expirationDate: "2027-04-01",
        status: "valid",
      },
      {
        id: "cert-010",
        name: "First Aid/CPR",
        issuedDate: "2024-06-15",
        expirationDate: "2026-06-15",
        status: "valid",
      },
      {
        id: "cert-024",
        name: "Certified Crop Adviser (CCA)",
        issuedDate: "2021-08-15",
        expirationDate: "2026-08-15",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-008",
        trainingId: "tm-003",
        employeeId: "emp-004",
        assignedDate: "2024-07-01",
        dueDate: "2024-08-01",
        completedDate: "2024-07-25",
        status: "complete",
      },
      {
        id: "ta-009",
        trainingId: "tm-006",
        employeeId: "emp-004",
        assignedDate: "2024-12-15",
        dueDate: "2025-01-20",
        status: "not-started",
      },
    ],
    incidentIds: ["inc-003"],
    complianceStatus: "compliant",
  },
  {
    id: "emp-005",
    name: "David Wilson",
    email: "dwilson@delongsafety.com",
    phone: "(555) 567-8901",
    department: "Admin",
    role: "Safety Coordinator",
    hireDate: "2021-09-01",
    certifications: [
      {
        id: "cert-011",
        name: "OSHA 30-Hour General Industry",
        issuedDate: "2021-10-15",
        expirationDate: "2026-10-15",
        status: "valid",
      },
      {
        id: "cert-012",
        name: "First Aid/CPR Instructor",
        issuedDate: "2024-09-01",
        expirationDate: "2026-09-01",
        status: "valid",
      },
      {
        id: "cert-025",
        name: "Certified Safety Professional (CSP)",
        issuedDate: "2022-03-15",
        expirationDate: "2027-03-15",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-010",
        trainingId: "tm-005",
        employeeId: "emp-005",
        assignedDate: "2024-10-01",
        dueDate: "2024-11-15",
        completedDate: "2024-11-01",
        status: "complete",
      },
      {
        id: "ta-011",
        trainingId: "tm-007",
        employeeId: "emp-005",
        assignedDate: "2024-11-01",
        dueDate: "2024-12-15",
        completedDate: "2024-12-10",
        status: "complete",
      },
    ],
    incidentIds: [],
    complianceStatus: "compliant",
  },
  {
    id: "emp-006",
    name: "Lisa Anderson",
    email: "landerson@delongsafety.com",
    phone: "(555) 678-9012",
    department: "Grain Handling",
    role: "Quality Control Specialist",
    hireDate: "2022-01-10",
    certifications: [
      {
        id: "cert-013",
        name: "Confined Space Entry",
        issuedDate: "2022-03-15",
        expirationDate: "2024-03-15",
        status: "expired",
      },
      {
        id: "cert-014",
        name: "Food Safety (HACCP)",
        issuedDate: "2024-05-01",
        expirationDate: "2027-05-01",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-012",
        trainingId: "tm-001",
        employeeId: "emp-006",
        assignedDate: "2024-08-01",
        dueDate: "2024-09-15",
        status: "overdue",
      },
      {
        id: "ta-013",
        trainingId: "tm-006",
        employeeId: "emp-006",
        assignedDate: "2024-11-01",
        dueDate: "2024-12-15",
        status: "overdue",
      },
      {
        id: "ta-014",
        trainingId: "tm-005",
        employeeId: "emp-006",
        assignedDate: "2024-09-01",
        dueDate: "2024-10-15",
        status: "overdue",
      },
    ],
    incidentIds: ["inc-002"],
    complianceStatus: "non-compliant",
  },
  {
    id: "emp-007",
    name: "Robert Kim",
    email: "rkim@delongsafety.com",
    phone: "(555) 789-0123",
    department: "Logistics",
    role: "Commercial Truck Driver",
    hireDate: "2020-11-15",
    certifications: [
      {
        id: "cert-015",
        name: "CDL Class A",
        issuedDate: "2020-11-20",
        expirationDate: "2025-11-20",
        status: "valid",
      },
      {
        id: "cert-016",
        name: "Hazmat Endorsement",
        issuedDate: "2021-02-01",
        expirationDate: "2025-02-01",
        status: "expiring-soon",
      },
      {
        id: "cert-026",
        name: "DOT Medical Card",
        issuedDate: "2024-06-15",
        expirationDate: "2026-06-15",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-015",
        trainingId: "tm-002",
        employeeId: "emp-007",
        assignedDate: "2024-10-01",
        dueDate: "2025-01-15",
        status: "at-risk",
      },
      {
        id: "ta-016",
        trainingId: "tm-007",
        employeeId: "emp-007",
        assignedDate: "2024-09-01",
        dueDate: "2024-10-30",
        completedDate: "2024-10-25",
        status: "complete",
      },
      {
        id: "ta-020",
        trainingId: "tm-009",
        employeeId: "emp-007",
        assignedDate: "2024-11-15",
        dueDate: "2025-01-10",
        status: "in-progress",
      },
    ],
    incidentIds: ["inc-004"],
    complianceStatus: "in-progress",
  },
  {
    id: "emp-008",
    name: "Amanda Foster",
    email: "afoster@delongsafety.com",
    phone: "(555) 890-1234",
    department: "Maintenance",
    role: "HVAC Technician",
    hireDate: "2023-04-01",
    certifications: [
      {
        id: "cert-017",
        name: "EPA Section 608 Universal",
        issuedDate: "2023-05-15",
        expirationDate: "9999-12-31",
        status: "valid",
      },
      {
        id: "cert-018",
        name: "First Aid/CPR",
        issuedDate: "2023-04-20",
        expirationDate: "2025-04-20",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-017",
        trainingId: "tm-004",
        employeeId: "emp-008",
        assignedDate: "2024-06-01",
        dueDate: "2024-07-15",
        completedDate: "2024-07-10",
        status: "complete",
      },
      {
        id: "ta-018",
        trainingId: "tm-008",
        employeeId: "emp-008",
        assignedDate: "2024-11-01",
        dueDate: "2025-01-15",
        status: "in-progress",
      },
    ],
    incidentIds: [],
    complianceStatus: "compliant",
  },
  {
    id: "emp-009",
    name: "Marcus Johnson",
    email: "mjohnson@delongsafety.com",
    phone: "(555) 901-2345",
    department: "Grain Handling",
    role: "Facility Supervisor",
    hireDate: "2016-08-20",
    certifications: [
      {
        id: "cert-019",
        name: "Confined Space Entry",
        issuedDate: "2024-08-10",
        expirationDate: "2026-08-10",
        status: "valid",
      },
      {
        id: "cert-020",
        name: "OSHA 30-Hour General Industry",
        issuedDate: "2020-06-15",
        expirationDate: "2025-06-15",
        status: "valid",
      },
      {
        id: "cert-027",
        name: "Grain Fumigation Certification",
        issuedDate: "2024-02-28",
        expirationDate: "2027-02-28",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-021",
        trainingId: "tm-001",
        employeeId: "emp-009",
        assignedDate: "2024-07-01",
        dueDate: "2024-08-15",
        completedDate: "2024-08-10",
        status: "complete",
      },
      {
        id: "ta-022",
        trainingId: "tm-010",
        employeeId: "emp-009",
        assignedDate: "2024-11-01",
        dueDate: "2025-01-15",
        status: "in-progress",
      },
    ],
    incidentIds: [],
    complianceStatus: "compliant",
  },
  {
    id: "emp-010",
    name: "Jennifer Walsh",
    email: "jwalsh@delongsafety.com",
    phone: "(555) 012-3456",
    department: "Admin",
    role: "Office Manager",
    hireDate: "2019-11-04",
    certifications: [
      {
        id: "cert-021",
        name: "First Aid/CPR",
        issuedDate: "2024-03-10",
        expirationDate: "2026-03-10",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-023",
        trainingId: "tm-005",
        employeeId: "emp-010",
        assignedDate: "2024-10-15",
        dueDate: "2024-12-01",
        completedDate: "2024-11-28",
        status: "complete",
      },
      {
        id: "ta-024",
        trainingId: "tm-007",
        employeeId: "emp-010",
        assignedDate: "2024-12-01",
        dueDate: "2025-01-31",
        status: "not-started",
      },
    ],
    incidentIds: ["inc-005"],
    complianceStatus: "compliant",
  },
  {
    id: "emp-011",
    name: "Carlos Mendez",
    email: "cmendez@delongsafety.com",
    phone: "(555) 234-6789",
    department: "Agronomy",
    role: "Agronomy Technician",
    hireDate: "2022-06-15",
    certifications: [
      {
        id: "cert-022",
        name: "Commercial Pesticide Applicator",
        issuedDate: "2022-09-01",
        expirationDate: "2025-09-01",
        status: "valid",
      },
      {
        id: "cert-023",
        name: "First Aid/CPR",
        issuedDate: "2023-06-20",
        expirationDate: "2025-06-20",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-025",
        trainingId: "tm-003",
        employeeId: "emp-011",
        assignedDate: "2024-08-15",
        dueDate: "2024-10-01",
        completedDate: "2024-09-28",
        status: "complete",
      },
      {
        id: "ta-026",
        trainingId: "tm-006",
        employeeId: "emp-011",
        assignedDate: "2024-12-01",
        dueDate: "2025-01-15",
        status: "not-started",
      },
    ],
    incidentIds: [],
    complianceStatus: "compliant",
  },
  {
    id: "emp-012",
    name: "Kevin O'Brien",
    email: "kobrien@delongsafety.com",
    phone: "(555) 345-7890",
    department: "Logistics",
    role: "Forklift Operator",
    hireDate: "2023-09-11",
    certifications: [
      {
        id: "cert-028",
        name: "Forklift Operator",
        issuedDate: "2023-10-01",
        expirationDate: "2026-10-01",
        status: "valid",
      },
      {
        id: "cert-029",
        name: "First Aid/CPR",
        issuedDate: "2023-09-20",
        expirationDate: "2025-09-20",
        status: "valid",
      },
    ],
    trainingAssignments: [
      {
        id: "ta-027",
        trainingId: "tm-002",
        employeeId: "emp-012",
        assignedDate: "2024-09-15",
        dueDate: "2024-11-15",
        completedDate: "2024-11-10",
        status: "complete",
      },
      {
        id: "ta-028",
        trainingId: "tm-007",
        employeeId: "emp-012",
        assignedDate: "2024-11-20",
        dueDate: "2025-01-20",
        status: "in-progress",
      },
    ],
    incidentIds: [],
    complianceStatus: "compliant",
  },
];

// Incidents
export const incidents: Incident[] = [
  {
    id: "inc-001",
    title: "Electrical Arc Flash Near-Miss",
    description:
      "During routine maintenance on Panel B-12, an arc flash occurred when the technician removed a cover plate. The technician was wearing appropriate PPE and was not injured. Investigation revealed improper lockout/tagout procedures.",
    type: "Equipment Malfunction",
    severity: "Moderate",
    department: "Maintenance",
    location: "Building A - Electrical Room",
    dateTime: "2024-12-10T14:30:00",
    involvedEmployeeIds: ["emp-003"],
    status: "Under Review",
    photos: ["/placeholder-incident-1.jpg"],
    documents: ["lockout-procedure-review.pdf"],
    reportIds: ["rep-001", "rep-002"],
  },
  {
    id: "inc-002",
    title: "Grain Bin Engulfment Hazard",
    description:
      "Employee entered grain bin #4 without proper permit or safety observer. Coworker noticed and immediately alerted supervision. No injuries occurred but significant protocol violations identified.",
    type: "Other",
    severity: "Severe",
    department: "Grain Handling",
    location: "Grain Storage Facility - Bin #4",
    dateTime: "2024-12-18T09:15:00",
    involvedEmployeeIds: ["emp-001", "emp-006"],
    status: "Under Review",
    photos: [],
    documents: [],
    reportIds: ["rep-007"],
  },
  {
    id: "inc-003",
    title: "Chemical Splash - Minor Exposure",
    description:
      "During fertilizer mixing operations, a small amount of liquid fertilizer splashed onto an employee's forearm. Employee was wearing long sleeves but not chemical-resistant gloves. Area was immediately washed and no lasting effects.",
    type: "Chemical Exposure",
    severity: "Minor",
    department: "Agronomy",
    location: "Chemical Mixing Station",
    dateTime: "2024-11-08T11:45:00",
    involvedEmployeeIds: ["emp-004"],
    status: "Closed",
    photos: ["/placeholder-incident-2.jpg"],
    documents: ["sds-review.pdf", "incident-closeout.pdf"],
    reportIds: ["rep-003", "rep-004"],
  },
  {
    id: "inc-004",
    title: "Vehicle Backing Incident",
    description:
      "Delivery truck backed into loading dock support column while maneuvering in tight space. Minor damage to truck bumper and column. No injuries. Driver reported sun glare affected visibility.",
    type: "Vehicle Incident",
    severity: "Minor",
    department: "Logistics",
    location: "Loading Dock C",
    dateTime: "2024-12-20T16:20:00",
    involvedEmployeeIds: ["emp-007"],
    status: "Under Review",
    photos: ["/placeholder-incident-3.jpg", "/placeholder-incident-4.jpg"],
    documents: ["vehicle-inspection.pdf"],
    reportIds: ["rep-005"],
  },
  {
    id: "inc-005",
    title: "Slip and Fall - Wet Floor",
    description:
      "Employee slipped on wet floor in break room area after mopping. Employee sustained minor bruising to knee. Wet floor signs were present but not highly visible.",
    type: "Slip/Fall",
    severity: "Minor",
    department: "Admin",
    location: "Building B - Break Room",
    dateTime: "2024-12-05T12:15:00",
    involvedEmployeeIds: ["emp-010"],
    status: "Closed",
    photos: [],
    documents: ["medical-report.pdf"],
    reportIds: ["rep-006"],
  },
  {
    id: "inc-006",
    title: "Forklift Tip-Over Near Miss",
    description:
      "Forklift began to tip while turning with elevated load. Operator immediately stopped and lowered load. Investigation found operator was exceeding safe speed for turn radius with elevated load.",
    type: "Equipment Malfunction",
    severity: "Moderate",
    department: "Logistics",
    location: "Warehouse A - Aisle 7",
    dateTime: "2024-10-15T10:30:00",
    involvedEmployeeIds: [],
    status: "Closed",
    photos: [],
    documents: ["forklift-inspection.pdf", "operator-interview.pdf"],
    reportIds: [],
  },
  {
    id: "inc-007",
    title: "Hearing Protection Compliance Issue",
    description:
      "During routine safety inspection, multiple employees were observed working near grain dryer without required hearing protection. Noise levels measured at 92 dB, exceeding 85 dB threshold.",
    type: "Other",
    severity: "Minor",
    department: "Grain Handling",
    location: "Grain Dryer Station",
    dateTime: "2024-09-22T14:00:00",
    involvedEmployeeIds: [],
    status: "Closed",
    photos: [],
    documents: ["noise-survey.pdf"],
    reportIds: [],
  },
];

// Reports
export const reports: Report[] = [
  {
    id: "rep-001",
    incidentId: "inc-001",
    type: "Company Safety",
    title: "Arc Flash Incident - Safety Analysis",
    content: `## Incident Summary
An electrical arc flash occurred during routine maintenance on Panel B-12. The involved employee (Michael Thompson) was wearing appropriate PPE including arc-rated clothing, face shield, and insulated gloves.

## Root Cause Analysis
Investigation revealed that the lockout/tagout procedure was not properly followed. The panel was not fully de-energized before cover removal.

## Training/Certification Status
- Employee has current Electrical Safety certification (expires 2027-01-15)
- Lockout/Tagout refresher training was completed 6 months ago
- Recommendation: Additional verification step required before panel access

## Corrective Actions
1. Implement two-person verification for electrical panel access
2. Update lockout/tagout checklist
3. Schedule refresher training for all maintenance personnel`,
    status: "Under Review",
    createdAt: "2024-12-10T16:00:00",
    auditTrail: [
      {
        timestamp: "2024-12-10T16:00:00",
        action: "Created",
        user: "David Wilson",
        details: "Initial report generated",
      },
      {
        timestamp: "2024-12-11T09:30:00",
        action: "Updated",
        user: "David Wilson",
        details: "Added root cause analysis",
      },
      {
        timestamp: "2024-12-12T14:00:00",
        action: "Submitted for Review",
        user: "David Wilson",
      },
    ],
  },
  {
    id: "rep-002",
    incidentId: "inc-001",
    type: "OSHA",
    title: "OSHA Form 301 - Arc Flash Incident",
    content: `## OSHA Form 301 - Injury and Illness Incident Report

**Case Number:** 2024-MNT-001

**Employee Information:**
- Name: Michael Thompson
- Job Title: Lead Maintenance Technician
- Date of Birth: [REDACTED]

**Incident Details:**
- Date: December 10, 2024
- Time: 2:30 PM
- Location: Building A - Electrical Room

**Description:**
Arc flash occurred during maintenance on electrical panel. Employee was wearing appropriate PPE. No injuries sustained.

**Classification:**
Near-miss incident - No recordable injury`,
    status: "Draft",
    createdAt: "2024-12-10T17:00:00",
    auditTrail: [
      {
        timestamp: "2024-12-10T17:00:00",
        action: "Created",
        user: "System",
        details: "Auto-generated OSHA report",
      },
    ],
  },
  {
    id: "rep-003",
    incidentId: "inc-003",
    type: "Company Safety",
    title: "Chemical Exposure - Safety Review",
    content: `## Incident Summary
Minor chemical splash during fertilizer mixing operations. Employee sustained minor exposure to forearm.

## Root Cause
Employee was not wearing chemical-resistant gloves as required by procedure.

## Training Status
- Chemical Handling training: Complete (July 2024)
- PPE Selection training: Assigned, not yet completed

## Corrective Actions
1. PPE compliance check added to pre-work checklist
2. Chemical-resistant gloves relocated closer to mixing station`,
    status: "Closed",
    createdAt: "2024-11-08T14:00:00",
    auditTrail: [
      {
        timestamp: "2024-11-08T14:00:00",
        action: "Created",
        user: "David Wilson",
      },
      {
        timestamp: "2024-11-09T10:00:00",
        action: "Submitted for Review",
        user: "David Wilson",
      },
      {
        timestamp: "2024-11-10T15:00:00",
        action: "Approved",
        user: "Sarah Chen",
      },
      {
        timestamp: "2024-11-12T09:00:00",
        action: "Closed",
        user: "David Wilson",
        details: "All corrective actions implemented",
      },
    ],
  },
  {
    id: "rep-004",
    incidentId: "inc-003",
    type: "OSHA",
    title: "OSHA Form 301 - Chemical Exposure",
    content: `## OSHA Form 301

**Case Number:** 2024-AGR-001

**Classification:**
First aid only - Not recordable`,
    status: "Approved",
    createdAt: "2024-11-08T15:00:00",
    auditTrail: [
      { timestamp: "2024-11-08T15:00:00", action: "Created", user: "System" },
      {
        timestamp: "2024-11-10T15:30:00",
        action: "Approved",
        user: "Sarah Chen",
      },
    ],
  },
  {
    id: "rep-005",
    incidentId: "inc-004",
    type: "Company Safety",
    title: "Vehicle Incident - Loading Dock C",
    content: `## Incident Summary
Delivery truck backed into loading dock support column causing minor property damage.

## Contributing Factors
- Sun glare at time of incident
- Tight maneuvering space
- Spotter not present

## Recommendations
1. Install sun shades at loading dock
2. Require spotter for all backing maneuvers
3. Review dock layout for potential improvements`,
    status: "Under Review",
    createdAt: "2024-12-20T17:30:00",
    auditTrail: [
      {
        timestamp: "2024-12-20T17:30:00",
        action: "Created",
        user: "David Wilson",
      },
      {
        timestamp: "2024-12-21T09:00:00",
        action: "Submitted for Review",
        user: "David Wilson",
      },
    ],
  },
  {
    id: "rep-006",
    incidentId: "inc-005",
    type: "Company Safety",
    title: "Slip and Fall - Break Room",
    content: `## Incident Summary
Employee slipped on wet floor in break room, sustaining minor knee bruising.

## Corrective Actions
1. Purchased high-visibility wet floor signs
2. Implemented new mopping schedule to avoid peak break times`,
    status: "Closed",
    createdAt: "2024-12-05T14:00:00",
    auditTrail: [
      {
        timestamp: "2024-12-05T14:00:00",
        action: "Created",
        user: "David Wilson",
      },
      {
        timestamp: "2024-12-06T10:00:00",
        action: "Approved",
        user: "Sarah Chen",
      },
      {
        timestamp: "2024-12-10T09:00:00",
        action: "Closed",
        user: "David Wilson",
      },
    ],
  },
  {
    id: "rep-007",
    incidentId: "inc-002",
    type: "Company Safety",
    title: "Grain Bin Entry Violation - Investigation Report",
    content: `## Incident Summary
Employee entered grain bin #4 without proper confined space entry permit and without a safety observer present. A coworker noticed the violation and immediately alerted supervision.

## Investigation Findings
- Employee bypassed required permit process
- No atmospheric testing was performed
- Safety observer was not assigned
- Employee's Confined Space Entry certification is current

## Root Cause Analysis
- Employee felt time pressure to complete task
- Inadequate supervision during shift change
- Permit station location inconvenient

## Corrective Actions
1. Disciplinary action per company policy
2. Mandatory confined space entry refresher for all Grain Handling employees
3. Relocate permit station closer to bin access points
4. Implement buddy system for all bin entries`,
    status: "Under Review",
    createdAt: "2024-12-18T11:00:00",
    auditTrail: [
      {
        timestamp: "2024-12-18T11:00:00",
        action: "Created",
        user: "David Wilson",
        details: "Initial investigation report",
      },
      {
        timestamp: "2024-12-19T14:30:00",
        action: "Updated",
        user: "Marcus Johnson",
        details: "Added supervisor statement",
      },
    ],
  },
];

// Chat Conversations
export const chatConversations: ChatConversation[] = [
  {
    id: "chat-001",
    title: "Q4 Compliance Overview",
    createdAt: "2024-12-20T10:00:00",
    updatedAt: "2024-12-20T10:15:00",
    messages: [
      {
        id: "msg-001",
        role: "user",
        content: "What is our current overall compliance rate?",
        timestamp: "2024-12-20T10:00:00",
      },
      {
        id: "msg-002",
        role: "assistant",
        content:
          "Based on the current data, your overall compliance rate is 78.5%. Here's the breakdown by department:\n\n- **Admin:** 95%\n- **Maintenance:** 92%\n- **Agronomy:** 88%\n- **Logistics:** 75%\n- **Grain Handling:** 62%\n\nThe Grain Handling department needs attention, with 2 employees having overdue training and 1 expired certification.",
        timestamp: "2024-12-20T10:00:30",
      },
      {
        id: "msg-003",
        role: "user",
        content: "Who in Grain Handling has overdue training?",
        timestamp: "2024-12-20T10:05:00",
      },
      {
        id: "msg-004",
        role: "assistant",
        content:
          "In the Grain Handling department, the following employees have overdue training:\n\n1. **John Martinez (emp-001)**\n   - PPE Selection & Use - Due: Nov 30, 2024 (OVERDUE)\n\n2. **Lisa Anderson (emp-006)**\n   - Grain Bin Entry Safety - Due: Sep 15, 2024 (OVERDUE)\n   - Fire Safety & Emergency Response - Due: Oct 15, 2024 (OVERDUE)\n   - PPE Selection & Use - Due: Dec 15, 2024 (OVERDUE)\n\nLisa Anderson is flagged as non-compliant and should be prioritized.",
        timestamp: "2024-12-20T10:05:30",
      },
    ],
  },
  {
    id: "chat-002",
    title: "Recent Incidents Analysis",
    createdAt: "2024-12-22T14:00:00",
    updatedAt: "2024-12-22T14:20:00",
    messages: [
      {
        id: "msg-005",
        role: "user",
        content: "Summarize the incidents from this month",
        timestamp: "2024-12-22T14:00:00",
      },
      {
        id: "msg-006",
        role: "assistant",
        content:
          "Here's a summary of incidents from December 2024:\n\n**Total Incidents:** 4\n\n1. **Slip and Fall - Break Room** (Dec 5)\n   - Severity: Minor\n   - Department: Admin\n   - Status: Closed\n\n2. **Arc Flash Near-Miss** (Dec 10)\n   - Severity: Moderate\n   - Department: Maintenance\n   - Status: Under Review\n\n3. **Grain Bin Entry Violation** (Dec 18)\n   - Severity: Severe\n   - Department: Grain Handling\n   - Status: Under Review\n\n4. **Vehicle Backing Incident** (Dec 20)\n   - Severity: Minor\n   - Department: Logistics\n   - Status: Under Review\n\n**Key Pattern:** 2 of 4 incidents involved procedural violations rather than equipment failure.",
        timestamp: "2024-12-22T14:00:45",
      },
    ],
  },
];

// Employee Chat Conversations (for employee portal)
export const employeeChatConversations: ChatConversation[] = [
  {
    id: "emp-chat-001",
    title: "PPE Requirements Question",
    createdAt: "2024-12-18T09:00:00",
    updatedAt: "2024-12-18T09:10:00",
    messages: [
      {
        id: "emp-msg-001",
        role: "user",
        content: "What PPE do I need when working near the grain bins?",
        timestamp: "2024-12-18T09:00:00",
      },
      {
        id: "emp-msg-002",
        role: "assistant",
        content:
          "When working near grain bins, you need the following PPE:\n\n**Required Equipment:**\n- **Hard Hat** - Protects against falling objects and overhead hazards\n- **Safety Glasses** - Shields eyes from dust and debris\n- **Dust Mask/N95 Respirator** - Essential for grain dust protection\n- **Steel-Toed Boots** - Required footwear in all grain handling areas\n- **High-Visibility Vest** - For visibility around moving equipment\n\n**Additional for Bin Entry:**\n- Full-body harness with lifeline\n- Atmospheric monitoring equipment\n\nRemember: Never enter a grain bin without proper authorization and a trained observer present. Would you like me to explain the bin entry procedures?",
        timestamp: "2024-12-18T09:00:45",
      },
      {
        id: "emp-msg-003",
        role: "user",
        content: "Yes, please explain the bin entry procedures",
        timestamp: "2024-12-18T09:05:00",
      },
      {
        id: "emp-msg-004",
        role: "assistant",
        content:
          "Here are the grain bin entry procedures you must follow:\n\n**Before Entry:**\n1. Obtain a confined space entry permit from your supervisor\n2. Ensure all equipment (augers, conveyors) is locked out/tagged out\n3. Test the atmosphere for oxygen levels and toxic gases\n4. Have a trained observer stationed outside the bin\n\n**During Entry:**\n1. Wear your full-body harness attached to a lifeline\n2. Maintain communication with the outside observer\n3. Never walk on grain surface - use planks or platforms\n4. Exit immediately if you feel lightheaded or notice any issues\n\n**Emergency:**\n- The observer must never enter to rescue - call emergency services\n- Use the rescue equipment to extract the person\n\n⚠️ **Important:** Your Grain Bin Entry Safety training is due for renewal. Please complete it by December 30th.",
        timestamp: "2024-12-18T09:05:30",
      },
    ],
  },
  {
    id: "emp-chat-002",
    title: "Incident Reporting Help",
    createdAt: "2024-12-20T14:30:00",
    updatedAt: "2024-12-20T14:40:00",
    messages: [
      {
        id: "emp-msg-005",
        role: "user",
        content: "How do I report a near-miss incident?",
        timestamp: "2024-12-20T14:30:00",
      },
      {
        id: "emp-msg-006",
        role: "assistant",
        content:
          "Great question! Reporting near-misses helps prevent future accidents. Here's how to report one:\n\n**Steps to Report a Near-Miss:**\n\n1. **Go to Report Incident** in your employee portal\n2. **Select Incident Type:** Choose \"Near Miss\"\n3. **Fill in the details:**\n   - Date and time of the incident\n   - Location (be specific)\n   - Description of what happened\n   - What could have happened if it escalated\n   - Any contributing factors\n\n**What Happens Next:**\n- Your supervisor will be notified\n- The safety team will review and investigate\n- You may be asked for additional details\n- Corrective actions will be implemented\n\n**Remember:** There's no penalty for reporting near-misses. In fact, reporting them is encouraged and helps keep everyone safe!\n\nWould you like me to guide you through reporting a specific incident?",
        timestamp: "2024-12-20T14:30:30",
      },
    ],
  },
];

// Trend Data for Analytics
export const incidentTrendData: IncidentTrendData[] = [
  { date: "2024-01", incidents: 3, compliance: 82 },
  { date: "2024-02", incidents: 2, compliance: 84 },
  { date: "2024-03", incidents: 4, compliance: 81 },
  { date: "2024-04", incidents: 2, compliance: 85 },
  { date: "2024-05", incidents: 1, compliance: 88 },
  { date: "2024-06", incidents: 3, compliance: 86 },
  { date: "2024-07", incidents: 2, compliance: 84 },
  { date: "2024-08", incidents: 4, compliance: 80 },
  { date: "2024-09", incidents: 2, compliance: 79 },
  { date: "2024-10", incidents: 1, compliance: 81 },
  { date: "2024-11", incidents: 1, compliance: 80 },
  { date: "2024-12", incidents: 4, compliance: 78 },
];

// Department compliance over time
export const departmentComplianceData = [
  {
    date: "2024-07",
    "Grain Handling": 70,
    Logistics: 78,
    Maintenance: 90,
    Agronomy: 85,
    Admin: 95,
  },
  {
    date: "2024-08",
    "Grain Handling": 68,
    Logistics: 76,
    Maintenance: 91,
    Agronomy: 86,
    Admin: 94,
  },
  {
    date: "2024-09",
    "Grain Handling": 65,
    Logistics: 74,
    Maintenance: 92,
    Agronomy: 87,
    Admin: 95,
  },
  {
    date: "2024-10",
    "Grain Handling": 64,
    Logistics: 75,
    Maintenance: 91,
    Agronomy: 88,
    Admin: 96,
  },
  {
    date: "2024-11",
    "Grain Handling": 62,
    Logistics: 75,
    Maintenance: 92,
    Agronomy: 88,
    Admin: 95,
  },
  {
    date: "2024-12",
    "Grain Handling": 60,
    Logistics: 74,
    Maintenance: 93,
    Agronomy: 89,
    Admin: 95,
  },
];

// Incident distribution by type
export const incidentDistribution = [
  { name: "Equipment Malfunction", value: 8, color: "#ef4444" },
  { name: "Slip/Fall", value: 6, color: "#f97316" },
  { name: "Chemical Exposure", value: 4, color: "#eab308" },
  { name: "Vehicle Incident", value: 5, color: "#22c55e" },
  { name: "Ergonomic Injury", value: 3, color: "#3b82f6" },
  { name: "Other", value: 4, color: "#8b5cf6" },
];

// Heatmap data for monthly incidents
export const incidentHeatmapData = {
  "2024-12": [
    { day: 1, count: 0 },
    { day: 2, count: 0 },
    { day: 3, count: 0 },
    { day: 4, count: 0 },
    { day: 5, count: 1 },
    { day: 6, count: 0 },
    { day: 7, count: 0 },
    { day: 8, count: 0 },
    { day: 9, count: 0 },
    { day: 10, count: 1 },
    { day: 11, count: 0 },
    { day: 12, count: 0 },
    { day: 13, count: 0 },
    { day: 14, count: 0 },
    { day: 15, count: 0 },
    { day: 16, count: 0 },
    { day: 17, count: 0 },
    { day: 18, count: 1 },
    { day: 19, count: 0 },
    { day: 20, count: 1 },
    { day: 21, count: 0 },
    { day: 22, count: 0 },
    { day: 23, count: 0 },
    { day: 24, count: 0 },
    { day: 25, count: 0 },
    { day: 26, count: 0 },
    { day: 27, count: 0 },
    { day: 28, count: 0 },
    { day: 29, count: 0 },
    { day: 30, count: 0 },
    { day: 31, count: 0 },
  ],
  "2024-11": [
    { day: 1, count: 0 },
    { day: 2, count: 0 },
    { day: 3, count: 0 },
    { day: 4, count: 0 },
    { day: 5, count: 0 },
    { day: 6, count: 0 },
    { day: 7, count: 0 },
    { day: 8, count: 1 },
    { day: 9, count: 0 },
    { day: 10, count: 0 },
    { day: 11, count: 0 },
    { day: 12, count: 0 },
    { day: 13, count: 0 },
    { day: 14, count: 0 },
    { day: 15, count: 0 },
    { day: 16, count: 0 },
    { day: 17, count: 0 },
    { day: 18, count: 0 },
    { day: 19, count: 0 },
    { day: 20, count: 0 },
    { day: 21, count: 0 },
    { day: 22, count: 0 },
    { day: 23, count: 0 },
    { day: 24, count: 0 },
    { day: 25, count: 0 },
    { day: 26, count: 0 },
    { day: 27, count: 0 },
    { day: 28, count: 0 },
    { day: 29, count: 0 },
    { day: 30, count: 0 },
  ],
  "2024-10": [
    { day: 1, count: 0 },
    { day: 2, count: 0 },
    { day: 3, count: 0 },
    { day: 4, count: 0 },
    { day: 5, count: 0 },
    { day: 6, count: 0 },
    { day: 7, count: 0 },
    { day: 8, count: 0 },
    { day: 9, count: 0 },
    { day: 10, count: 0 },
    { day: 11, count: 0 },
    { day: 12, count: 0 },
    { day: 13, count: 0 },
    { day: 14, count: 0 },
    { day: 15, count: 1 },
    { day: 16, count: 0 },
    { day: 17, count: 0 },
    { day: 18, count: 0 },
    { day: 19, count: 0 },
    { day: 20, count: 0 },
    { day: 21, count: 0 },
    { day: 22, count: 0 },
    { day: 23, count: 0 },
    { day: 24, count: 0 },
    { day: 25, count: 0 },
    { day: 26, count: 0 },
    { day: 27, count: 0 },
    { day: 28, count: 0 },
    { day: 29, count: 0 },
    { day: 30, count: 0 },
    { day: 31, count: 0 },
  ],
  "2024-09": [
    { day: 1, count: 0 },
    { day: 2, count: 0 },
    { day: 3, count: 0 },
    { day: 4, count: 0 },
    { day: 5, count: 0 },
    { day: 6, count: 0 },
    { day: 7, count: 0 },
    { day: 8, count: 0 },
    { day: 9, count: 0 },
    { day: 10, count: 0 },
    { day: 11, count: 0 },
    { day: 12, count: 0 },
    { day: 13, count: 0 },
    { day: 14, count: 0 },
    { day: 15, count: 0 },
    { day: 16, count: 0 },
    { day: 17, count: 0 },
    { day: 18, count: 0 },
    { day: 19, count: 0 },
    { day: 20, count: 0 },
    { day: 21, count: 0 },
    { day: 22, count: 1 },
    { day: 23, count: 0 },
    { day: 24, count: 0 },
    { day: 25, count: 0 },
    { day: 26, count: 0 },
    { day: 27, count: 0 },
    { day: 28, count: 0 },
    { day: 29, count: 0 },
    { day: 30, count: 0 },
  ],
};

// Helper functions
export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function getTrainingById(id: string): TrainingModule | undefined {
  return trainingModules.find((t) => t.id === id);
}

export function getIncidentById(id: string): Incident | undefined {
  return incidents.find((i) => i.id === id);
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}

export function getReportsByIncidentId(incidentId: string): Report[] {
  return reports.filter((r) => r.incidentId === incidentId);
}

export function getEmployeesByDepartment(department: Department): Employee[] {
  return employees.filter((e) => e.department === department);
}

export function getIncidentsByDepartment(department: Department): Incident[] {
  return incidents.filter((i) => i.department === department);
}

export function getActiveIncidents(): Incident[] {
  return incidents.filter((i) => i.status !== "Closed");
}

export function getDaysSinceLastIncident(): number {
  const closedIncidents = incidents.filter((i) => i.status === "Closed");
  if (closedIncidents.length === 0) return 0;

  const lastIncident = closedIncidents.sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  )[0];

  const diff = new Date().getTime() - new Date(lastIncident.dateTime).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getOverdueTraining(): {
  employee: Employee;
  assignment: (typeof employees)[0]["trainingAssignments"][0];
  training: TrainingModule;
}[] {
  const result: {
    employee: Employee;
    assignment: (typeof employees)[0]["trainingAssignments"][0];
    training: TrainingModule;
  }[] = [];

  employees.forEach((emp) => {
    emp.trainingAssignments.forEach((assignment) => {
      if (assignment.status === "overdue") {
        const training = getTrainingById(assignment.trainingId);
        if (training) {
          result.push({ employee: emp, assignment, training });
        }
      }
    });
  });

  return result;
}

export function getExpiredCertifications(): {
  employee: Employee;
  certification: (typeof employees)[0]["certifications"][0];
}[] {
  const result: {
    employee: Employee;
    certification: (typeof employees)[0]["certifications"][0];
  }[] = [];

  employees.forEach((emp) => {
    emp.certifications.forEach((cert) => {
      if (cert.status === "expired") {
        result.push({ employee: emp, certification: cert });
      }
    });
  });

  return result;
}

export function getExpiringCertifications(days: number): {
  employee: Employee;
  certification: (typeof employees)[0]["certifications"][0];
}[] {
  const result: {
    employee: Employee;
    certification: (typeof employees)[0]["certifications"][0];
  }[] = [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);

  employees.forEach((emp) => {
    emp.certifications.forEach((cert) => {
      const expDate = new Date(cert.expirationDate);
      if (
        cert.status === "expiring-soon" ||
        (expDate <= cutoff && cert.status !== "expired")
      ) {
        result.push({ employee: emp, certification: cert });
      }
    });
  });

  return result;
}

export function getOutdatedModules(): TrainingModule[] {
  return trainingModules.filter((m) => m.isOutdated);
}

export function getAtRiskEmployees(): Employee[] {
  return employees.filter((e) => {
    const overdueCount = e.trainingAssignments.filter(
      (t) => t.status === "overdue"
    ).length;
    const expiredCerts = e.certifications.filter(
      (c) => c.status === "expired"
    ).length;
    const expiringSoonCerts = e.certifications.filter(
      (c) => c.status === "expiring-soon"
    ).length;
    const incidentCount = e.incidentIds.length;

    return (
      overdueCount >= 3 ||
      expiredCerts > 0 ||
      expiringSoonCerts > 0 ||
      incidentCount >= 2
    );
  });
}

export function getIncidentsByDate(
  year: number,
  month: number,
  day: number
): Incident[] {
  return incidents.filter((incident) => {
    const incidentDate = new Date(incident.dateTime);
    return (
      incidentDate.getFullYear() === year &&
      incidentDate.getMonth() === month - 1 && // month is 1-indexed in the parameter
      incidentDate.getDate() === day
    );
  });
}
