import React, { useState } from 'react';
import { TabProps, LineItem } from '../types';

const TabDetails: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const [newLineItem, setNewLineItem] = useState<Partial<LineItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');

  const addLineItem = () => {
    if (!newLineItem.description || !newLineItem.quantity || !newLineItem.unitPrice) {
      alert('Please fill in all fields');
      return;
    }

    const lineItem: LineItem = {
      id: `item-${Date.now()}`,
      description: newLineItem.description,
      quantity: newLineItem.quantity,
      unitPrice: newLineItem.unitPrice,
      totalAmount: newLineItem.quantity * newLineItem.unitPrice
    };

    const updatedLineItems = [...requisition.lineItems, lineItem];
    const newTotalAmount = updatedLineItems.reduce((sum, item) => sum + item.totalAmount, 0);

    updateRequisition({
      lineItems: updatedLineItems,
      totalAmount: newTotalAmount
    });

    setNewLineItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    const updatedLineItems = requisition.lineItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    
    // Recalculate total amount
    const newTotalAmount = updatedLineItems.reduce((sum, item) => sum + item.totalAmount, 0);
    
    updateRequisition({
      lineItems: updatedLineItems,
      totalAmount: newTotalAmount
    });
  };

  const removeLineItem = (id: string) => {
    const updatedLineItems = requisition.lineItems.filter(item => item.id !== id);
    const newTotalAmount = updatedLineItems.reduce((sum, item) => sum + item.totalAmount, 0);
    
    updateRequisition({
      lineItems: updatedLineItems,
      totalAmount: newTotalAmount
    });
  };

  const handleApprovalAction = (action: 'approve' | 'reject' | 'pending') => {
    updateRequisition({ 
      approvalStatus: action === 'approve' ? 'Approved' : 
                    action === 'reject' ? 'Rejected' : 'Draft',
      approver: action !== 'pending' ? 'Current User' : undefined,
      submissionDate: action !== 'pending' ? new Date() : undefined
    });
  };

  const filteredLineItems = requisition.lineItems.filter(() => {
    if (filterStatus === 'all') return true;
    // For now, all items are considered 'draft' - you can extend this logic
    return filterStatus === 'draft';
  });

  const sortedLineItems = [...filteredLineItems].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.totalAmount - a.totalAmount;
      case 'description':
        return a.description.localeCompare(b.description);
      case 'date':
      default:
        return 0; // Keep original order for now
    }
  });

  return (
    <div className="space-y-6">
      {/* Header with Total Amount */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Requisition Details</h2>
            <p className="text-blue-100">Manage your procurement items</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">R{requisition.totalAmount.toLocaleString()}</div>
            <div className="text-blue-100">Total Amount</div>
          </div>
        </div>
      </div>

      {/* Approval Status and Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Approval Status</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              requisition.approvalStatus === 'Approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              requisition.approvalStatus === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              requisition.approvalStatus === 'Draft' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
              'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {requisition.approvalStatus}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleApprovalAction('approve')}
              className="btn-success"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleApprovalAction('reject')}
              className="btn-danger"
            >
              ❌ Reject
            </button>
            <button
              onClick={() => handleApprovalAction('pending')}
              className="btn-secondary"
            >
              ⏳ Pending
            </button>
          </div>
        </div>
        
        {requisition.approver && (
          <div className="text-sm text-white/70">
            Approved by: {requisition.approver} on {requisition.submissionDate?.toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">All Items</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="date">Date Added</option>
              <option value="amount">Amount</option>
              <option value="description">Description</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Add New Line Item</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
            <input
              type="text"
              value={newLineItem.description || ''}
              onChange={(e) => setNewLineItem({...newLineItem, description: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item description..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Quantity *</label>
            <input
              type="number"
              min="1"
              value={newLineItem.quantity || ''}
              onChange={(e) => setNewLineItem({...newLineItem, quantity: parseInt(e.target.value) || 1})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Unit Price (R) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newLineItem.unitPrice || ''}
              onChange={(e) => setNewLineItem({...newLineItem, unitPrice: parseFloat(e.target.value) || 0})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-white/70">
            {newLineItem.quantity && newLineItem.unitPrice && (
              <span className="text-lg font-semibold text-white">
                Total: R{((newLineItem.quantity || 0) * (newLineItem.unitPrice || 0)).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={addLineItem}
            className="btn-primary"
          >
            ➕ Add Item
          </button>
        </div>
      </div>

      {/* Line Items List */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            Line Items ({sortedLineItems.length})
          </h3>
          <div className="text-white/70">
            Total: R{requisition.totalAmount.toLocaleString()}
          </div>
        </div>

        {sortedLineItems.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <div className="text-4xl mb-4">📦</div>
            <p>No line items added yet</p>
            <p className="text-sm">Add your first item using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedLineItems.map((item, index) => (
              <div key={item.id} className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm font-medium">
                        #{index + 1}
                      </span>
                      <span className="text-white font-medium">{item.description}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-white/70">
                      <div>
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Unit Price:</span> R{item.unitPrice.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> R{item.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        const newQuantity = prompt('Enter new quantity:', item.quantity.toString());
                        if (newQuantity && !isNaN(parseInt(newQuantity))) {
                          const qty = parseInt(newQuantity);
                          updateLineItem(item.id, { 
                            quantity: qty, 
                            totalAmount: qty * item.unitPrice 
                          });
                        }
                      }}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="btn-danger text-xs px-3 py-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Basic Requisition Info */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Requisition Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
            <input
              type="text"
              value={requisition.title}
              onChange={(e) => updateRequisition({ title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter requisition title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Requester</label>
            <input
              type="text"
              value={requisition.requester}
              onChange={(e) => updateRequisition({ requester: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter requester name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
            <input
              type="text"
              value={requisition.department}
              onChange={(e) => updateRequisition({ department: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Date Requested</label>
            <input
              type="date"
              value={requisition.dateRequested.toISOString().split('T')[0]}
              onChange={(e) => updateRequisition({ dateRequested: new Date(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-white/80 mb-2">Justification</label>
          <textarea
            value={requisition.justification}
            onChange={(e) => updateRequisition({ justification: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter justification for this requisition..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default TabDetails;