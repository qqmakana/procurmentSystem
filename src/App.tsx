import React, { useState, useEffect } from 'react';
import { Requisition } from './types';
import Dashboard from './components/Dashboard';
import TabDetails from './components/TabDetails';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import TabPO from './components/TabPO';
import TabInvoice from './components/TabInvoice';
import TabDocuments from './components/TabDocuments';
import Login from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requisition, setRequisition] = useState<Requisition>(() => {
    // Initialize with default values
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
    };
  });

  // Check authentication on mount
  useEffect(() => {
    const authData = localStorage.getItem('procurement-auth');
    if (authData) {
      try {
        const { email, name } = JSON.parse(authData);
        setCurrentUser({ email, name });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('procurement-requisition');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsed.dateRequested = new Date(parsed.dateRequested);
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
        if (parsed.poIssuedDate) parsed.poIssuedDate = new Date(parsed.poIssuedDate);
        if (parsed.invoiceReceivedDate) parsed.invoiceReceivedDate = new Date(parsed.invoiceReceivedDate);
        parsed.attachments.forEach((att: any) => {
          att.uploadedAt = new Date(att.uploadedAt);
        });
        setRequisition(parsed);
      } catch (error) {
        console.error('Error loading saved requisition:', error);
      }
    }
  }, []);

  // Save to localStorage whenever requisition changes
  useEffect(() => {
    localStorage.setItem('procurement-requisition', JSON.stringify(requisition));
  }, [requisition]);

  const handleLogin = (email: string, name: string) => {
    const authData = { email, name };
    localStorage.setItem('procurement-auth', JSON.stringify(authData));
    setCurrentUser(authData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('procurement-auth');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateRequisition = (updates: Partial<Requisition>) => {
    setRequisition(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(requisition, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requisition-${requisition.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          // Convert date strings back to Date objects
          imported.dateRequested = new Date(imported.dateRequested);
          imported.createdAt = new Date(imported.createdAt);
          imported.updatedAt = new Date(imported.updatedAt);
          if (imported.poIssuedDate) imported.poIssuedDate = new Date(imported.poIssuedDate);
          if (imported.invoiceReceivedDate) imported.invoiceReceivedDate = new Date(imported.invoiceReceivedDate);
          imported.attachments.forEach((att: any) => {
            att.uploadedAt = new Date(att.uploadedAt);
          });
          setRequisition(imported);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetRequisition = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
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
      });
    }
  };

  // Check if user is an approver or admin
  const isApprover = () => {
    if (!currentUser?.email) return false;
    const approverEmails = [
      'solarcouple@gmail.com', // Admin
      'lebone@dm-mineralsgroup.com', // Finance
      'sabelo@dm-mineralsgroup.com', // COO
      'joan@dm-mineralsgroup.com', // CFO
      'doctor@dm-mineralsgroup.com', // CEO
    ];
    return approverEmails.includes(currentUser.email);
  };

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard', component: Dashboard, condition: true },
    { id: 'details', label: '📝 Create Requisition', component: TabDetails, condition: true },
    { id: 'approval', label: '✓ Approvals', component: ApprovalWorkflow, condition: requisition.approvalStatus !== 'Draft' },
    { id: 'po', label: '📄 PO Entry', component: TabPO, condition: requisition.approvalStatus === 'Approved' && isApprover() },
    { id: 'invoice', label: '💵 Invoice', component: TabInvoice, condition: requisition.approvalStatus === 'Approved' && isApprover() },
    { id: 'documents', label: '📎 Documents', component: TabDocuments, condition: true },
  ];

  const visibleTabs = tabs.filter(tab => tab.condition);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Draft': 'status-badge status-draft',
      'Submitted': 'status-badge status-submitted',
      'Approved': 'status-badge status-approved',
      'Rejected': 'status-badge status-rejected'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge status-draft';
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black shadow-2xl border-b border-white sticky top-0 z-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                <svg className="w-8 h-8 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white animate-fadeIn">
                  Procurement Tracker
                </h1>
                <p className="text-white font-semibold text-lg animate-slideUp">Streamline your procurement workflow</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-white font-medium">Logged in as</div>
                <div className="font-bold text-white">{currentUser?.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white font-medium">Requisition ID</div>
                <div className="font-mono font-bold text-white">{requisition.id}</div>
              </div>
              <div className={`${getStatusBadge(requisition.approvalStatus)}`}>
                {requisition.approvalStatus}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={exportData}
                  className="btn-secondary text-sm flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export</span>
                </button>
                <label className="btn-secondary text-sm cursor-pointer flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={resetRequisition}
                  className="btn-danger text-sm flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm flex items-center space-x-2 border-2 border-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-black border-b border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-2">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && (
            <Dashboard
              requisition={requisition}
              currentUserEmail={currentUser?.email || ''}
              currentUserName={currentUser?.name || ''}
            />
          )}
          {activeTab === 'details' && (
            <TabDetails
              requisition={requisition}
              updateRequisition={updateRequisition}
              currentUserEmail={currentUser?.email}
              currentUserName={currentUser?.name}
            />
          )}
          {activeTab === 'approval' && (
            <ApprovalWorkflow
              requisition={requisition}
              updateRequisition={updateRequisition}
              currentUserEmail={currentUser?.email || ''}
              currentUserName={currentUser?.name || ''}
            />
          )}
          {activeTab === 'po' && (
            <TabPO
              requisition={requisition}
              updateRequisition={updateRequisition}
            />
          )}
          {activeTab === 'invoice' && (
            <TabInvoice
              requisition={requisition}
              updateRequisition={updateRequisition}
            />
          )}
          {activeTab === 'documents' && (
            <TabDocuments
              requisition={requisition}
              updateRequisition={updateRequisition}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Procurement Tracker</span>
            </div>
            <p className="text-white font-medium mb-2">Built with React + TypeScript + Tailwind CSS</p>
            <p className="text-sm text-white">All data is stored locally in your browser • Secure & Private</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
