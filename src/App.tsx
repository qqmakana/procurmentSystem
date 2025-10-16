import React, { useState, useEffect } from 'react';
import TabDetails from './components/TabDetails';
import TabInvoice from './components/TabInvoice';
import TabPO from './components/TabPO';
import ApprovalQueue from './components/ApprovalQueue';
import AuthSystem from './components/AuthSystem';
import NotificationSystem from './components/NotificationSystem';
import { Requisition, User, SecurityLog } from './types';

const App: React.FC = () => {
  const [requisition, setRequisition] = useState<Requisition>(() => {
    const now = new Date();
    return {
      id: `REQ-${Date.now()}`,
      title: '',
      requester: '',
      department: '',
      dateRequested: now,
      justification: '',
      lineItems: [],
      totalAmount: 0,
      approvalStatus: 'Draft',
      attachments: [],
      createdAt: now,
      updatedAt: now,
      autoSubmitted: false,
      approver: undefined,
      submissionDate: undefined
    };
  });

  const [activeTab, setActiveTab] = useState<'create' | 'invoice' | 'po' | 'approval' | 'all-requisitions'>('create');
  
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'approval_required' | 'approval_completed' | 'rejection' | 'submission' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    requisitionId?: string;
    fromUser?: string;
    priority: 'low' | 'medium' | 'high';
  }>>([]);
  
  
  const [, setSecurityLogs] = useState<SecurityLog[]>([]);

  // Authentication functions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Check for pending approvals
    const pendingForUser = allRequisitions.filter(req => 
      req.approvalSteps?.some(step => 
        step.status === 'Pending' && 
        step.approver === user.name &&
        (step.level === user.role || user.role === 'Admin')
      )
    );

    // Add welcome notification
    addNotification({
      type: 'system',
      title: 'Welcome!',
      message: `Welcome back, ${user.name}! You're logged in as ${user.role}.`,
      priority: 'low'
    });

    // Add notification for pending approvals
    if (pendingForUser.length > 0) {
      addNotification({
        type: 'approval_required',
        title: `${pendingForUser.length} Approval${pendingForUser.length > 1 ? 's' : ''} Required!`,
        message: `You have ${pendingForUser.length} requisition${pendingForUser.length > 1 ? 's' : ''} waiting for your approval. Please check the Queue tab.`,
        priority: 'high'
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setNotifications([]);
  };

  const addNotification = (notification: {
    type: 'approval_required' | 'approval_completed' | 'rejection' | 'submission' | 'system';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    requisitionId?: string;
    fromUser?: string;
  }) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      ...notification,
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleViewRequisition = (_requisitionId: string) => {
    // Switch to approval tab and highlight the requisition
    setActiveTab('approval');
    // In real app, you'd scroll to or highlight the specific requisition
  };
  
  // Mock data for multiple requisitions (in real app, this would come from API)
  const [allRequisitions] = useState<Requisition[]>([
    {
      id: 'REQ-001',
      title: 'Office Supplies Request',
      requester: 'John Doe',
      department: 'IT',
      dateRequested: new Date(),
      justification: 'Need new office supplies for Q1',
      lineItems: [
        { id: '1', description: 'Laptop', quantity: 2, unitPrice: 15000, totalAmount: 30000 },
        { id: '2', description: 'Monitor', quantity: 2, unitPrice: 5000, totalAmount: 10000 }
      ],
      totalAmount: 40000,
      approvalStatus: 'Pending Finance',
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      autoSubmitted: false,
      approver: undefined,
      submissionDate: new Date(),
      approvalSteps: [
        {
          id: 'finance-1',
          level: 'Finance',
          approver: 'Lebone',
          approverEmail: 'lebone@dm-mineralsgroup.com',
          status: 'Pending',
          isRequired: true,
          order: 1
        }
      ]
    }
  ]);

  // Load saved data on component mount
  useEffect(() => {
    // Check for saved user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading saved user:', error);
      }
    }

    const saved = localStorage.getItem('procurement-requisition');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migration: Ensure lineItems exists and handle old structure
        if (!parsed.lineItems) {
          parsed.lineItems = [];
          // If we have old single item structure, convert it
          if (parsed.itemDescription && parsed.quantity && parsed.unitPrice) {
            parsed.lineItems = [{
              id: `item-${Date.now()}`,
              description: parsed.itemDescription,
              quantity: parsed.quantity,
              unitPrice: parsed.unitPrice,
              totalAmount: parsed.quantity * parsed.unitPrice
            }];
            // Remove old fields
            delete parsed.itemDescription;
            delete parsed.quantity;
            delete parsed.unitPrice;
          }
        }
        
        // Convert date strings back to Date objects
        if (parsed.dateRequested) {
          parsed.dateRequested = new Date(parsed.dateRequested);
        }
        if (parsed.createdAt) {
          parsed.createdAt = new Date(parsed.createdAt);
        }
        if (parsed.updatedAt) {
          parsed.updatedAt = new Date(parsed.updatedAt);
        }
        if (parsed.submissionDate) {
          parsed.submissionDate = new Date(parsed.submissionDate);
        }
        
        setRequisition(parsed);
      } catch (error) {
        console.error('Error loading saved requisition:', error);
      }
    }
  }, []);

  // Save data whenever requisition changes
  useEffect(() => {
    localStorage.setItem('procurement-requisition', JSON.stringify(requisition));
  }, [requisition]);

  const updateRequisition = (updates: Partial<Requisition>) => {
    setRequisition(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  };

  const resetRequisition = () => {
    const now = new Date();
    const newReq: Requisition = {
      id: `REQ-${Date.now()}`,
      title: '',
      requester: '',
      department: '',
      dateRequested: now,
      justification: '',
      lineItems: [],
      totalAmount: 0,
      approvalStatus: 'Draft' as const,
      attachments: [],
      createdAt: now,
      updatedAt: now,
      autoSubmitted: false,
      approver: undefined,
      submissionDate: undefined
    };
    setRequisition(newReq);
    // Clear from localStorage immediately
    localStorage.setItem('procurement-requisition', JSON.stringify(newReq));
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(requisition, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `requisition-${requisition.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addNotification({
        type: 'system',
        title: 'Export Successful',
        message: `Requisition ${requisition.id} has been exported successfully.`,
        priority: 'low'
      });
    } catch (error) {
      alert('Error exporting data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON file');
      event.target.value = ''; // Reset the input
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        // Migration: Ensure lineItems exists and handle old structure
        if (!imported.lineItems) {
          imported.lineItems = [];
          // If we have old single item structure, convert it
          if (imported.itemDescription && imported.quantity && imported.unitPrice) {
            imported.lineItems = [{
              id: `item-${Date.now()}`,
              description: imported.itemDescription,
              quantity: imported.quantity,
              unitPrice: imported.unitPrice,
              totalAmount: imported.quantity * imported.unitPrice
            }];
            // Remove old fields
            delete imported.itemDescription;
            delete imported.quantity;
            delete imported.unitPrice;
          }
        }
        
        // Convert date strings back to Date objects
        if (imported.dateRequested) {
          imported.dateRequested = new Date(imported.dateRequested);
        }
        if (imported.createdAt) {
          imported.createdAt = new Date(imported.createdAt);
        }
        if (imported.updatedAt) {
          imported.updatedAt = new Date(imported.updatedAt);
        }
        if (imported.submissionDate) {
          imported.submissionDate = new Date(imported.submissionDate);
        }
        
        setRequisition(imported);
        logSecurityEvent('import_requisition', `Imported requisition ${imported.id}`);
        
        addNotification({
          type: 'system',
          title: 'Import Successful',
          message: `Requisition ${imported.id} has been imported successfully.`,
          priority: 'low'
        });
      } catch (error) {
        alert('Error importing file. Please ensure the file is a valid requisition JSON file.');
        console.error('Import error:', error);
      }
      
      // Reset the input so the same file can be imported again if needed
      event.target.value = '';
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  // Professional functions
  const logSecurityEvent = (action: string, details: string) => {
    const log: SecurityLog = {
      id: `log-${Date.now()}`,
      userId: currentUser?.id || 'unknown',
      action,
      timestamp: new Date(),
      ipAddress: '127.0.0.1', // In real app, get from request
      userAgent: navigator.userAgent,
      details
    };
    setSecurityLogs(prev => [...prev, log]);
  };



  const tabProps = {
    requisition,
    updateRequisition
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black border-2 border-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b-2 border-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">DM Minerals Group</h1>
                <p className="text-xl text-gray-300 mb-1">Procurement Requisition</p>
                <p className="text-white font-semibold">ID: {requisition.id}</p>
              </div>
              <div className="flex items-center space-x-4">
                {currentUser ? (
                  <>
                    <NotificationSystem
                      currentUser={currentUser}
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onViewRequisition={handleViewRequisition}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={exportData}
                        className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-lg transition-colors border-2 border-white"
                      >
                        📥 Export
                      </button>
                      <label className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-lg transition-colors border-2 border-white cursor-pointer">
                        📤 Import
                        <input
                          type="file"
                          accept=".json"
                          onChange={importData}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => {
                          if (window.confirm('⚠️ CLEAR ALL DATA?\n\nThis will delete the current requisition and create a fresh form. This cannot be undone!')) {
                            // Clear localStorage completely
                            localStorage.removeItem('procurement-requisition');
                            // Reset to new requisition
                            resetRequisition();
                            // Reload page to ensure clean state
                            window.location.reload();
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors border-2 border-white"
                      >
                        🗑️ Clear All
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Create new requisition? Current data will be saved.')) {
                            resetRequisition();
                          }
                        }}
                        className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-lg transition-colors border-2 border-white"
                      >
                        ➕ New
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-white/70">
                    Please login to access the system
                  </div>
                )}
              </div>
            </div>
            
            {/* Authentication */}
            <div className="mt-4 pt-4 border-t-2 border-white">
              <AuthSystem
                onLogin={handleLogin}
                onLogout={handleLogout}
                currentUser={currentUser}
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b-2 border-white">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'create'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              ➕ Create Requisition
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'approval'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              ✅ Approvals
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'invoice'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              🧾 Invoice
            </button>
            <button
              onClick={() => setActiveTab('po')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'po'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              📄 Purchase Order
            </button>
            {currentUser?.role === 'Admin' && (
              <button
                onClick={() => setActiveTab('all-requisitions')}
                className={`px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === 'all-requisitions'
                    ? 'text-white border-b-2 border-white bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                📊 All Requisitions
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {!currentUser ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
                <p className="text-white/70 mb-6">Please login to access the procurement system</p>
                <div className="text-sm text-white/50">
                  <p>Demo accounts available:</p>
                  <p><strong>solarcouple@gmail.com / q (Admin)</strong></p>
                  <p>lebone@dm-mineralsgroup.com / password123 (Finance)</p>
                  <p>sabelo@dm-mineralsgroup.com / password123 (COO)</p>
                  <p>joan@dm-mineralsgroup.com / password123 (CFO)</p>
                  <p>doctor@dm-mineralsgroup.com / password123 (CEO)</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'create' && <TabDetails {...tabProps} onResetForm={resetRequisition} />}
                {activeTab === 'approval' && (
                  <ApprovalQueue
                    currentUser={currentUser}
                    requisitions={allRequisitions}
                    onApprove={(reqId, stepId, comments) => {
                      // Handle approval logic
                      console.log('Approving:', reqId, stepId, comments);
                      addNotification({
                        type: 'approval_completed',
                        title: 'Approval Completed',
                        message: `You approved requisition ${reqId}`,
                        priority: 'medium',
                        requisitionId: reqId
                      });
                    }}
                    onReject={(reqId, stepId, comments) => {
                      // Handle rejection logic
                      console.log('Rejecting:', reqId, stepId, comments);
                      addNotification({
                        type: 'rejection',
                        title: 'Requisition Rejected',
                        message: `You rejected requisition ${reqId}`,
                        priority: 'high',
                        requisitionId: reqId
                      });
                    }}
                    onViewDetails={(reqId) => {
                      // Handle view details
                      console.log('Viewing details for:', reqId);
                    }}
                  />
                )}
                {activeTab === 'invoice' && <TabInvoice {...tabProps} />}
                {activeTab === 'po' && <TabPO {...tabProps} />}
                {activeTab === 'all-requisitions' && currentUser?.role === 'Admin' && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">📊 All Requisitions</h2>
                      <p className="text-gray-400">View and analyze all submitted requisitions</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-white mb-2">{allRequisitions.length}</div>
                        <div className="text-gray-400 text-sm">Total Requisitions</div>
                      </div>
                      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          {allRequisitions.filter(r => r.approvalStatus === 'Approved').length}
                        </div>
                        <div className="text-gray-400 text-sm">Approved</div>
                      </div>
                      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">
                          {allRequisitions.filter(r => r.approvalStatus?.includes('Pending')).length}
                        </div>
                        <div className="text-gray-400 text-sm">Pending</div>
                      </div>
                      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-white mb-2">
                          R{allRequisitions.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">Total Value</div>
                      </div>
                    </div>

                    {/* Requisitions List */}
                    <div className="space-y-4">
                      {allRequisitions.map((req) => (
                        <div key={req.id} className="bg-gray-900 border-2 border-white rounded-xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{req.title || 'Untitled Requisition'}</h3>
                              <p className="text-gray-400 text-sm">
                                ID: {req.id} | Requester: {req.requester} | Department: {req.department}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Submitted: {req.submissionDate?.toLocaleDateString() || 'Not submitted'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white mb-1">
                                R{req.totalAmount.toLocaleString()}
                              </div>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                req.approvalStatus === 'Approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                req.approvalStatus === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                req.approvalStatus === 'Draft' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
                                'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              }`}>
                                {req.approvalStatus}
                              </div>
                            </div>
                          </div>

                          {/* Line Items */}
                          <div className="bg-white/5 rounded-lg p-4 mb-4">
                            <h4 className="text-white font-semibold mb-3">📦 Line Items ({req.lineItems.length})</h4>
                            <div className="space-y-2">
                              {req.lineItems.map((item, idx) => (
                                <div key={item.id} className="flex justify-between items-center bg-white/5 rounded p-3">
                                  <div className="flex items-center space-x-3">
                                    <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-medium">
                                      #{idx + 1}
                                    </span>
                                    <div>
                                      <p className="text-white font-medium">{item.description}</p>
                                      <p className="text-gray-400 text-xs">
                                        Qty: {item.quantity} × R{item.unitPrice.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-white font-bold">
                                    R{item.totalAmount.toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Approval Steps */}
                          {req.approvalSteps && req.approvalSteps.length > 0 && (
                            <div className="bg-white/5 rounded-lg p-4">
                              <h4 className="text-white font-semibold mb-3">✅ Approval Progress</h4>
                              <div className="space-y-2">
                                {req.approvalSteps.map((step) => (
                                  <div key={step.id} className="flex justify-between items-center bg-white/5 rounded p-3">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        step.status === 'Approved' ? 'bg-green-500/20 text-green-300' :
                                        step.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                                        step.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-gray-500/20 text-gray-300'
                                      }`}>
                                        {step.status === 'Approved' ? '✓' :
                                         step.status === 'Rejected' ? '✗' :
                                         step.status === 'Pending' ? '⏳' : '○'}
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">{step.approver} ({step.level})</p>
                                        <p className="text-gray-400 text-xs">{step.approverEmail}</p>
                                      </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      step.status === 'Approved' ? 'bg-green-500/20 text-green-300' :
                                      step.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                                      step.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                      'bg-gray-500/20 text-gray-300'
                                    }`}>
                                      {step.status}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Justification */}
                          {req.justification && (
                            <div className="mt-4 bg-white/5 rounded-lg p-4">
                              <h4 className="text-white font-semibold mb-2">📝 Justification</h4>
                              <p className="text-gray-300 text-sm">{req.justification}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {allRequisitions.length === 0 && (
                        <div className="bg-gray-900 border-2 border-white rounded-xl p-12 text-center">
                          <div className="text-6xl mb-4">📊</div>
                          <h3 className="text-2xl font-bold text-white mb-2">No Requisitions Yet</h3>
                          <p className="text-gray-400">Requisitions will appear here once users submit them</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;