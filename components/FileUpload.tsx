'use client';

import { Upload, Image as ImageIcon } from 'lucide-react';
import { useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing = false }: FileUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileSelect(imageFile);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-white hover:bg-purple-50/50 transition-all duration-300 ease-in-out cursor-pointer rounded-xl hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-100 p-12 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-purple-100">
            {isProcessing ? (
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-purple-600" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              {isProcessing ? 'Processing your image...' : 'Upload your image'}
            </h3>
            <p className="text-slate-500">
              Drag and drop an image file here, or click to select
            </p>
            <p className="text-sm text-slate-400">
              Supports PNG, JPG, SVG, and WebP formats
            </p>
          </div>

          {!isProcessing && (
            <>
              <label className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer inline-flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              
              <div className="text-xs text-slate-400">
                Maximum file size: 10MB
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}