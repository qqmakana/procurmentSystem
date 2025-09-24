import React from 'react';
import { TabProps } from '../types';
import FileUpload from '../FileUpload';

const TabPO: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const handleFileUpload = (attachment: any) => {
    updateRequisition({
      attachments: [...requisition.attachments, attachment]
    });
  };

  const handlePOUpdate = (field: 'poNumber' | 'poIssuedDate', value: string | Date) => {
    updateRequisition({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">📄 Purchase Order Entry</h3>
        <p className="text-green-700 text-sm">
          After creating the PO in your ERP system (Sage, etc.), enter the PO number and upload the official document here.
        </p>
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">PO Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Number *
            </label>
            <input
              type="text"
              value={requisition.poNumber || ''}
              onChange={(e) => handlePOUpdate('poNumber', e.target.value)}
              className="input-field"
              placeholder="e.g., PO-2025-0405"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Issue Date *
            </label>
            <input
              type="date"
              value={requisition.poIssuedDate ? requisition.poIssuedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handlePOUpdate('poIssuedDate', new Date(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload PO Document</h4>
        <FileUpload
          onFileUpload={handleFileUpload}
          fileType="PO"
          uploadedBy={requisition.requester}
        />
      </div>

      {requisition.attachments.filter(att => att.fileType === 'PO').length > 0 && (
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Uploaded PO Documents</h4>
          <div className="space-y-3">
            {requisition.attachments
              .filter(att => att.fileType === 'PO')
              .map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={attachment.fileUrl}
                      download={attachment.fileName}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => {
                        const updatedAttachments = requisition.attachments.filter(att => att.id !== attachment.id);
                        updateRequisition({ attachments: updatedAttachments });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-1">💡 Next Steps</h4>
        <p className="text-yellow-700 text-sm">
          Once the supplier sends the invoice, go to the Invoice tab to record the invoice number and upload the invoice document.
        </p>
      </div>
    </div>
  );
};

export default TabPO;
