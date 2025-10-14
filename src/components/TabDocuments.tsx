import React from 'react';
import { TabProps } from '../types';
import FileUpload from '../FileUpload';

const TabDocuments: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const handleFileUpload = (attachment: any) => {
    updateRequisition({
      attachments: [...requisition.attachments, attachment]
    });
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
      {/* How It Works Guide */}
      <div className="bg-gray-900 border-2 border-white rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">📎 How Document Upload & Approval Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-black border-2 border-white rounded-lg p-4">
            <div className="text-2xl mb-2">1️⃣</div>
            <div className="font-semibold mb-1">Upload Documents</div>
            <div className="text-gray-300">
              Upload supporting documents here (quotes, contracts, specifications, etc.). They will be attached to your requisition.
            </div>
          </div>
          <div className="bg-black border-2 border-white rounded-lg p-4">
            <div className="text-2xl mb-2">2️⃣</div>
            <div className="font-semibold mb-1">Submit for Approval</div>
            <div className="text-gray-300">
              Go to the "Submit" tab to review and submit your requisition with all documents for approval.
            </div>
          </div>
          <div className="bg-black border-2 border-white rounded-lg p-4">
            <div className="text-2xl mb-2">3️⃣</div>
            <div className="font-semibold mb-1">Approvers Review</div>
            <div className="text-gray-300">
              Approvers will see your documents in the "Queue" tab and can view/download them before approving.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black border-2 border-white rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">📎 Document Gallery</h3>
        <p className="text-gray-300 text-sm">
          View and manage all documents related to this requisition. You can upload supporting documents, 
          contracts, quotes, or any other relevant files here.
        </p>
      </div>

      <div className="bg-black border-2 border-white rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">📤 Upload Supporting Documents</h4>
        <p className="text-gray-300 text-sm mb-4">
          Drag and drop files or click to browse. Supported formats: PDF, Word, Excel, Images
        </p>
        <FileUpload
          onFileUpload={handleFileUpload}
          fileType="Supporting"
          uploadedBy={requisition.requester}
        />
      </div>

      {requisition.attachments.length > 0 ? (
        <div className="bg-black border-2 border-white rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            📁 All Documents ({requisition.attachments.length})
          </h4>
          <div className="space-y-3">
            {requisition.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-4 bg-gray-900 border border-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-white">{attachment.fileName}</p>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white">
                        {attachment.fileType}
                      </span>
                    </div>
                    <p className="text-xs text-white/70">
                      {formatFileSize(attachment.fileSize)} • Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={attachment.fileUrl}
                    download={attachment.fileName}
                    className="text-white hover:text-gray-300 text-sm font-medium px-3 py-1 rounded-md bg-gray-800 border border-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => {
                      const updatedAttachments = requisition.attachments.filter(att => att.id !== attachment.id);
                      updateRequisition({ attachments: updatedAttachments });
                    }}
                    className="text-white hover:text-gray-300 text-sm font-medium px-3 py-1 rounded-md bg-gray-800 border border-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-black border-2 border-white rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-white mb-2">No documents uploaded yet</h3>
          <p className="text-gray-300 text-sm">
            Upload quotes, contracts, specifications, or any other supporting files to strengthen your requisition.
          </p>
        </div>
      )}

      <div className="bg-gray-900 border-2 border-white rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-2">💡 Tips for Document Upload</h4>
        <div className="text-gray-300 text-sm space-y-2">
          <p><strong>✓ Best Practices:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Always upload supporting documents before submitting for approval</li>
            <li>Include quotes from suppliers to justify pricing</li>
            <li>Add contracts or agreements if applicable</li>
            <li>Technical specifications help approvers make informed decisions</li>
            <li>Documents are visible to all approvers in the approval queue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabDocuments;
