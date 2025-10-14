import React, { useState } from 'react';
import { ApprovalStep, User } from '../types';

interface ApprovalWorkflowProps {
  steps: ApprovalStep[];
  currentUser: User;
  onApprove: (stepId: string, comments?: string) => void;
  onReject: (stepId: string, comments: string) => void;
  onSkip: (stepId: string, comments?: string) => void;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  steps,
  currentUser,
  onApprove,
  onReject,
  onSkip
}) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [showComments, setShowComments] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Skipped':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return '✅';
      case 'Rejected':
        return '❌';
      case 'Pending':
        return '⏳';
      case 'Skipped':
        return '⏭️';
      default:
        return '⏸️';
    }
  };

  const canUserApprove = (step: ApprovalStep): boolean => {
    // Check if current user can approve this step
    return step.status === 'Pending' && 
           (currentUser.role === step.level || currentUser.role === 'Admin') &&
           step.approver === currentUser.name;
  };

  const handleAction = (action: 'approve' | 'reject' | 'skip', stepId: string) => {
    if (action === 'reject' && !comments.trim()) {
      alert('Please provide comments for rejection.');
      return;
    }
    
    if (action === 'approve') {
      onApprove(stepId, comments.trim() || undefined);
    } else if (action === 'reject') {
      onReject(stepId, comments);
    } else if (action === 'skip') {
      onSkip(stepId, comments.trim() || undefined);
    }
    
    setComments('');
    setShowComments(false);
    setSelectedStep(null);
  };

  return (
    <div className="bg-white/5 border border-white/20 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Approval Workflow</h3>
        <div className="text-sm text-white/70">
          Current User: {currentUser.name} ({currentUser.role})
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 ${
              canUserApprove(step)
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getStatusIcon(step.status)}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {step.level} Approval
                  </div>
                  <div className="text-sm text-white/70">
                    Approver: {step.approver} ({step.approverEmail})
                  </div>
                  {step.comments && (
                    <div className="text-sm text-white/60 mt-1">
                      Comments: {step.comments}
                    </div>
                  )}
                  {step.approvedAt && (
                    <div className="text-xs text-green-300">
                      Approved: {step.approvedAt.toLocaleDateString()} at {step.approvedAt.toLocaleTimeString()}
                    </div>
                  )}
                  {step.rejectedAt && (
                    <div className="text-xs text-red-300">
                      Rejected: {step.rejectedAt.toLocaleDateString()} at {step.rejectedAt.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(step.status)}`}>
                  {step.status}
                </div>
                
                {canUserApprove(step) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedStep(step.id);
                        setShowComments(true);
                      }}
                      className="btn-success text-sm px-3 py-1"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStep(step.id);
                        setShowComments(true);
                      }}
                      className="btn-danger text-sm px-3 py-1"
                    >
                      ❌ Reject
                    </button>
                    {step.level !== 'CEO' && (
                      <button
                        onClick={() => {
                          setSelectedStep(step.id);
                          setShowComments(true);
                        }}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        ⏭️ Skip
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            {selectedStep === step.id && showComments && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white/80">
                    Comments (Optional for approval, required for rejection):
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your comments..."
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowComments(false);
                        setSelectedStep(null);
                        setComments('');
                      }}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAction('approve', step.id)}
                      className="btn-success text-sm px-4 py-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction('reject', step.id)}
                      className="btn-danger text-sm px-4 py-2"
                    >
                      Reject
                    </button>
                    {step.level !== 'CEO' && (
                      <button
                        onClick={() => handleAction('skip', step.id)}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workflow Summary */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {steps.filter(s => s.status === 'Approved').length}
            </div>
            <div className="text-sm text-white/70">Approved</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {steps.filter(s => s.status === 'Pending').length}
            </div>
            <div className="text-sm text-white/70">Pending</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {steps.filter(s => s.status === 'Rejected').length}
            </div>
            <div className="text-sm text-white/70">Rejected</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {steps.filter(s => s.status === 'Skipped').length}
            </div>
            <div className="text-sm text-white/70">Skipped</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;