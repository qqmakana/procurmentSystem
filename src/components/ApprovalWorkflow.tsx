import React, { useState } from 'react';
import { TabProps, ApprovalStep } from '../types';

interface ApprovalWorkflowProps extends TabProps {
  currentUserEmail: string;
  currentUserName: string;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ 
  requisition, 
  updateRequisition,
  currentUserEmail,
  currentUserName
}) => {
  const [comments, setComments] = useState('');

  // Get user role from email
  const getUserRole = (email: string): 'Finance' | 'COO' | 'CFO' | 'CEO' | 'Admin' | 'Other' => {
    if (email === 'lebone@dm-mineralsgroup.com') return 'Finance';
    if (email === 'sabelo@dm-mineralsgroup.com') return 'COO';
    if (email === 'joan@dm-mineralsgroup.com') return 'CFO';
    if (email === 'doctor@dm-mineralsgroup.com') return 'CEO';
    if (email === 'solarcouple@gmail.com') return 'Admin';
    return 'Other';
  };

  const currentUserRole = getUserRole(currentUserEmail);

  // Initialize approval steps if not exists
  if (!requisition.approvalSteps || requisition.approvalSteps.length === 0) {
    const initialSteps: ApprovalStep[] = [
      { id: '1', approverRole: 'Finance', status: 'Pending', order: 1 },
      { id: '2', approverRole: 'COO', status: 'Pending', order: 2 },
      { id: '3', approverRole: 'CFO', status: 'Pending', order: 3 },
      { id: '4', approverRole: 'CEO', status: 'Pending', order: 4 },
    ];
    
    updateRequisition({
      approvalSteps: initialSteps,
      currentApprovalStep: 1
    });
  }

  const handleApprove = () => {
    if (!requisition.approvalSteps) return;

    const currentStep = requisition.currentApprovalStep || 1;
    const updatedSteps = requisition.approvalSteps.map(step => {
      if (step.order === currentStep) {
        return {
          ...step,
          status: 'Approved' as const,
          approverName: currentUserName,
          approverEmail: currentUserEmail,
          comments: comments,
          approvedAt: new Date()
        };
      }
      return step;
    });

    const allApproved = updatedSteps.every(step => step.status === 'Approved');

    updateRequisition({
      approvalSteps: updatedSteps,
      currentApprovalStep: allApproved ? currentStep : currentStep + 1,
      approvalStatus: allApproved ? 'Approved' : 'Submitted'
    });

    setComments('');
  };

  const handleReject = () => {
    if (!requisition.approvalSteps) return;

    const currentStep = requisition.currentApprovalStep || 1;
    const updatedSteps = requisition.approvalSteps.map(step => {
      if (step.order === currentStep) {
        return {
          ...step,
          status: 'Rejected' as const,
          approverName: currentUserName,
          approverEmail: currentUserEmail,
          comments: comments,
          approvedAt: new Date()
        };
      }
      return step;
    });

    updateRequisition({
      approvalSteps: updatedSteps,
      approvalStatus: 'Rejected'
    });

    setComments('');
  };

  const canApprove = () => {
    if (!requisition.approvalSteps) return false;
    
    // Prevent self-approval: If user submitted the requisition, they cannot approve it
    if (requisition.requesterEmail === currentUserEmail) {
      return false;
    }
    
    if (currentUserRole === 'Admin') return true; // Admin can override (unless they submitted it)
    
    const currentStep = requisition.currentApprovalStep || 1;
    const step = requisition.approvalSteps.find(s => s.order === currentStep);
    
    return step && step.approverRole === currentUserRole && step.status === 'Pending';
  };

  const getStepStatus = (step: ApprovalStep) => {
    if (step.status === 'Approved') {
      return {
        icon: '✓',
        color: 'bg-green-500 border-green-500',
        textColor: 'text-green-500',
        label: 'Approved'
      };
    }
    if (step.status === 'Rejected') {
      return {
        icon: '✗',
        color: 'bg-red-500 border-red-500',
        textColor: 'text-red-500',
        label: 'Rejected'
      };
    }
    if (step.order === requisition.currentApprovalStep) {
      return {
        icon: step.order,
        color: 'bg-yellow-500 border-yellow-500 animate-pulse',
        textColor: 'text-yellow-500',
        label: 'Awaiting Approval'
      };
    }
    return {
      icon: step.order,
      color: 'bg-white/20 border-white/40',
      textColor: 'text-white/50',
      label: 'Pending'
    };
  };

  if (!requisition.approvalSteps) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Sequential Approval Workflow</h3>
            <p className="text-white font-semibold">
              Requisition ID: <span className="font-mono">{requisition.id}</span>
            </p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/30">
          <p className="text-white text-sm font-medium">
            <span className="font-bold">Current User:</span> {currentUserName} ({currentUserRole})
          </p>
          <p className="text-white text-sm font-medium mt-1">
            <span className="font-bold">Total Amount:</span> R{requisition.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Approval Steps Progress */}
      <div className="bg-black border-2 border-white rounded-2xl p-8 shadow-2xl">
        <h4 className="text-xl font-black text-white mb-8">Approval Progress</h4>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-white/20" style={{zIndex: 0}}></div>
          
          {/* Steps */}
          <div className="relative grid grid-cols-4 gap-4" style={{zIndex: 1}}>
            {requisition.approvalSteps.map((step, index) => {
              const status = getStepStatus(step);
              return (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`w-12 h-12 rounded-full border-4 ${status.color} flex items-center justify-center font-black text-lg text-black bg-opacity-100 shadow-lg mb-3`}>
                    {status.icon}
                  </div>
                  
                  {/* Step Info */}
                  <div className="text-center">
                    <p className="font-black text-white text-sm mb-1">{step.approverRole}</p>
                    <p className={`text-xs font-semibold ${status.textColor}`}>{status.label}</p>
                    {step.approverName && (
                      <p className="text-xs text-white/70 mt-1">{step.approverName}</p>
                    )}
                    {step.approvedAt && (
                      <p className="text-xs text-white/50 mt-1">
                        {step.approvedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Comments */}
                  {step.comments && (
                    <div className="mt-3 bg-white/5 border border-white/30 rounded-lg p-2 w-full">
                      <p className="text-xs text-white/70 italic">"{step.comments}"</p>
                    </div>
                  )}

                  {/* Arrow */}
                  {requisition.approvalSteps && index < requisition.approvalSteps.length - 1 && (
                    <div className="absolute" style={{left: `${(index + 1) * 25 - 2}%`, top: '20px'}}>
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Approval Actions */}
      {canApprove() && requisition.approvalStatus === 'Submitted' && (
        <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
          <h4 className="text-xl font-black text-white mb-4">Your Action Required</h4>
          <p className="text-white font-semibold mb-6">
            As the {currentUserRole}, you are required to review and approve or reject this requisition.
          </p>

          {/* Requisition Summary */}
          <div className="bg-white/5 border border-white/30 rounded-xl p-4 mb-6">
            <h5 className="font-bold text-white mb-3">Requisition Summary</h5>
            <div className="space-y-2 text-sm">
              <p className="text-white"><span className="font-semibold">Title:</span> {requisition.title}</p>
              <p className="text-white"><span className="font-semibold">Requester:</span> {requisition.requester}</p>
              <p className="text-white"><span className="font-semibold">Department:</span> {requisition.department}</p>
              <p className="text-white"><span className="font-semibold">Total Amount:</span> R{requisition.totalAmount.toFixed(2)}</p>
              <p className="text-white"><span className="font-semibold">Items:</span> {requisition.lineItems.length}</p>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Add any comments or notes about your decision..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleApprove}
              className="btn-primary flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Approve</span>
            </button>
            <button
              onClick={handleReject}
              className="btn-danger flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2 border-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reject</span>
            </button>
          </div>
        </div>
      )}

      {/* Info Message */}
      {!canApprove() && requisition.approvalStatus === 'Submitted' && (
        <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-yellow-500 font-bold">
                {requisition.requesterEmail === currentUserEmail ? (
                  "You cannot approve your own requisition. Awaiting approval from another approver."
                ) : (
                  `This requisition is awaiting approval from ${requisition.approvalSteps?.find(s => s.order === requisition.currentApprovalStep)?.approverRole || 'the next approver'}.`
                )}
              </p>
              {requisition.requesterEmail && (
                <p className="text-yellow-500/70 text-sm mt-2">
                  Submitted by: {requisition.requester} ({requisition.requesterEmail})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {requisition.approvalStatus === 'Approved' && (
        <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-500 font-bold text-lg">
              ✓ This requisition has been fully approved by all approvers!
            </p>
          </div>
        </div>
      )}

      {requisition.approvalStatus === 'Rejected' && (
        <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-500 font-bold text-lg">
              ✗ This requisition has been rejected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;

