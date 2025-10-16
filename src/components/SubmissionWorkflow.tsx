import React, { useState } from 'react';
import { TabProps, ApprovalStep } from '../types';

const SubmissionWorkflow: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComments, setSubmissionComments] = useState('');

  const canSubmit = () => {
    return requisition.lineItems.length > 0 && 
           requisition.title && 
           requisition.requester && 
           requisition.justification &&
           requisition.approvalStatus === 'Draft';
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      if (requisition.approvalStatus !== 'Draft') {
        alert('This requisition has already been submitted.');
        return;
      }
      alert('Please complete all required fields:\n- Title\n- Requester\n- Justification\n- At least one line item');
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
      alert('✅ Requisition submitted successfully!\n\nYour requisition has been sent to the approvers. You will be notified of any updates.');
    }, 1500);
  };

  const isAlreadySubmitted = requisition.approvalStatus !== 'Draft';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Already Submitted - Show Success */}
      {isAlreadySubmitted && (
        <div className="bg-gradient-to-br from-gray-800 to-black border-4 border-white rounded-2xl p-10 text-center shadow-2xl">
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h2 className="text-4xl font-bold text-white mb-4">Requisition Submitted!</h2>
          <p className="text-xl text-gray-300 mb-6">
            Your requisition has been successfully submitted for approval.
          </p>
          
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-gray-400 text-sm mb-1">Requisition ID</p>
                <p className="text-white font-bold text-lg">{requisition.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Status</p>
                <p className="text-white font-bold text-lg">{requisition.approvalStatus}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                <p className="text-white font-bold text-lg">R{requisition.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Submitted On</p>
                <p className="text-white font-bold text-lg">
                  {requisition.submissionDate?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <p className="text-gray-300 text-sm mb-2">📋 Track your approval progress in the <strong className="text-white">Queue</strong> tab</p>
            <p className="text-gray-300 text-sm">🔔 You'll receive notifications when approvers take action</p>
          </div>
        </div>
      )}

      {/* Not Yet Submitted - Show Submit Form */}
      {!isAlreadySubmitted && (
        <>
          {/* Title Section */}
          <div className="bg-gradient-to-br from-gray-800 to-black border-4 border-white rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">📤 Submit Requisition</h2>
            <p className="text-xl text-gray-300">Review your details and submit for approval</p>
          </div>

          {/* Checklist - Requirements */}
          <div className="bg-gray-900 border-2 border-white rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">✓ Submission Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                requisition.title ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className={`text-2xl ${requisition.title ? 'text-green-400' : 'text-red-400'}`}>
                  {requisition.title ? '✅' : '❌'}
                </div>
                <div>
                  <p className="text-white font-semibold">Requisition Title</p>
                  <p className="text-sm text-gray-300">{requisition.title || 'Not provided'}</p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                requisition.requester ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className={`text-2xl ${requisition.requester ? 'text-green-400' : 'text-red-400'}`}>
                  {requisition.requester ? '✅' : '❌'}
                </div>
                <div>
                  <p className="text-white font-semibold">Requester Name</p>
                  <p className="text-sm text-gray-300">{requisition.requester || 'Not provided'}</p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                requisition.justification ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className={`text-2xl ${requisition.justification ? 'text-green-400' : 'text-red-400'}`}>
                  {requisition.justification ? '✅' : '❌'}
                </div>
                <div>
                  <p className="text-white font-semibold">Justification</p>
                  <p className="text-sm text-gray-300">{requisition.justification ? 'Provided' : 'Not provided'}</p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                requisition.lineItems.length > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className={`text-2xl ${requisition.lineItems.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {requisition.lineItems.length > 0 ? '✅' : '❌'}
                </div>
                <div>
                  <p className="text-white font-semibold">Line Items</p>
                  <p className="text-sm text-gray-300">{requisition.lineItems.length} item(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-gray-900 border-2 border-white rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">📊 Requisition Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">{requisition.lineItems.length}</div>
                <div className="text-gray-300">Line Items</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">R{requisition.totalAmount.toLocaleString()}</div>
                <div className="text-gray-300">Total Amount</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">{requisition.attachments.length}</div>
                <div className="text-gray-300">Documents</div>
              </div>
            </div>
          </div>

          {/* Approval Flow Preview */}
          <div className="bg-gray-900 border-2 border-white rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🔄 Approval Flow</h3>
            <p className="text-gray-300 mb-4">Based on your total amount of <strong className="text-white">R{requisition.totalAmount.toLocaleString()}</strong>, your requisition will be routed through:</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-4">
                <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Finance Approval - Lebone</p>
                  <p className="text-sm text-gray-400">All requisitions require finance approval</p>
                </div>
              </div>

              {requisition.totalAmount > 10000 && (
                <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-4">
                  <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">COO Approval - Sabelo Msiza</p>
                    <p className="text-sm text-gray-400">Required for amounts over R10,000</p>
                  </div>
                </div>
              )}

              {requisition.totalAmount > 50000 && (
                <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-4">
                  <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">CFO Approval - Joan</p>
                    <p className="text-sm text-gray-400">Required for amounts over R50,000</p>
                  </div>
                </div>
              )}

              {requisition.totalAmount > 100000 && (
                <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-4">
                  <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">CEO Approval - Doctor Motswadiri</p>
                    <p className="text-sm text-gray-400">Required for amounts over R100,000</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-900 border-2 border-white rounded-xl p-6">
            <label className="block text-xl font-bold text-white mb-3">💬 Additional Comments (Optional)</label>
            <textarea
              value={submissionComments}
              onChange={(e) => setSubmissionComments(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Add any additional information for the approvers..."
              rows={4}
            />
          </div>

          {/* HUGE SUBMIT BUTTON */}
          <div className="bg-gradient-to-br from-gray-800 to-black border-4 border-white rounded-2xl p-12">
            <div className="text-center space-y-6">
              {canSubmit() ? (
                <>
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-3xl font-bold text-white mb-2">Ready to Submit!</h3>
                  <p className="text-xl text-gray-300 mb-6">All requirements have been met</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-3xl font-bold text-white mb-2">Complete Required Fields</h3>
                  <p className="text-xl text-gray-300 mb-6">Please fill in all required information above</p>
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className={`w-full py-8 rounded-2xl font-bold text-3xl transition-all transform hover:scale-105 ${
                  canSubmit() && !isSubmitting
                    ? 'bg-white hover:bg-gray-200 text-black shadow-2xl cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? '⏳ Submitting...' : '📤 SUBMIT FOR APPROVAL'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubmissionWorkflow;
