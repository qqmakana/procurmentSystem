import React, { useState, useRef } from 'react';
import { Attachment } from '../types';

interface DocumentUploadProps {
  attachments: Attachment[];
  onUpload: (attachment: Attachment) => void;
  onRemove: (id: string) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  attachments,
  onUpload,
  onRemove,
  maxFileSize = 10,
  allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string): string => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc')) return '📝';
    if (type.includes('xls')) return '📊';
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return '🖼️';
    return '📎';
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        continue;
      }

      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        alert(`File ${file.name} is not an allowed file type.`);
        continue;
      }

      try {
        // Convert file to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const attachment: Attachment = {
            id: `attachment-${Date.now()}-${i}`,
            fileName: file.name,
            fileType: getFileTypeFromExtension(fileExtension),
            uploadedBy: 'Current User', // This should come from auth context
            uploadedAt: new Date(),
            fileUrl: e.target?.result as string,
            fileSize: file.size
          };
          onUpload(attachment);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error uploading ${file.name}`);
      }
    }
    
    setUploading(false);
  };

  const getFileTypeFromExtension = (extension: string): 'PO' | 'Invoice' | 'Supporting' | 'Other' => {
    if (extension === 'pdf' || extension === 'doc' || extension === 'docx') return 'Supporting';
    if (extension === 'xls' || extension === 'xlsx') return 'Invoice';
    return 'Other';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Upload Supporting Documents
            </h3>
            <p className="text-white/70 mb-4">
              Drag and drop files here or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </button>
          </div>
          <div className="text-sm text-white/60">
            <p>Allowed types: {allowedTypes.join(', ').toUpperCase()}</p>
            <p>Maximum size: {maxFileSize}MB per file</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.map(type => `.${type}`).join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Uploaded Files */}
      {attachments.length > 0 && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <h4 className="text-lg font-semibold text-white mb-4">
            Uploaded Documents ({attachments.length})
          </h4>
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="bg-white/10 border border-white/20 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getFileIcon(attachment.fileType)}
                  </span>
                  <div>
                    <div className="text-white font-medium">
                      {attachment.fileName}
                    </div>
                    <div className="text-sm text-white/70">
                      {formatFileSize(attachment.fileSize)} • {attachment.fileType} • 
                      Uploaded by {attachment.uploadedBy}
                    </div>
                    <div className="text-xs text-white/60">
                      {attachment.uploadedAt.toLocaleDateString()} at {attachment.uploadedAt.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Open file in new tab
                      const link = document.createElement('a');
                      link.href = attachment.fileUrl;
                      link.target = '_blank';
                      link.click();
                    }}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => onRemove(attachment.id)}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

