import React from 'react';
import { TabProps } from '../types';
import FileUpload from '../FileUpload';

const TabDocuments: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const handleFileUpload = (attachment: any) => {
    updateRequisition({
      attachments: [...requisition.attachments, attachment]
    });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PO':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Invoice':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'PO':
        return 'bg-blue-100 text-blue-800';
      case 'Invoice':
        return 'bg-green-100 text-green-800';
      case 'Supporting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">📎 Document Gallery</h3>
        <p className="text-gray-700 text-sm">
          View and manage all documents related to this requisition. You can upload supporting documents, 
          contracts, quotes, or any other relevant files here.
        </p>
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload Supporting Documents</h4>
        <FileUpload
          onFileUpload={handleFileUpload}
          fileType="Supporting"
          uploadedBy={requisition.requester}
        />
      </div>

      {requisition.attachments.length > 0 ? (
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            All Documents ({requisition.attachments.length})
          </h4>
          <div className="space-y-3">
            {requisition.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {getFileIcon(attachment.fileType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeColor(attachment.fileType)}`}>
                        {attachment.fileType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.fileSize)} • Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={attachment.fileUrl}
                    download={attachment.fileName}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => {
                      const updatedAttachments = requisition.attachments.filter(att => att.id !== attachment.id);
                      updateRequisition({ attachments: updatedAttachments });
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
          <p className="text-gray-500 text-sm">
            Upload PO documents, invoices, or supporting files to keep everything organized.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-1">💡 Document Types</h4>
        <div className="text-blue-700 text-sm space-y-1">
          <p><strong>PO:</strong> Purchase orders from your ERP system</p>
          <p><strong>Invoice:</strong> Supplier invoices for payment tracking</p>
          <p><strong>Supporting:</strong> Quotes, contracts, specifications, or other relevant documents</p>
        </div>
      </div>
    </div>
  );
};

export default TabDocuments;
