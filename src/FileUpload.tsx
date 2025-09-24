import React, { useState } from 'react';
import { Attachment } from './types';

interface FileUploadProps {
  onFileUpload: (attachment: Attachment) => void;
  fileType: 'PO' | 'Invoice' | 'Supporting' | 'Other';
  uploadedBy: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, fileType, uploadedBy }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment: Attachment = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType,
        uploadedBy,
        uploadedAt: new Date(),
        fileUrl: e.target?.result as string,
        fileSize: file.size,
      };
      onFileUpload(attachment);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div
      className={`file-upload-area ${
        isDragging ? 'file-upload-dragging' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging 
              ? 'bg-blue-100 shadow-lg scale-110' 
              : 'bg-gray-100 hover:bg-blue-50'
          }`}>
            <svg
              className={`w-8 h-8 transition-colors duration-300 ${
                isDragging ? 'text-blue-600' : 'text-gray-400'
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 mb-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                Click to upload
              </span>{' '}
              or drag and drop
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            PDF, DOC, DOCX, JPG, PNG files up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
