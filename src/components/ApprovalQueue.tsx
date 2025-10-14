import React, { useState } from 'react';
import { Requisition, User } from '../types';

interface ApprovalQueueProps {
  currentUser: User;
  requisitions: Requisition[];
  onApprove: (requisitionId: string, stepId: string, comments?: string) => void;
  onReject: (requisitionId: string, stepId: string, comments: string) => void;
  onViewDetails?: (requisitionId: string) => void;
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  currentUser,
  requisitions,
  onApprove,
  onReject
}) => {
  const [selectedRequisition, setSelectedRequisition] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [expandedRequisitions, setExpandedRequisitions] = useState<Set<string>>(new Set());

  const toggleExpanded = (reqId: string) => {
    const newExpanded = new Set(expandedRequisitions);
    if (newExpanded.has(reqId)) {
      newExpanded.delete(reqId);
    } else {
      newExpanded.add(reqId);
    }
    setExpandedRequisitions(newExpanded);
  };

  // Filter requisitions based on current user's role and status
  const getPendingRequisitions = () => {
    return requisitions.filter(req => {
      const hasPendingStep = req.approvalSteps?.some(step => 
        step.status === 'Pending' && 
        (step.level === currentUser.role || currentUser.role === 'Admin') &&
        step.approver === currentUser.name
      );
      
      if (filterStatus === 'pending') return hasPendingStep;
      if (filterStatus === 'approved') return req.approvalStatus === 'Approved';
      if (filterStatus === 'rejected') return req.approvalStatus === 'Rejected';
      return true;
    });
  };

  const getRequisitionStatus = (req: Requisition) => {
    if (req.approvalStatus === 'Approved') return { status: 'Approved', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
    if (req.approvalStatus === 'Rejected') return { status: 'Rejected', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    if (req.approvalStatus?.includes('Pending')) return { status: 'Pending', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    return { status: 'Draft', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
  };

  const getPriorityText = (amount: number) => {
    if (amount > 100000) return '🔴 High Priority';
    if (amount > 50000) return '🟠 Medium Priority';
    if (amount > 10000) return '🟡 Low Priority';
    return '🔵 Standard';
  };

  const handleAction = (action: 'approve' | 'reject', requisitionId: string, stepId: string) => {
    if (action === 'reject' && !comments.trim()) {
      alert('Please provide comments for rejection.');
      return;
    }
    
    if (action === 'approve') {
      onApprove(requisitionId, stepId, comments.trim() || undefined);
    } else {
      onReject(requisitionId, stepId, comments);
    }
    
    setComments('');
    setSelectedRequisition(null);
  };

  const pendingRequisitions = getPendingRequisitions();

  // Count items specifically for this user
  const myPendingCount = requisitions.filter(req => 
    req.approvalSteps?.some(step => 
      step.status === 'Pending' && 
      step.approver === currentUser.name &&
      (step.level === currentUser.role || currentUser.role === 'Admin')
    )
  ).length;

  return (
    <div className="space-y-6">
      {/* Urgent Notification Banner */}
      {myPendingCount > 0 && filterStatus === 'pending' && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-2xl border-2 border-orange-400">
          <div className="flex items-center space-x-4">
            <div className="text-5xl animate-bounce">🔔</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">Action Required!</h3>
              <p className="text-lg">
                You have <strong>{myPendingCount} requisition{myPendingCount > 1 ? 's' : ''}</strong> waiting for your approval as <strong>{currentUser.role}</strong>.
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{myPendingCount}</div>
              <div className="text-orange-100 text-sm">Needs Your Approval</div>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner when no pending items */}
      {myPendingCount === 0 && filterStatus === 'pending' && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">✅</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">All Caught Up!</h3>
              <p className="text-lg">
                Great work! You have no pending approvals at the moment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Approval Queue</h2>
            <p className="text-gray-300">Review and approve pending requisitions</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{pendingRequisitions.length}</div>
            <div className="text-gray-300">Items in Queue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-black border-2 border-white rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-gray-900 border-2 border-white rounded-lg px-3 py-2 text-white"
            >
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Items</option>
            </select>
          </div>
          <div className="text-gray-300">
            Showing {pendingRequisitions.length} of {requisitions.length} requisitions
          </div>
        </div>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {pendingRequisitions.length === 0 ? (
          <div className="bg-black border-2 border-white rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Pending Items</h3>
            <p className="text-gray-300">All requisitions have been processed or no items match your filter.</p>
          </div>
        ) : (
          pendingRequisitions.map((req) => {
            const status = getRequisitionStatus(req);
            const priorityText = getPriorityText(req.totalAmount);
            const pendingStep = req.approvalSteps?.find(step => 
              step.status === 'Pending' && 
              (step.level === currentUser.role || currentUser.role === 'Admin') &&
              step.approver === currentUser.name
            );

            return (
              <div
                key={req.id}
                className="bg-black border-2 border-white rounded-xl p-6 hover:bg-gray-900 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">{req.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                        {status.status}
                      </div>
                      <div className="text-sm text-white/70">{priorityText}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-white/70">Requester</div>
                        <div className="text-white font-medium">{req.requester}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70">Department</div>
                        <div className="text-white font-medium">{req.department}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70">Total Amount</div>
                        <div className="text-white font-medium">R{req.totalAmount.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-white/70">Line Items</div>
                        <div className="text-white font-medium">{req.lineItems.length} items</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70">Documents</div>
                        <div className="text-white font-medium">{req.attachments.length} files</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70">Date Requested</div>
                        <div className="text-white font-medium">{req.dateRequested.toLocaleDateString()}</div>
                      </div>
                    </div>

                    {req.justification && (
                      <div className="mb-4">
                        <div className="text-sm text-white/70 mb-1">Justification</div>
                        <div className="text-white text-sm bg-white/10 rounded-lg p-3">
                          {req.justification}
                        </div>
                      </div>
                    )}

                    {/* Line Items Preview */}
                    {expandedRequisitions.has(req.id) && (
                      <div className="mb-4">
                        <div className="text-sm text-white/70 mb-2">Line Items</div>
                        <div className="space-y-2">
                          {req.lineItems.map((item, index) => (
                            <div key={item.id} className="bg-white/10 rounded-lg p-3">
                              <div className="flex justify-between items-center">
                                <div className="text-white font-medium">
                                  #{index + 1} {item.description}
                                </div>
                                <div className="text-white/70">
                                  {item.quantity} × R{item.unitPrice.toLocaleString()} = R{item.totalAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Supporting Documents Preview */}
                    {req.attachments.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-white/70 mb-2 flex items-center space-x-2">
                          <span>📎 Supporting Documents ({req.attachments.length})</span>
                          <button
                            onClick={() => toggleExpanded(req.id)}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            {expandedRequisitions.has(req.id) ? '▼ Hide' : '▶ Show'}
                          </button>
                        </div>
                        {expandedRequisitions.has(req.id) && (
                          <div className="space-y-2">
                            {req.attachments.map((doc) => (
                              <div key={doc.id} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">📄</div>
                                  <div>
                                    <div className="text-white font-medium text-sm">{doc.fileName}</div>
                                    <div className="text-white/70 text-xs">
                                      {doc.fileType} • Uploaded by {doc.uploadedBy}
                                    </div>
                                  </div>
                                </div>
                                <a
                                  href={doc.fileUrl}
                                  download={doc.fileName}
                                  className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded bg-white/10"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {req.attachments.length === 0 && (
                      <div className="mb-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                          <div className="text-yellow-300 text-sm flex items-center space-x-2">
                            <span>⚠</span>
                            <span>No supporting documents attached to this requisition</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 ml-6">
                    <button
                      onClick={() => toggleExpanded(req.id)}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      {expandedRequisitions.has(req.id) ? '▼ Hide Details' : '▶ View Details'}
                    </button>
                    
                    {pendingStep && (
                      <div className="space-y-2">
                        <div className="text-sm text-white/70 text-center">
                          Your Approval Required
                        </div>
                        <button
                          onClick={() => setSelectedRequisition(req.id)}
                          className="btn-primary text-sm px-4 py-2 w-full"
                        >
                          ✅ Review & Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval Action Modal */}
                {selectedRequisition === req.id && pendingStep && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        {pendingStep.level} Approval Required
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Comments (Optional for approval, required for rejection):
                          </label>
                          <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your comments..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setSelectedRequisition(null);
                              setComments('');
                            }}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAction('approve', req.id, pendingStep.id)}
                            className="btn-success"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleAction('reject', req.id, pendingStep.id)}
                            className="btn-danger"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApprovalQueue;
