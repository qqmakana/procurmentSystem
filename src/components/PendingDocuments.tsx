import React from 'react';
import { TabProps } from '../types';

const PendingDocuments: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const handleResubmit = () => {
    // Reset to the appropriate pending status based on amount
    let status: string = 'Submitted';
    
    if (requisition.totalAmount <= 10000) {
      status = 'Pending Finance';
    } else if (requisition.totalAmount <= 50000) {
      status = 'Pending COO';
    } else {
      status = 'Pending COO';
    }

    updateRequisition({
      approvalStatus: status as any,
      currentApprovalStep: 0
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-black border-2 border-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Documents Required</h3>
            <p className="text-white font-medium">Additional documentation has been requested by the approver</p>
          </div>
        </div>

        <div className="bg-white border border-black rounded-xl p-4 mb-6">
          <h4 className="text-black font-bold text-lg mb-3">Required Actions</h4>
          <div className="space-y-3 text-black">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-semibold">Review the approval comments</p>
                <p className="text-sm text-gray-600">Check what additional information is needed</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-semibold">Upload required documents</p>
                <p className="text-sm text-gray-600">Go to the Documents tab to upload supporting files</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold">Resubmit for approval</p>
                <p className="text-sm text-gray-600">Once documents are uploaded, resubmit the requisition</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-black rounded-xl p-4 mb-6">
          <h4 className="text-black font-bold text-lg mb-2">Requisition Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-black">ID:</span>
              <span className="text-black ml-2">{requisition.id}</span>
            </div>
            <div>
              <span className="font-semibold text-black">Requester:</span>
              <span className="text-black ml-2">{requisition.requester}</span>
            </div>
            <div>
              <span className="font-semibold text-black">Department:</span>
              <span className="text-black ml-2">{requisition.department}</span>
            </div>
            <div>
              <span className="font-semibold text-black">Total Amount:</span>
              <span className="text-black ml-2 font-bold">R{requisition.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleResubmit}
            className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-600 px-8 py-3 rounded-lg font-bold transition-colors duration-200 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Resubmit for Approval</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingDocuments;
