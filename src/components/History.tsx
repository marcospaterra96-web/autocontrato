import React, { useEffect, useState } from 'react';
import { getMyContracts, SavedContract } from '../services/contractService';
import { FileText, Calendar, User, Car, Loader2, ChevronRight, Search } from 'lucide-react';
import { ContractData } from '../types';

interface HistoryProps {
  onSelect: (contract: ContractData) => void;
}

export const History: React.FC<HistoryProps> = ({ onSelect }) => {
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await getMyContracts();
        setContracts(data);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

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
              onClick={() => onSelect(contract)}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Car size={24} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Calendar size={12} />
                    {contract.createdAt.toDate().toLocaleDateString('pt-BR')}
                  </p>
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
    </div>
  );
};
