export interface Attachment {
  id: string;
  fileName: string;
  fileType: 'PO' | 'Invoice' | 'Supporting' | 'Other';
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string; // data URL
  fileSize: number;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type ApprovalStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export interface ApprovalStep {
  id: string;
  approverRole: 'Finance' | 'COO' | 'CFO' | 'CEO';
  approverName?: string;
  approverEmail?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comments?: string;
  approvedAt?: Date;
  order: number;
}

export interface Requisition {
  id: string;
  title: string;
  requester: string;
  requesterEmail?: string;
  department: string;
  dateRequested: Date;
  justification: string;
  lineItems: LineItem[];
  totalAmount: number;
  approvalStatus: ApprovalStatus;
  approvalSteps?: ApprovalStep[];
  currentApprovalStep?: number;
  poNumber?: string;
  poIssuedDate?: Date;
  invoiceNumber?: string;
  invoiceReceivedDate?: Date;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TabProps {
  requisition: Requisition;
  updateRequisition: (updates: Partial<Requisition>) => void;
}
