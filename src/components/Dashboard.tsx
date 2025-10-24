import React from 'react';
import { Requisition } from '../types';

interface DashboardProps {
  requisition: Requisition;
  currentUserEmail: string;
  currentUserName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ requisition, currentUserEmail, currentUserName }) => {
  
  // Get user role from email
  const getUserRole = (email: string): 'Finance' | 'COO' | 'CFO' | 'CEO' | 'Admin' | 'Requester' => {
    if (email === 'lebone@dm-mineralsgroup.com') return 'Finance';
    if (email === 'sabelo@dm-mineralsgroup.com') return 'COO';
    if (email === 'joan@dm-mineralsgroup.com') return 'CFO';
    if (email === 'doctor@dm-mineralsgroup.com') return 'CEO';
    if (email === 'solarcouple@gmail.com') return 'Admin';
    return 'Requester';
  };

  const currentUserRole = getUserRole(currentUserEmail);
  const isRequester = requisition.requesterEmail === currentUserEmail;
  const isApprover = ['Finance', 'COO', 'CFO', 'CEO', 'Admin'].includes(currentUserRole);

  // Check if current user needs to approve
  const needsMyApproval = () => {
    if (!requisition.approvalSteps || requisition.approvalStatus !== 'Submitted') return false;
    if (isRequester) return false; // Requester cannot approve their own
    
    const currentStep = requisition.currentApprovalStep || 1;
    const step = requisition.approvalSteps.find(s => s.order === currentStep);
    
    return step && step.approverRole === currentUserRole && step.status === 'Pending';
  };

  const getCurrentStage = () => {
    if (!requisition.approvalSteps) return null;
    const currentStep = requisition.currentApprovalStep || 1;
    return requisition.approvalSteps.find(s => s.order === currentStep);
  };

  const getApprovedCount = () => {
    if (!requisition.approvalSteps) return 0;
    return requisition.approvalSteps.filter(s => s.status === 'Approved').length;
  };

  const currentStage = getCurrentStage();
  const approvedCount = getApprovedCount();
  const totalSteps = requisition.approvalSteps?.length || 4;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-3xl font-black text-black">
              {currentUserName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Welcome, {currentUserName}!</h2>
            <p className="text-white font-semibold">Role: {currentUserRole}</p>
          </div>
        </div>
      </div>

      {/* For Approvers - Action Required */}
      {isApprover && needsMyApproval() && (
        <div className="bg-yellow-500 border-2 border-yellow-600 rounded-2xl p-6 shadow-2xl animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-black">⚠️ ACTION REQUIRED</h3>
              <p className="text-black font-bold">
                You have a requisition waiting for your approval!
              </p>
            </div>
            <a href="#approval" onClick={() => {
              const tab = document.querySelector('[data-tab="approval"]') as HTMLElement;
              if (tab) tab.click();
            }} className="bg-black text-yellow-500 font-black px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg">
              Review Now →
            </a>
          </div>
        </div>
      )}

      {/* For Approvers - No Action Needed */}
      {isApprover && !needsMyApproval() && requisition.approvalStatus === 'Submitted' && !isRequester && (
        <div className="bg-blue-500/10 border-2 border-blue-500 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-black text-blue-500">No Action Required</h3>
              <p className="text-blue-500 font-semibold">
                Currently awaiting approval from: {currentStage?.approverRole || 'another approver'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Requisition Status Card */}
      <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Requisition Status
        </h3>

        {/* Requisition Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/30 rounded-xl p-4">
            <p className="text-white/70 text-sm font-semibold mb-1">Requisition ID</p>
            <p className="text-white font-black text-lg font-mono">{requisition.id}</p>
          </div>
          <div className="bg-white/5 border border-white/30 rounded-xl p-4">
            <p className="text-white/70 text-sm font-semibold mb-1">Status</p>
            <p className={`font-black text-lg ${
              requisition.approvalStatus === 'Approved' ? 'text-green-500' :
              requisition.approvalStatus === 'Submitted' ? 'text-yellow-500' :
              requisition.approvalStatus === 'Rejected' ? 'text-red-500' :
              'text-white'
            }`}>
              {requisition.approvalStatus}
            </p>
          </div>
          <div className="bg-white/5 border border-white/30 rounded-xl p-4">
            <p className="text-white/70 text-sm font-semibold mb-1">Total Amount</p>
            <p className="text-white font-black text-xl">R{requisition.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 border border-white/30 rounded-xl p-4">
            <p className="text-white/70 text-sm font-semibold mb-1">Line Items</p>
            <p className="text-white font-black text-xl">{requisition.lineItems.length}</p>
          </div>
        </div>

        {/* For Requesters - Show Progress */}
        {isRequester && requisition.approvalStatus === 'Submitted' && (
          <div className="bg-white/5 border border-white/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-black text-white">Your Requisition Progress</h4>
              <span className="text-white font-bold">{approvedCount} of {totalSteps} approvals</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(approvedCount / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Stage Info */}
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-black font-black">{requisition.currentApprovalStep}</span>
                </div>
                <div>
                  <p className="text-yellow-500 font-bold">Currently with: {currentStage?.approverRole || 'Processing'}</p>
                  <p className="text-yellow-500/70 text-sm">Awaiting their approval</p>
                </div>
              </div>
            </div>

            {/* Approval Steps Details */}
            <div className="mt-4 space-y-2">
              {requisition.approvalSteps?.map((step) => (
                <div key={step.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  step.status === 'Approved' ? 'bg-green-500/10' :
                  step.order === requisition.currentApprovalStep ? 'bg-yellow-500/10' :
                  'bg-white/5'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step.status === 'Approved' ? 'bg-green-500 text-white' :
                    step.order === requisition.currentApprovalStep ? 'bg-yellow-500 text-black' :
                    'bg-white/20 text-white/50'
                  }`}>
                    {step.status === 'Approved' ? '✓' : step.order}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${
                      step.status === 'Approved' ? 'text-green-500' :
                      step.order === requisition.currentApprovalStep ? 'text-yellow-500' :
                      'text-white/50'
                    }`}>
                      {step.approverRole}
                    </p>
                    {step.approverName && (
                      <p className="text-sm text-white/70">
                        {step.status === 'Approved' ? `Approved by ${step.approverName}` : `Assigned to ${step.approverName}`}
                      </p>
                    )}
                  </div>
                  {step.status === 'Approved' && step.approvedAt && (
                    <p className="text-xs text-white/50">
                      {step.approvedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Status */}
        {requisition.approvalStatus === 'Approved' && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-xl font-black text-green-500">✓ FULLY APPROVED</h4>
                <p className="text-green-500 font-semibold">All approvers have approved this requisition!</p>
              </div>
            </div>
          </div>
        )}

        {/* Rejected Status */}
        {requisition.approvalStatus === 'Rejected' && (
          <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-xl font-black text-red-500">✗ REJECTED</h4>
                <p className="text-red-500 font-semibold">This requisition has been rejected by an approver.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const tab = document.querySelector('[data-tab="details"]') as HTMLElement;
              if (tab) tab.click();
            }}
            className="bg-white/5 hover:bg-white/10 border border-white/30 rounded-xl p-4 text-left transition-all hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="font-bold text-white">Create Requisition</p>
                <p className="text-sm text-white/70">Add items & submit</p>
              </div>
            </div>
          </button>

          {requisition.approvalStatus !== 'Draft' && (
            <button
              onClick={() => {
                const tab = document.querySelector('[data-tab="approval"]') as HTMLElement;
                if (tab) tab.click();
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/30 rounded-xl p-4 text-left transition-all hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold text-white">Approvals</p>
                  <p className="text-sm text-white/70">Track approval status</p>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => {
              const tab = document.querySelector('[data-tab="documents"]') as HTMLElement;
              if (tab) tab.click();
            }}
            className="bg-white/5 hover:bg-white/10 border border-white/30 rounded-xl p-4 text-left transition-all hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <div>
                <p className="font-bold text-white">Documents</p>
                <p className="text-sm text-white/70">Manage attachments</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

