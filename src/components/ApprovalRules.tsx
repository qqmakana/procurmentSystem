import React from 'react';
import { ApprovalRule } from '../types';

interface ApprovalRulesProps {
  amount: number;
  onAutoSubmit: (approver: string) => void;
}

const ApprovalRules: React.FC<ApprovalRulesProps> = ({ amount, onAutoSubmit }) => {
  // Define approval hierarchy based on amount thresholds
  const approvalRules: ApprovalRule[] = [
    {
      maxAmount: 10000,
      approvers: ['Finance Manager'],
      title: 'Finance Manager Approval',
      description: 'Requisitions up to R10,000 require finance manager approval',
      autoSubmit: true
    },
    {
      maxAmount: 50000,
      approvers: ['Chief Operations Officer', 'CFO'],
      title: 'COO → CFO Approval',
      description: 'Requisitions R10,000-R50,000 require COO then CFO approval',
      autoSubmit: false
    },
    {
      maxAmount: Infinity,
      approvers: ['Chief Operations Officer', 'CFO', 'Group CEO'],
      title: 'COO → CFO → CEO Approval',
      description: 'Requisitions over R50,000 require COO, CFO, then Group CEO approval',
      autoSubmit: false
    }
  ];

  // Find the appropriate approval rule for the current amount
  const getApprovalRuleForAmount = (amount: number): ApprovalRule => {
    return approvalRules.find(rule => amount <= rule.maxAmount) || approvalRules[approvalRules.length - 1];
  };

  const currentRule = getApprovalRuleForAmount(amount);
  const isAutoSubmitEligible = amount > 0 && amount <= 10000 && currentRule.autoSubmit; // Auto-submit for amounts up to $10,000

  const handleAutoSubmit = () => {
    if (isAutoSubmitEligible) {
      onAutoSubmit(currentRule.approvers[0]);
    }
  };

  return (
    <div className="bg-black border border-white rounded-2xl p-6 shadow-2xl animate-fadeIn">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Approval Workflow</h3>
          <p className="text-white font-semibold text-sm">Automatic submission based on amount thresholds</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Amount Display */}
        <div className="bg-black border border-white rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-semibold">Current Amount</p>
              <p className="text-2xl font-bold text-white">R{amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">Required Approvers</p>
              <p className="text-lg font-bold text-white">{currentRule.approvers.join(' → ')}</p>
            </div>
          </div>
        </div>

        {/* Auto Submit Button */}
        {isAutoSubmitEligible && (
          <div className="bg-black border border-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Auto-Submit Available</p>
                <p className="text-sm text-white">Amount qualifies for automatic submission</p>
              </div>
              <button
                onClick={handleAutoSubmit}
                className="btn-primary bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                Auto-Submit to {currentRule.approvers[0]}
              </button>
            </div>
          </div>
        )}

        {/* Approval Hierarchy */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-white">Approval Hierarchy</h4>
          {approvalRules.map((rule, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                amount <= rule.maxAmount
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-white border-white/30'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{rule.title}</p>
                  <p className="text-sm opacity-80">{rule.description}</p>
                  <p className="text-xs opacity-60 mt-1">
                    Approvers: {rule.approvers.join(' → ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {rule.maxAmount === Infinity ? 'R50,000+' : `Up to R${rule.maxAmount.toLocaleString()}`}
                  </p>
                  {amount <= rule.maxAmount && (
                    <div className="w-3 h-3 bg-black rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovalRules;
