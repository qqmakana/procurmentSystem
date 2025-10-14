export interface Attachment {
  id: string;
  fileName: string;
  fileType: 'PO' | 'Invoice' | 'Supporting' | 'Other';
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string; // data URL
  fileSize: number;
}

export type ApprovalStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Pending Finance' | 'Pending COO' | 'Pending CFO' | 'Pending CEO' | 'Pending Documents' | 'Under Review' | 'Returned for Revision';

export type UserRole = 'Requester' | 'Finance' | 'COO' | 'CFO' | 'CEO' | 'Admin';
export type ApprovalLevel = 'Finance' | 'COO' | 'CFO' | 'CEO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  permissions: string[];
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface Requisition {
  id: string;
  title: string;
  requester: string;
  department: string;
  dateRequested: Date;
  justification: string;
  lineItems: LineItem[];
  totalAmount: number;
  approvalStatus: ApprovalStatus;
  poNumber?: string;
  poIssuedDate?: Date;
  invoiceNumber?: string;
  invoiceReceivedDate?: Date;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  autoSubmitted?: boolean;
  approver?: string;
  submissionDate?: Date;
  approvalSteps?: ApprovalStep[];
  currentApprovalStep?: number;
}

export interface ApprovalRule {
  maxAmount: number;
  approvers: string[];
  title: string;
  description: string;
  autoSubmit: boolean;
}

export interface ApprovalStep {
  id: string;
  level: ApprovalLevel;
  approver: string;
  approverEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Skipped';
  approvedAt?: Date;
  rejectedAt?: Date;
  comments?: string;
  attachments?: string[];
  isRequired: boolean;
  order: number;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  maxAmount: number;
  steps: ApprovalStep[];
  isActive: boolean;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: string;
}

export interface TabProps {
  requisition: Requisition;
  updateRequisition: (updates: Partial<Requisition>) => void;
}
