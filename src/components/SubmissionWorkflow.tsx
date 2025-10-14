import React, { useState } from 'react';
import { TabProps, ApprovalStep } from '../types';

const SubmissionWorkflow: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComments, setSubmissionComments] = useState('');

  const canSubmit = () => {
    return requisition.lineItems.length > 0 && 
           requisition.title && 
           requisition.requester && 
           requisition.justification;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      alert('Please complete all required fields and add at least one line item before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Create approval steps based on amount
    const approvalSteps: ApprovalStep[] = [];
    
    // Always start with Finance
    approvalSteps.push({
      id: 'finance-step',
      level: 'Finance',
      approver: 'Lebone',
      approverEmail: 'lebone@dm-mineralsgroup.com',
      status: 'Pending',
      isRequired: true,
      order: 1
    });

    // Add COO for amounts over R10,000
    if (requisition.totalAmount > 10000) {
      approvalSteps.push({
        id: 'coo-step',
        level: 'COO',
        approver: 'Sabelo Msiza',
        approverEmail: 'sabelo@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 2
      });
    }

    // Add CFO for amounts over R50,000
    if (requisition.totalAmount > 50000) {
      approvalSteps.push({
        id: 'cfo-step',
        level: 'CFO',
        approver: 'Joan',
        approverEmail: 'joan@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 3
      });
    }

    // Add CEO for amounts over R100,000
    if (requisition.totalAmount > 100000) {
      approvalSteps.push({
        id: 'ceo-step',
        level: 'CEO',
        approver: 'Doctor Motswadiri',
        approverEmail: 'doctor@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 4
      });
    }

    // Update requisition status
    updateRequisition({
      approvalStatus: 'Pending Finance',
      approvalSteps: approvalSteps,
      submissionDate: new Date(),
      autoSubmitted: false
    });

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Requisition submitted successfully! You will be notified of approval status updates.');
    }, 2000);
  };

  const getSubmissionStatus = () => {
    if (requisition.approvalStatus === 'Draft') return 'Draft';
    if (requisition.approvalStatus === 'Pending Finance') return 'Pending Finance Review';
    if (requisition.approvalStatus === 'Pending COO') return 'Pending COO Review';
    if (requisition.approvalStatus === 'Pending CFO') return 'Pending CFO Review';
    if (requisition.approvalStatus === 'Pending CEO') return 'Pending CEO Review';
    if (requisition.approvalStatus === 'Approved') return 'Approved';
    if (requisition.approvalStatus === 'Rejected') return 'Rejected';
    return 'Unknown';
  };

  const getStatusColor = () => {
    const status = getSubmissionStatus();
    if (status === 'Approved') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (status === 'Rejected') return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (status.includes('Pending')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Submission Status */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Submission Status</h2>
            <p className="text-blue-100">Track your requisition through the approval process</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor()}`}>
              {getSubmissionStatus()}
            </div>
            {requisition.submissionDate && (
              <div className="text-sm text-blue-100 mt-2">
                Submitted: {requisition.submissionDate.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Requirements */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Submission Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                requisition.title ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {requisition.title ? '✓' : '○'}
              </div>
              <span className="text-white">Requisition Title</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                requisition.requester ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {requisition.requester ? '✓' : '○'}
              </div>
              <span className="text-white">Requester Name</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                requisition.justification ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {requisition.justification ? '✓' : '○'}
              </div>
              <span className="text-white">Justification</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                requisition.lineItems.length > 0 ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {requisition.lineItems.length > 0 ? '✓' : '○'}
              </div>
              <span className="text-white">Line Items ({requisition.lineItems.length})</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                requisition.totalAmount > 0 ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {requisition.totalAmount > 0 ? '✓' : '○'}
              </div>
              <span className="text-white">Total Amount: R{requisition.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                requisition.attachments.length > 0 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {requisition.attachments.length > 0 ? '✓' : '○'}
              </div>
              <span className="text-white">Supporting Documents ({requisition.attachments.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Workflow Preview */}
      {requisition.approvalSteps && requisition.approvalSteps.length > 0 && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Approval Workflow</h3>
          <div className="space-y-4">
            {requisition.approvalSteps.map((step) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'Approved' ? 'bg-green-500/20 text-green-300' :
                    step.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                    step.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {step.status === 'Approved' ? '✓' :
                     step.status === 'Rejected' ? '✗' :
                     step.status === 'Pending' ? '⏳' : '○'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{step.level} Approval</div>
                  <div className="text-sm text-white/70">
                    {step.approver} ({step.approverEmail})
                  </div>
                  {step.comments && (
                    <div className="text-sm text-white/60 mt-1">
                      Comments: {step.comments}
                    </div>
                  )}
                </div>
                <div className="text-sm text-white/70">
                  {step.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Form */}
      {requisition.approvalStatus === 'Draft' && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Submit for Approval</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={submissionComments}
                onChange={(e) => setSubmissionComments(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional comments for the approvers..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-white/70">
                {canSubmit() ? (
                  <span className="text-green-300">✓ Ready to submit</span>
                ) : (
                  <span className="text-yellow-300">⚠ Complete required fields first</span>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  canSubmit() && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Summary */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Submission Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{requisition.lineItems.length}</div>
            <div className="text-sm text-white/70">Line Items</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">R{requisition.totalAmount.toLocaleString()}</div>
            <div className="text-sm text-white/70">Total Amount</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{requisition.attachments.length}</div>
            <div className="text-sm text-white/70">Documents</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionWorkflow;
