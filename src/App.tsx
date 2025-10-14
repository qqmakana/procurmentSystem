import React, { useState, useEffect } from 'react';
import TabDetails from './components/TabDetails';
import TabInvoice from './components/TabInvoice';
import TabPO from './components/TabPO';
import TabDocuments from './components/TabDocuments';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import UserManagement from './components/UserManagement';
import SubmissionWorkflow from './components/SubmissionWorkflow';
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

  const [activeTab, setActiveTab] = useState<'details' | 'invoice' | 'po' | 'documents' | 'approval' | 'users' | 'submit' | 'queue'>('details');
  
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
  
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Requester',
      department: 'IT',
      isActive: true,
      permissions: ['create_requisition', 'view_own_requisitions']
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Finance',
      department: 'Finance',
      isActive: true,
      permissions: ['approve_finance', 'view_all_requisitions']
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'CEO',
      department: 'Executive',
      isActive: true,
      permissions: ['approve_all', 'admin_access']
    }
  ]);
  
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
    // Switch to queue tab and highlight the requisition
    setActiveTab('queue');
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
    setRequisition({
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
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(requisition, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `requisition-${requisition.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
        } catch (error) {
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
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

  const handleApprovalAction = (stepId: string, action: 'approve' | 'reject' | 'skip', comments?: string) => {
    // Update approval step
    const updatedSteps = requisition.approvalSteps?.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status: (action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Skipped') as 'Approved' | 'Rejected' | 'Skipped' | 'Pending',
            [action === 'approve' ? 'approvedAt' : action === 'reject' ? 'rejectedAt' : 'approvedAt']: new Date(),
            comments: comments || step.comments
          }
        : step
    ) || [];

    updateRequisition({
      approvalSteps: updatedSteps,
      approvalStatus: action === 'reject' ? 'Rejected' : 
                    updatedSteps.every(s => s.status === 'Approved' || s.status === 'Skipped') ? 'Approved' :
                    'Under Review'
    });

    logSecurityEvent(`approval_${action}`, `Step ${stepId} ${action}ed by ${currentUser?.name || 'unknown'}`);
  };

  const handleUserManagement = {
    addUser: (user: Omit<User, 'id'>) => {
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`
      };
      setUsers(prev => [...prev, newUser]);
      logSecurityEvent('add_user', `Added user ${newUser.name}`);
    },
    updateUser: (id: string, updates: Partial<User>) => {
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      ));
      logSecurityEvent('update_user', `Updated user ${id}`);
    },
    deleteUser: (id: string) => {
      setUsers(prev => prev.filter(user => user.id !== id));
      logSecurityEvent('delete_user', `Deleted user ${id}`);
    }
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
                        onClick={resetRequisition}
                        className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-lg transition-colors border-2 border-white"
                      >
                        🔄 Reset
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
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'details'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              📋 Details
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'documents'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              📁 Documents
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'submit'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              📤 Submit
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-3 font-medium transition-colors text-sm relative ${
                activeTab === 'queue'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              📋 Queue
              {currentUser && (() => {
                const myPending = allRequisitions.filter(req => 
                  req.approvalSteps?.some(step => 
                    step.status === 'Pending' && 
                    step.approver === currentUser.name &&
                    (step.level === currentUser.role || currentUser.role === 'Admin')
                  )
                ).length;
                return myPending > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {myPending}
                  </span>
                ) : null;
              })()}
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`px-4 py-3 font-medium transition-colors text-sm ${
                activeTab === 'approval'
                  ? 'text-white border-b-2 border-white bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              ✅ Approval
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
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === 'users'
                    ? 'text-white border-b-2 border-white bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                👥 Users
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
                {activeTab === 'details' && <TabDetails {...tabProps} />}
                {activeTab === 'documents' && <TabDocuments {...tabProps} />}
                {activeTab === 'submit' && <SubmissionWorkflow {...tabProps} />}
                {activeTab === 'queue' && (
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
                {activeTab === 'approval' && (
                  <ApprovalWorkflow
                    steps={requisition.approvalSteps || []}
                    currentUser={currentUser}
                    onApprove={(stepId, comments) => handleApprovalAction(stepId, 'approve', comments)}
                    onReject={(stepId, comments) => handleApprovalAction(stepId, 'reject', comments)}
                    onSkip={(stepId, comments) => handleApprovalAction(stepId, 'skip', comments)}
                  />
                )}
                {activeTab === 'invoice' && <TabInvoice {...tabProps} />}
                {activeTab === 'po' && <TabPO {...tabProps} />}
                {activeTab === 'users' && currentUser.role === 'Admin' && (
                  <UserManagement
                    users={users}
                    currentUser={currentUser}
                    onAddUser={handleUserManagement.addUser}
                    onUpdateUser={handleUserManagement.updateUser}
                    onDeleteUser={handleUserManagement.deleteUser}
                  />
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