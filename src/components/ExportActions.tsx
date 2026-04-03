import React, { useState } from 'react';
import { Share2, Printer, Download, MessageSquare, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ContractData } from '../types';

interface ExportActionsProps {
  data: ContractData;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ data }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('contract-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`contrato_${data.locatarioNome.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente imprimir como PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    const text = `Olá, aqui está o contrato de aluguel do veículo para ${data.locatarioNome}.
Veículo: ${data.veiculoMarca} ${data.veiculoModelo}
Placa: ${data.veiculoPlaca}
Valor Entrada: R$ ${data.valorEntrada.toLocaleString('pt-BR')}
Valor Parcela: R$ ${data.valorParcela.toLocaleString('pt-BR')} x ${data.numeroParcelas}
Vencimento: Dia ${data.diaVencimento}`;

    const encodedText = encodeURIComponent(text);
    const phoneNumber = data.locatarioTelefone?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center py-8">
      <ActionButton 
        onClick={handleWhatsApp}
        icon={<MessageSquare size={20} />}
        label="Enviar via WhatsApp"
        className="bg-green-500 hover:bg-green-600 shadow-green-100"
      />
      <ActionButton 
        onClick={handlePrint}
        icon={<Printer size={20} />}
        label="Imprimir Contrato"
        className="bg-gray-700 hover:bg-gray-800 shadow-gray-100"
      />
      <ActionButton 
        onClick={handleDownloadPDF}
        icon={isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
        label={isDownloading ? "Gerando PDF..." : "Baixar em PDF"}
        disabled={isDownloading}
        className="bg-blue-600 hover:bg-blue-700 shadow-blue-100"
      />
    </div>
  );
};

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed ${className}`}
  >
    {icon}
    {label}
  </button>
);
