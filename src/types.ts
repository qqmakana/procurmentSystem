export interface Attachment {
  id: string;
  fileName: string;
  fileType: 'PO' | 'Invoice' | 'Supporting' | 'Other';
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string; // data URL
  fileSize: number;
}

export type ApprovalStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export interface Requisition {
  id: string;
  title: string;
  requester: string;
  department: string;
  dateRequested: Date;
  justification: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  approvalStatus: ApprovalStatus;
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
