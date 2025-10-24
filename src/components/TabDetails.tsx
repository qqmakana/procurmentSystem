import React, { useState } from 'react';
import { TabProps, LineItem } from '../types';

interface TabDetailsProps extends TabProps {
  currentUserEmail?: string;
  currentUserName?: string;
}

const TabDetails: React.FC<TabDetailsProps> = ({ requisition, updateRequisition, currentUserEmail, currentUserName }) => {
  const [newItem, setNewItem] = useState<Partial<LineItem>>({
    description: '',
    quantity: 0,
    unitPrice: 0,
  });

  const handleInputChange = (field: keyof typeof requisition, value: string | number) => {
    const updates: Partial<typeof requisition> = { [field]: value };
    
    // Handle date conversion
    if (field === 'dateRequested' && typeof value === 'string') {
      updates.dateRequested = new Date(value);
    }
    
    updateRequisition(updates);
  };

  const addLineItem = () => {
    if (!newItem.description || !newItem.quantity || newItem.quantity <= 0 || !newItem.unitPrice || newItem.unitPrice <= 0) {
      alert('Please fill in all line item fields with valid values');
      return;
    }

    const lineItem: LineItem = {
      id: `ITEM-${Date.now()}`,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: newItem.quantity * newItem.unitPrice,
    };

    const updatedLineItems = [...requisition.lineItems, lineItem];
    const totalAmount = updatedLineItems.reduce((sum, item) => sum + item.totalPrice, 0);

    updateRequisition({
      lineItems: updatedLineItems,
      totalAmount: totalAmount,
    });

    // Reset form
    setNewItem({
      description: '',
      quantity: 0,
      unitPrice: 0,
    });
  };

  const removeLineItem = (id: string) => {
    const updatedLineItems = requisition.lineItems.filter(item => item.id !== id);
    const totalAmount = updatedLineItems.reduce((sum, item) => sum + item.totalPrice, 0);

    updateRequisition({
      lineItems: updatedLineItems,
      totalAmount: totalAmount,
    });
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedLineItems = requisition.lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });

    const totalAmount = updatedLineItems.reduce((sum, item) => sum + item.totalPrice, 0);

    updateRequisition({
      lineItems: updatedLineItems,
      totalAmount: totalAmount,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
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

      {/* Basic Information */}
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
            <label className="block text-sm font-semibold text-white mb-2">
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
            <label className="block text-sm font-semibold text-white mb-2">
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
            <label className="block text-sm font-semibold text-white mb-2">
              Justification *
            </label>
            <textarea
              value={requisition.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              className="input-field h-full resize-none"
              rows={10}
              placeholder="Why is this purchase necessary? Provide detailed business justification..."
            />
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Line Items</h4>
              <p className="text-white font-medium text-sm">Add items to this requisition</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-sm">Total Amount</p>
            <p className="text-3xl font-black text-white">R{requisition.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Existing Line Items Table */}
        {requisition.lineItems.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="text-left py-3 px-4 text-white font-black text-sm">DESCRIPTION</th>
                  <th className="text-center py-3 px-4 text-white font-black text-sm w-32">QUANTITY</th>
                  <th className="text-center py-3 px-4 text-white font-black text-sm w-32">UNIT PRICE</th>
                  <th className="text-right py-3 px-4 text-white font-black text-sm w-32">TOTAL</th>
                  <th className="text-center py-3 px-4 text-white font-black text-sm w-20">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {requisition.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/30 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-none text-white font-medium focus:outline-none focus:bg-white/5 px-2 py-1 rounded"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={item.quantity || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          updateLineItem(item.id, 'quantity', value ? parseInt(value) : 0);
                        }}
                        className="w-full bg-transparent border border-white rounded px-3 py-2 text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-white number-input"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.unitPrice || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          updateLineItem(item.id, 'unitPrice', value ? parseFloat(value) : 0);
                        }}
                        className="w-full bg-transparent border border-white rounded px-3 py-2 text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-white number-input"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white font-black text-lg">
                        R{item.totalPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-white hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add New Line Item Form */}
        <div className="bg-white/5 border-2 border-white rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white">Add New Line Item</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                Description *
              </label>
              <input
                type="text"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="input-field"
                placeholder="Item description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Quantity *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={newItem.quantity || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNewItem({ ...newItem, quantity: value ? parseInt(value) : 0 });
                }}
                className="input-field number-input"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Unit Price (R) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={newItem.unitPrice || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setNewItem({ ...newItem, unitPrice: value ? parseFloat(value) : 0 });
                }}
                className="input-field number-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={addLineItem}
              className="btn-primary flex items-center space-x-2 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Line Item</span>
            </button>
          </div>
        </div>

        {requisition.lineItems.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-white/30 rounded-xl">
            <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-white/50 font-medium">No line items added yet</p>
            <p className="text-white/30 text-sm mt-1">Use the form above to add your first line item</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-white/70">
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
            onClick={() => {
              if (requisition.lineItems.length === 0) {
                alert('Please add at least one line item before submitting');
                return;
              }
              if (!requisition.title || !requisition.requester || !requisition.department || !requisition.justification) {
                alert('Please fill in all required fields');
                return;
              }
              updateRequisition({ 
                approvalStatus: 'Submitted',
                requesterEmail: currentUserEmail,
                requester: requisition.requester || currentUserName || 'Unknown'
              });
            }}
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
