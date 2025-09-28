import React from 'react';
import { Requisition, ApprovalStep } from '../types';

interface ApprovalWorkflowProps {
  requisition: Requisition;
  onApprovalAction: (action: 'approve' | 'reject', stepIndex: number, comments?: string) => void;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ requisition, onApprovalAction }) => {
  const getApprovalSteps = (amount: number): ApprovalStep[] => {
    if (amount <= 10000) {
      return [
        { approver: 'Finance Manager', status: 'Pending', comments: '' }
      ];
    } else if (amount <= 50000) {
      return [
        { approver: 'Chief Operations Officer', status: 'Pending', comments: '' },
        { approver: 'CFO', status: 'Pending', comments: '' }
      ];
    } else {
      return [
        { approver: 'Chief Operations Officer', status: 'Pending', comments: '' },
        { approver: 'CFO', status: 'Pending', comments: '' },
        { approver: 'Group CEO', status: 'Pending', comments: '' }
      ];
    }
  };

  const steps = getApprovalSteps(requisition.totalAmount);
  const currentStepIndex = requisition.currentApprovalStep || 0;
  const currentStep = steps[currentStepIndex];

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'pending' => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-black border border-white rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">Approval Workflow</h4>
          <p className="text-white font-medium text-sm">
            Track the approval progress for R{requisition.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isCurrentStep = status === 'current';
          
          return (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-white border-black'
                  : isCurrentStep
                  ? 'bg-black border-white animate-pulse'
                  : 'bg-black border-white'
              }`}
            >
              {getStatusIcon(status)}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${
                      status === 'completed' ? 'text-black' : 
                      isCurrentStep ? 'text-white' : 'text-white'
                    }`}>
                      {step.approver}
                    </p>
                    <p className={`text-sm ${
                      status === 'completed' ? 'text-black' : 
                      isCurrentStep ? 'text-white' : 'text-white'
                    }`}>
                      {status === 'completed' ? 'Approved' : 
                       isCurrentStep ? 'Awaiting Approval' : 'Pending'}
                    </p>
                  </div>
                  
                  {isCurrentStep && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onApprovalAction('approve', index)}
                        className="bg-white hover:bg-gray-100 text-black border-2 border-black px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          const comments = prompt('Rejection reason (optional):');
                          onApprovalAction('reject', index, comments || '');
                        }}
                        className="bg-black hover:bg-gray-800 text-white border-2 border-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {step.comments && (
                  <div className="mt-2 p-2 bg-white border border-black rounded text-sm text-black">
                    <strong>Comments:</strong> {step.comments}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white border border-black rounded-xl">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-black font-semibold text-sm">
            {requisition.approvalStatus === 'Approved' 
              ? '✅ All approvals completed! You can now create the PO.'
              : `⏳ Waiting for ${currentStep?.approver} approval...`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;

