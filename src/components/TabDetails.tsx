import React, { useState } from 'react';
import { TabProps, LineItem, ApprovalStep } from '../types';
import FileUpload from '../FileUpload';

interface TabDetailsProps extends TabProps {
  onResetForm?: () => void;
}

const TabDetails: React.FC<TabDetailsProps> = ({ requisition, updateRequisition, onResetForm }) => {
  const [newLineItem, setNewLineItem] = useState<Partial<LineItem>>({
    description: '',
    quantity: undefined,
    unitPrice: undefined
  });

  const [filterStatus] = useState<'all' | 'draft' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setNewLineItem({ description: '', quantity: undefined, unitPrice: undefined });
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

  const handleFileUpload = (attachment: any) => {
    updateRequisition({
      attachments: [...requisition.attachments, attachment]
    });
  };

  const handleDocumentRemove = (attachmentId: string) => {
    const updatedAttachments = requisition.attachments.filter(att => att.id !== attachmentId);
    updateRequisition({ attachments: updatedAttachments });
  };

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
    
    // Less than R10,000 - Lebone only
    if (requisition.totalAmount < 10000) {
      approvalSteps.push({
        id: 'finance-step',
        level: 'Finance',
        approver: 'Lebone',
        approverEmail: 'lebone@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 1
      });
    }
    // Between R10,000 - R50,000 - Mr Msiza and Joan
    else if (requisition.totalAmount >= 10000 && requisition.totalAmount <= 50000) {
      approvalSteps.push({
        id: 'coo-step',
        level: 'COO',
        approver: 'Mr Msiza',
        approverEmail: 'sabelo@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 1
      });
      approvalSteps.push({
        id: 'cfo-step',
        level: 'CFO',
        approver: 'Joan',
        approverEmail: 'joan@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 2
      });
    }
    // Above R50,000 - Mr Msiza, Joan and Doctor
    else if (requisition.totalAmount > 50000) {
      approvalSteps.push({
        id: 'coo-step',
        level: 'COO',
        approver: 'Mr Msiza',
        approverEmail: 'sabelo@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 1
      });
      approvalSteps.push({
        id: 'cfo-step',
        level: 'CFO',
        approver: 'Joan',
        approverEmail: 'joan@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 2
      });
      approvalSteps.push({
        id: 'ceo-step',
        level: 'CEO',
        approver: 'Doctor',
        approverEmail: 'doctor@dm-mineralsgroup.com',
        status: 'Pending',
        isRequired: true,
        order: 3
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
      
      // Clear the form after successful submission
      if (onResetForm) {
        setTimeout(() => {
          onResetForm();
        }, 500);
      }
    }, 1500);
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

  const isAlreadySubmitted = requisition.approvalStatus !== 'Draft';

  return (
    <div className="space-y-6">
      {/* Header with Total Amount */}
      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-1">Create New Requisition</h2>
            <p className="text-gray-400">Add line items, attach documents, and submit for approval</p>
          </div>
          <div className="text-right bg-white/10 rounded-lg px-6 py-3">
            <div className="text-sm text-gray-400 mb-1">Total Amount</div>
            <div className="text-3xl font-bold text-white">R{requisition.totalAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Current Status Display */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-white/70 text-sm">Current Status:</span>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ml-3 ${
              requisition.approvalStatus === 'Approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              requisition.approvalStatus === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              requisition.approvalStatus === 'Draft' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
              'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {requisition.approvalStatus}
            </div>
          </div>
          {requisition.approver && (
            <div className="text-sm text-white/70">
              Approved by: {requisition.approver} on {requisition.submissionDate?.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Basic Requisition Info */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📋 Step 1: Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
            <input
              type="text"
              value={requisition.title}
              onChange={(e) => updateRequisition({ title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter requisition title..."
              disabled={isAlreadySubmitted}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Requester *</label>
            <input
              type="text"
              value={requisition.requester}
              onChange={(e) => updateRequisition({ requester: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter requester name..."
              disabled={isAlreadySubmitted}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
            <input
              type="text"
              value={requisition.department}
              onChange={(e) => updateRequisition({ department: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter department..."
              disabled={isAlreadySubmitted}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Date Requested</label>
            <input
              type="date"
              value={requisition.dateRequested.toISOString().split('T')[0]}
              onChange={(e) => updateRequisition({ dateRequested: new Date(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              disabled={isAlreadySubmitted}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-white/80 mb-2">Justification *</label>
          <textarea
            value={requisition.justification}
            onChange={(e) => updateRequisition({ justification: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Enter justification for this requisition..."
            rows={3}
            disabled={isAlreadySubmitted}
          />
        </div>
      </div>

      {/* Add New Item Form */}
      {!isAlreadySubmitted && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📦 Step 2: Add Line Items</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
              <input
                type="text"
                value={newLineItem.description || ''}
                onChange={(e) => setNewLineItem({...newLineItem, description: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter item description..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Quantity *</label>
              <input
                type="number"
                min="1"
                value={newLineItem.quantity ?? ''}
                onChange={(e) => setNewLineItem({...newLineItem, quantity: e.target.value ? parseInt(e.target.value) : undefined})}
                placeholder="Enter quantity"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Unit Price (R) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newLineItem.unitPrice ?? ''}
                onChange={(e) => setNewLineItem({...newLineItem, unitPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                placeholder="Enter unit price"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
      )}

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
                      <span className="bg-white/20 text-white px-2 py-1 rounded text-sm font-medium">
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
                  
                  {!isAlreadySubmitted && (
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
                        className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs px-3 py-1 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supporting Documents */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📎 Step 3: Supporting Documents (Optional)</h3>
        
        {!isAlreadySubmitted && (
          <div className="mb-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              fileType="Supporting"
              uploadedBy={requisition.requester || 'User'}
            />
          </div>
        )}

        {requisition.attachments.length > 0 ? (
          <div className="space-y-3">
            <p className="text-white/70 text-sm mb-3">Uploaded documents ({requisition.attachments.length}):</p>
            {requisition.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{attachment.fileName}</p>
                    <p className="text-xs text-white/50">
                      Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={attachment.fileUrl}
                    download={attachment.fileName}
                    className="text-white hover:text-gray-300 text-sm font-medium"
                  >
                    Download
                  </a>
                  {!isAlreadySubmitted && (
                    <button
                      onClick={() => handleDocumentRemove(attachment.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-white/50">
            <p className="text-sm">No documents uploaded yet</p>
          </div>
        )}
      </div>

      {/* SUBMIT BUTTON - Right after line items and documents */}
      {!isAlreadySubmitted && (
            <div className="bg-gradient-to-br from-gray-800 to-black border-4 border-white rounded-2xl p-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white mb-2">🚀 Step 4: Submit for Approval</h3>
            
            {canSubmit() ? (
              <>
                <div className="text-5xl mb-4">✅</div>
                <p className="text-lg text-gray-300 mb-4">All requirements met - Ready to submit!</p>
                <div className="bg-white/10 rounded-lg p-6 mb-4">
                  <p className="text-white font-semibold mb-3">
                    Total Amount: R{requisition.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-white text-sm mb-2">Will be sent to:</p>
                  <div className="text-left space-y-2">
                    {requisition.totalAmount < 10000 && (
                      <div className="bg-white/10 rounded p-3">
                        <p className="text-white font-semibold">📋 Lebone (Finance)</p>
                        <p className="text-gray-400 text-xs">Amounts under R10,000</p>
                      </div>
                    )}
                    {requisition.totalAmount >= 10000 && requisition.totalAmount <= 50000 && (
                      <>
                        <div className="bg-white/10 rounded p-3">
                          <p className="text-white font-semibold">1️⃣ Mr Msiza (COO)</p>
                          <p className="text-gray-400 text-xs">First approval</p>
                        </div>
                        <div className="bg-white/10 rounded p-3">
                          <p className="text-white font-semibold">2️⃣ Joan (CFO)</p>
                          <p className="text-gray-400 text-xs">Final approval</p>
                        </div>
                      </>
                    )}
                    {requisition.totalAmount > 50000 && (
                      <>
                        <div className="bg-white/10 rounded p-3">
                          <p className="text-white font-semibold">1️⃣ Mr Msiza (COO)</p>
                          <p className="text-gray-400 text-xs">First approval</p>
                        </div>
                        <div className="bg-white/10 rounded p-3">
                          <p className="text-white font-semibold">2️⃣ Joan (CFO)</p>
                          <p className="text-gray-400 text-xs">Second approval</p>
                        </div>
                        <div className="bg-white/10 rounded p-3">
                          <p className="text-white font-semibold">3️⃣ Doctor (CEO)</p>
                          <p className="text-gray-400 text-xs">Final approval</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-lg text-yellow-300 mb-4">Please complete the required fields above</p>
                <div className="bg-white/10 rounded-lg p-4 mb-4 text-left">
                  <p className="text-white text-sm font-semibold mb-2">Missing:</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {!requisition.title && <li>• Requisition Title</li>}
                    {!requisition.requester && <li>• Requester Name</li>}
                    {!requisition.justification && <li>• Justification</li>}
                    {requisition.lineItems.length === 0 && <li>• At least one line item</li>}
                  </ul>
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit() || isSubmitting}
              className={`w-full py-6 rounded-xl font-bold text-2xl transition-all transform hover:scale-105 ${
                canSubmit() && !isSubmitting
                  ? 'bg-white hover:bg-gray-200 text-black shadow-2xl cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '⏳ Submitting...' : '📤 SUBMIT FOR APPROVAL'}
            </button>
          </div>
        </div>
      )}

      {/* Already Submitted Message */}
      {isAlreadySubmitted && (
        <div className="bg-gradient-to-br from-gray-800 to-black border-4 border-white rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-3xl font-bold text-white mb-2">Requisition Submitted!</h3>
          <p className="text-xl text-gray-300 mb-4">
            This requisition has been submitted and is being processed.
          </p>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white"><strong>Status:</strong> {requisition.approvalStatus}</p>
            {requisition.submissionDate && (
              <p className="text-gray-400 text-sm mt-2">
                Submitted on {requisition.submissionDate.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabDetails;
