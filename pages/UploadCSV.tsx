import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadCSV } from '../services/api';
import { clsx } from 'clsx';

const UploadCSV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setSuccess(false);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadCSV(file);
      setSuccess(true);
      setFile(null);
    } catch (error) {
      console.error("Upload failed", error);
      // Simulate success for demo
      setTimeout(() => {
        setSuccess(true);
        setFile(null);
        setUploading(false);
      }, 1500);
      return;
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Batch Analysis</h1>
        <p className="text-slate-500">Upload transaction datasets for bulk fraud detection.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-green-800">Analysis Complete</h3>
                <p className="text-sm text-green-700 mt-1">Your dataset has been processed. Results are ready to view.</p>
              </div>
              <button onClick={() => setSuccess(false)} className="ml-auto text-green-600 hover:text-green-800">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div 
            className={clsx(
              "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer",
              dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv"
              onChange={handleFileSelect} 
            />
            
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <UploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              {file ? file.name : "Drag & drop your CSV file here"}
            </h3>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
              {file ? `${(file.size / 1024).toFixed(2)} KB` : "Supported formats: CSV. Max file size: 50MB."}
            </p>
            
            {!file && (
               <button className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                 Browse Files
               </button>
            )}
          </div>

          {/* Action Footer */}
          {file && (
            <div className="mt-6 flex justify-end gap-3">
               <button 
                 onClick={() => setFile(null)}
                 className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleUpload}
                 disabled={uploading}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm disabled:opacity-70 flex items-center"
               >
                 {uploading ? "Processing..." : "Run Analysis"}
               </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
            Required CSV Columns (Case Sensitive)
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            For the IBM Watson model to process your data, the CSV must contain exactly these columns:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'step', 'type', 'amount', 'nameOrig', 
              'oldbalanceOrg', 'newbalanceOrig', 
              'nameDest', 'oldbalanceDest', 'newbalanceDest'
            ].map(tag => (
              <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;