import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Loader2, X, Car, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { extractDataFromDocuments } from '../services/geminiService';
import { ContractData } from '../types';

interface FileUploaderProps {
  onDataExtracted: (data: Partial<ContractData>) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'cnh' | 'crlv' | 'residencia';
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onDataExtracted }) => {
  const [files, setFiles] = useState<Record<string, UploadedFile | null>>({
    cnh: null,
    crlv: null,
    residencia: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRefs = {
    cnh: useRef<HTMLInputElement>(null),
    crlv: useRef<HTMLInputElement>(null),
    residencia: useRef<HTMLInputElement>(null)
  };

  const handleFileChange = (type: 'cnh' | 'crlv' | 'residencia') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({
        ...prev,
        [type]: {
          id: Math.random().toString(36).substring(7),
          file,
          preview: URL.createObjectURL(file),
          type
        }
      }));
    }
  };

  const removeFile = (type: string) => {
    setFiles(prev => ({ ...prev, [type]: null }));
  };

  const processDocuments = async () => {
    const activeFiles = Object.values(files).filter((f): f is UploadedFile => f !== null);
    if (activeFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const images = await Promise.all(activeFiles.map(async (f) => {
        const reader = new FileReader();
        return new Promise<{ mimeType: string; data: string }>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({ mimeType: f.file.type, data: base64 });
          };
          reader.readAsDataURL(f.file);
        });
      }));

      const extractedData = await extractDataFromDocuments(images);
      onDataExtracted(extractedData);
    } catch (error) {
      console.error("Erro ao processar documentos:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const docTypes = [
    { id: 'cnh', label: 'CNH (Motorista)', icon: <FileText size={20} /> },
    { id: 'crlv', label: 'Documento Veículo (CRLV)', icon: <Car size={20} /> },
    { id: 'residencia', label: 'Comprovante Residência', icon: <Home size={20} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docTypes.map((doc) => (
          <div 
            key={doc.id}
            onClick={() => !files[doc.id] && fileInputRefs[doc.id as keyof typeof fileInputRefs].current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-6 text-center transition-all group overflow-hidden",
              files[doc.id] 
                ? "border-green-500 bg-green-50/30" 
                : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer",
              isProcessing && "opacity-50 pointer-events-none"
            )}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRefs[doc.id as keyof typeof fileInputRefs]}
              onChange={handleFileChange(doc.id as any)}
            />
            
            {files[doc.id] ? (
              <div className="space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <img 
                    src={files[doc.id]?.preview} 
                    alt={doc.label} 
                    className="w-full h-full object-cover rounded-xl border border-green-200 shadow-sm" 
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(doc.id); }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">{doc.label}</p>
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <CheckCircle size={14} />
                  <span className="text-[10px] font-medium">Pronto</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                  {doc.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">{doc.label}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Clique para enviar</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <button
          onClick={processDocuments}
          disabled={isProcessing || Object.values(files).every(f => f === null)}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all shadow-lg shadow-blue-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Extraindo Dados com IA...
            </>
          ) : (
            <>
              <CheckCircle size={24} />
              Preencher Contrato Automaticamente
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">
          A nossa IA irá ler os documentos e preencher o formulário para você.
        </p>
      </div>
    </div>
  );
};
