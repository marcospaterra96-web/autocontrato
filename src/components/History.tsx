import React, { useEffect, useState } from 'react';
import { getMyContracts, SavedContract, deleteContract } from '../services/contractService';
import { FileText, Calendar, User, Car, Loader2, ChevronRight, Search, Trash2, AlertTriangle, X } from 'lucide-react';
import { ContractData } from '../types';
import { cn } from '../lib/utils';

interface HistoryProps {
  onSelect: (contract: ContractData) => void;
}

export const History: React.FC<HistoryProps> = ({ onSelect }) => {
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contractToDelete, setContractToDelete] = useState<SavedContract | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContracts = async () => {
    try {
      const data = await getMyContracts();
      setContracts(data || []);
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDelete = async () => {
    if (!contractToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteContract(contractToDelete.id);
      setContracts(prev => prev.filter(c => c.id !== contractToDelete.id));
      setContractToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir contrato:", error);
      alert("Erro ao excluir contrato. Verifique suas permissões.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.locatarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.veiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.veiculoModelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, placa ou modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Nenhum contrato encontrado</h3>
          <p className="text-gray-500">Tente buscar por outro termo ou gere um novo contrato.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <div 
              key={contract.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group relative"
              onClick={() => onSelect(contract)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Car size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Calendar size={12} />
                    {contract.createdAt.toDate().toLocaleDateString('pt-BR')}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContractToDelete(contract);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir Contrato"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Locatário</p>
                  <p className="text-gray-900 font-semibold truncate flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {contract.locatarioNome}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Veículo</p>
                  <p className="text-gray-700 text-sm truncate">
                    {contract.veiculoMarca} {contract.veiculoModelo} - {contract.veiculoPlaca}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-blue-600 font-bold text-sm">
                Ver Contrato
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {contractToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={() => setContractToDelete(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Excluir Contrato?</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir o contrato de <strong>{contractToDelete.locatarioNome}</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setContractToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:bg-red-400"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Trash2 size={18} />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
