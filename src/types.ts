export interface Attachment {
  id: string;
  fileName: string;
  fileType: 'PO' | 'Invoice' | 'Supporting' | 'Other';
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string; // data URL
  fileSize: number;
}

export type ApprovalStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Pending Finance' | 'Pending COO' | 'Pending CFO' | 'Pending CEO' | 'Pending Documents';

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
  approver: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedAt?: Date;
  rejectedAt?: Date;
  comments?: string;
}

export interface TabProps {
  requisition: Requisition;
  updateRequisition: (updates: Partial<Requisition>) => void;
}
