import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Login } from './components/Login';
import { FileUploader } from './components/FileUploader';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { ExportActions } from './components/ExportActions';
import { History } from './components/History';
import { ContractData } from './types';
import { saveContract } from './services/contractService';
import { LogOut, FileText, Upload, Edit3, Eye, Car, History as HistoryIcon, Plus, AlertTriangle } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'upload' | 'edit' | 'preview' | 'history';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('upload');
  const [contractData, setContractData] = useState<Partial<ContractData>>({});
  const [finalData, setFinalData] = useState<ContractData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const isAdmin = user?.email === 'marcospaterra96@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        testConnection();
      }
    });
    return () => unsubscribe();
  }, []);

  async function testConnection() {
    try {
      // Test connection to Firestore
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
        setConnectionError(true);
      }
    }
  }

  const handleLogout = () => signOut(auth);

  const handleDataExtracted = (data: Partial<ContractData>) => {
    setContractData(prev => ({ ...prev, ...data }));
    setStep('edit');
  };

  const handleFormChange = (data: Partial<ContractData>) => {
    setContractData(prev => ({ ...prev, ...data }));
  };

  const handleFormSubmit = async (data: ContractData) => {
    setIsSaving(true);
    try {
      await saveContract(data);
      setFinalData(data);
      setStep('preview');
    } catch (error) {
      console.error("Erro ao salvar contrato:", error);
      // Still show preview even if save fails
      setFinalData(data);
      setStep('preview');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectHistory = (data: ContractData) => {
    setFinalData(data);
    setContractData(data);
    setStep('preview');
  };

  const startNewContract = () => {
    setContractData({});
    setFinalData(null);
    setStep('upload');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        {connectionError && (
          <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            Erro de conexão com o banco de dados. Verifique sua configuração do Firebase.
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-100">
              <Car size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">VMP Veículos</h1>
              <p className="text-xs text-gray-500 font-medium">Gerador de Contratos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2 mr-4 border-r border-gray-100 pr-4">
              <NavButton active={step !== 'history'} onClick={startNewContract} icon={<Plus size={18} />} label="Novo Contrato" />
              <NavButton active={step === 'history'} onClick={() => setStep('history')} icon={<HistoryIcon size={18} />} label="Histórico" />
            </nav>

            <div className="hidden sm:block text-right">
              <div className="flex items-center gap-2 justify-end">
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-amber-200">
                    Admin
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-900">{user.email}</p>
              </div>
              <p className="text-xs text-gray-500">Usuário Autenticado</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {step !== 'history' && (
          <div className="mb-12 flex justify-center">
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto max-w-full">
              <StepButton 
                active={step === 'upload'} 
                done={!!contractData.locatarioNome || step !== 'upload'} 
                icon={<Upload size={18} />} 
                label="Upload" 
                onClick={() => setStep('upload')}
              />
              <div className="w-8 h-px bg-gray-200 flex-shrink-0" />
              <StepButton 
                active={step === 'edit'} 
                done={!!finalData || step === 'preview'} 
                icon={<Edit3 size={18} />} 
                label="Preenchimento" 
                onClick={() => setStep('edit')}
              />
              <div className="w-8 h-px bg-gray-200 flex-shrink-0" />
              <StepButton 
                active={step === 'preview'} 
                done={false} 
                icon={<Eye size={18} />} 
                label="Visualização" 
                onClick={() => setStep('preview')}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 'upload' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Comece por aqui</h2>
                  <p className="text-gray-500 mt-2">Faça o upload dos documentos para extração automática de dados ou preencha manualmente.</p>
                </div>
                <FileUploader onDataExtracted={handleDataExtracted} />
                
                <div className="mt-8 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-gray-50 px-4 text-gray-400 font-medium">Ou se preferir</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('edit')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                  >
                    <Edit3 size={20} />
                    Preencher Manualmente
                  </button>
                </div>
              </div>
            )}

            {step === 'edit' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Confirme os Dados</h2>
                    <button 
                      onClick={() => setStep('upload')}
                      className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                      Refazer Upload
                    </button>
                  </div>
                  <ContractForm 
                    initialData={contractData} 
                    onChange={handleFormChange}
                    onSubmit={handleFormSubmit}
                  />
                </div>
                <div className="sticky top-24 hidden lg:block">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Eye size={16} />
                    Prévia em Tempo Real
                  </h3>
                  <div className="transform scale-[0.6] origin-top shadow-2xl rounded-lg overflow-hidden border border-gray-200">
                    <ContractPreview data={contractData} />
                  </div>
                </div>
              </div>
            )}

            {step === 'preview' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className={cn(
                  "flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl text-white shadow-lg",
                  finalData ? "bg-green-600 shadow-green-100" : "bg-blue-600 shadow-blue-100"
                )}>
                  <div>
                    <h2 className="text-2xl font-bold">{finalData ? "Contrato Finalizado!" : "Prévia do Contrato"}</h2>
                    <p className={finalData ? "text-green-100" : "text-blue-100"}>
                      {finalData ? "O contrato foi salvo e está pronto para exportação." : "Esta é uma prévia. Clique em 'Gerar Contrato Final' no formulário para salvar."}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStep('edit')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
                    >
                      {finalData ? "Editar Novamente" : "Voltar ao Formulário"}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                  <ContractPreview data={finalData || contractData} />
                </div>

                {finalData && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-center font-bold text-gray-900 mb-6">Ações Disponíveis</h3>
                    <ExportActions data={finalData} />
                  </div>
                )}
                
                {!finalData && (
                  <div className="text-center">
                    <button 
                      onClick={() => setStep('edit')}
                      className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      Voltar para Gerar Contrato
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 'history' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900">Histórico de Contratos</h2>
                  <button 
                    onClick={startNewContract}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Plus size={20} />
                    Novo Contrato
                  </button>
                </div>
                <History onSelect={handleSelectHistory} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2026 VMP Veículos - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

const StepButton: React.FC<{ active: boolean; done: boolean; icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; }> = ({ active, done, icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold text-sm whitespace-nowrap",
      active ? "bg-blue-600 text-white shadow-md shadow-blue-100" : 
      done ? "text-green-600 bg-green-50" : "text-gray-400 hover:bg-gray-50",
      disabled && "opacity-50 cursor-not-allowed grayscale"
    )}
  >
    <span className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
      active ? "bg-white text-blue-600" : 
      done ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
    )}>
      {done ? <CheckCircleIcon size={14} /> : icon}
    </span>
    {label}
  </button>
);

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void; }> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold text-sm",
      active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
    )}
  >
    {icon}
    {label}
  </button>
);

const CheckCircleIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
