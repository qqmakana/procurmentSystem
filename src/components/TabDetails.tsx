import React from 'react';
import { TabProps } from '../types';

const TabDetails: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const handleInputChange = (field: keyof typeof requisition, value: string | number) => {
    const updates: Partial<typeof requisition> = { [field]: value };
    
    // Handle date conversion
    if (field === 'dateRequested' && typeof value === 'string') {
      updates.dateRequested = new Date(value);
    }
    
    // Auto-calculate total amount
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value as number : requisition.quantity;
      const unitPrice = field === 'unitPrice' ? value as number : requisition.unitPrice;
      updates.totalAmount = quantity * unitPrice;
    }
    
    updateRequisition(updates);
  };

  return (
    <div className="space-y-8">
      <div className="bg-black border-2 border-white rounded-2xl p-4 shadow-2xl animate-fadeIn relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl animate-float relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
              <svg className="w-5 h-5 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-white animate-slideUp">Requisition Details</h3>
              <p className="text-white font-semibold text-sm animate-fadeIn">
                Complete all required information for your procurement request
              </p>
            </div>
          </div>
          <div className="bg-black rounded-xl p-3 border border-white">
            <p className="text-white text-sm font-semibold leading-relaxed">
              ✨ Once submitted, this requisition will be sent for approval and the PO/Invoice tabs will become available.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Requisition Title *
            </label>
            <input
              type="text"
              value={requisition.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input-field"
              placeholder="e.g., Office Supplies for Q1 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Requester Name *
            </label>
            <input
              type="text"
              value={requisition.requester}
              onChange={(e) => handleInputChange('requester', e.target.value)}
              className="input-field"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Department *
            </label>
            <select
              value={requisition.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="input-field"
            >
              <option value="">Select Department</option>
              <option value="Finance">Finance</option>
              <option value="HR">Human Resources</option>
              <option value="IT">Information Technology</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Date *
            </label>
            <input
              type="date"
              value={requisition.dateRequested.toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('dateRequested', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Description *
            </label>
            <textarea
              value={requisition.itemDescription}
              onChange={(e) => handleInputChange('itemDescription', e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Detailed description of items needed..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justification *
            </label>
            <textarea
              value={requisition.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Why is this purchase necessary?"
            />
          </div>
        </div>
      </div>

      <div className="bg-black border border-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Cost Information</h4>
            <p className="text-white font-medium text-sm">Enter quantity and unit price for automatic calculation</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              value={requisition.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              className="input-field"
              placeholder="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Unit Price ($) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={requisition.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Total Amount
            </label>
            <div className="input-field bg-black text-white font-bold text-lg border-white">
              ${requisition.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Status: <span className="font-semibold text-white">{requisition.approvalStatus}</span>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => updateRequisition({ approvalStatus: 'Draft' })}
            className="btn-secondary"
          >
            Save as Draft
          </button>
          <button
            onClick={() => updateRequisition({ approvalStatus: 'Submitted' })}
            className="btn-primary"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabDetails;
