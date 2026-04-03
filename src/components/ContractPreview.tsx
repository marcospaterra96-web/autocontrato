import React from 'react';
import { ContractData } from '../types';
import { cn } from '../lib/utils';

interface ContractPreviewProps {
  data: Partial<ContractData>;
  className?: string;
}

export const ContractPreview: React.FC<ContractPreviewProps> = ({ data, className }) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR');

  return (
    <div id="contract-content" className={cn("bg-white p-12 text-black font-serif text-[12px] leading-relaxed max-w-[800px] mx-auto shadow-lg", className)}>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold underline">Contrato de Aluguel com Direito a compra</h1>
        <h2 className="text-lg font-bold">E Recibo de Entrega de Veículo</h2>
      </div>

      <div className="mb-6">
        <p><strong>LOCADORA VMP LOCAÇÕES</strong> Inscrita no <strong>CNPJ 45.224.617/0001-29</strong></p>
        <p>Com sede a Av Higino Marque 386 centro cep 18.407-120 Itapeva – SP</p>
      </div>

      <div className="mb-6">
        <p><strong>LOCATARIO:</strong> {data.locatarioNome || '________________________________'} Portador do <strong>CPF: {data.locatarioCpf || '________________'}</strong> e do <strong>RG {data.locatarioRg || '________________'}</strong></p>
        <p>Residente e domiciliado a {data.locatarioEndereco || '________________________________________________________________'}</p>
        <p><strong>TELEFONE:</strong> {data.locatarioTelefone || '________________'} <strong>email:</strong> {data.locatarioEmail || '________________'}</p>
      </div>

      <div className="mb-6">
        <p className="font-bold underline">VEICULO DO CONTRATO - (CARRO, UTILITÁRIO E/OU MOTOCICLETA )</p>
        <div className="grid grid-cols-2 gap-x-4">
          <p><strong>MARCA:</strong> {data.veiculoMarca || '________________'}</p>
          <p><strong>MODELO:</strong> {data.veiculoModelo || '________________'}</p>
          <p><strong>COR:</strong> {data.veiculoCor || '________________'}</p>
          <p><strong>COM:</strong> {data.veiculoCombustivel || '________________'}</p>
          <p><strong>PLACA:</strong> {data.veiculoPlaca || '________________'}</p>
          <p><strong>RENAVAM:</strong> {data.veiculoRenavam || '________________'}</p>
          <p><strong>CHASSIS:</strong> {data.veiculoChassis || '________________'}</p>
        </div>
        <p><strong>NOME:</strong> {data.veiculoNomeFinanciado || '________________'}</p>
      </div>

      <div className="mb-6">
        <p className="font-bold">DOCUMENTAÇÃO EXERCICIO 2026 TUDO OK</p>
        <p className="mt-2">
          <strong>3.1</strong> Constitui Objeto do contrato de Aluguel com Direito de Compra ,o veículo (carro ou moto) acima Descrito (item 3) para a 
          posse e uso do carro pelo cliente, exclusivamente em territorio nacional, durante o pagamento dos aluguéis (parcelas)do veículo, 
          Certo que o carro/moto da locadora não poderá ser objeto de uso inadequado e ilegal. <span className="underline font-bold">Veiculo não poderá ser vendido enquanto não quitar as parcelas.</span>
        </p>
      </div>

      <div className="mb-6">
        <p className="font-bold underline">4 - DO PAGAMENTO "ALUGUEL-PARCELA,CUSTOS E MULTAS"</p>
        <p className="text-red-600 font-bold mt-2">DINHEIRO/TRANFERENCIA: R$ {data.valorEntrada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '10.000,00'} NO ATO.</p>
        <p className="font-bold">FORMA DE PAGAMENTO PIX 11943139557 VICTOR MORAES PATERRA VEICULOS LTDA - AG SANTANDER</p>
        
        <p className="text-red-600 font-bold mt-4">RESTANTE SERA PAGO EM – {data.numeroParcelas || '60'} X {data.valorParcela?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '604,00'} ( BOLETO ASAAS )</p>
        <p className="text-red-600 font-bold underline">INICIADAS EM {data.dataVencimentoPrimeira || '27.04.2026'}– VENCENDO TODO DIA {data.diaVencimento || '27'} DE CADA MÊS SUBCEQUENTE.</p>
        <p className="text-red-600 font-bold bg-yellow-300 inline-block px-1">APÓS 5 (CINCO ) DIAS DE ATRASO NOME SERA PROTESTADO EM CARTORIO</p>
        <p className="text-red-600 font-bold mt-2 underline">IPVA 2025 POR CONTA DO CLIENTE</p>
      </div>

      <div className="space-y-4 text-justify">
        <p>
          <strong>4.2</strong> "CLIENTE" CIENTE QUE O "RECIBO DE COMPRA E VENDA" SÓ SERÁ ENTREGUE APÓS A QUITAÇÃO TOTAL DO 
          CARRO/MOTO, PARA QUE O LOCATÁRIO"CLIENTE" FAÇA A TRANFERÊNCIA DA TITULARIDADE; AS PARTES CONCORDAM 
          QUE, O VEÍCULO FICARA EM NOME DA LOCADORA ATÉ O PAGAMENTO DE TODAS PARCELAS ACIMA DESCRITAS.
        </p>
        <p>
          <strong>4.3</strong> CASO TRANSCORRAM 10 (DEZ) DIAS DE ATRASO NO PAGAMENTO DE QUALQUER PARCELA, O CONTRATO SERA 
          AUTOMATICAMENTE RESCINDIDO POR CULPA DO LOCATÁRIO E O VEÍCULO SERÁ DEVOLVIDO IMEDIATAMENTE À 
          LOCADORA, SEM QULQUER DEVOLUÇÃO DOS VALORES PAGOS PELO "CLIENTE.
        </p>
        <p>
          <strong>4.4</strong> - CASO O LOCATÁRIO ENTREGUE O VEÍCULO NA LOJA PARA A DESISTÊNCIA DO NEGÓCIO DEVERÁ COMPARECER 
          PARA ASSINAR O TERMO DE ENTREGA E EFETUAR O PAGAMENTO DE EVENTUAIS PARCELAS EM ATRASO OU DÉBITOS DO 
          VEÍCULO, JUNTO AOS ORGÃOS NENHUM VALOR SERÁ DEVOLVIDO PELO TEMPO DE ALUGUEL DO CARRO (USUFRUTO).
        </p>
        <p>
          <strong>4.5</strong> - AS PARTES CONVENCIONAM QUE AS MULTAS DEVERÁ SER INFORMADAS À LOCADORA, COM A INDICAÇÃO DO 
          CONDUTOR RESPONSÁVEL PARA PROVIDÊNCIAS JUNTO AO DETRAN. (CASO LOCATÁRIO NÃO INDIQUE O CONDUTOR DAS 
          MULTAS TOMADAS PELO MESMO, A INDICAÇÃO SERÁ DE R$100,00 (CEM REAIS) POR MULTA.
        </p>
        <p className="text-red-600 font-bold">4.6 - O PAGAMENTO DO IPVA 2025 E LICENCIAMENTO 2025 POR CONTA DO LOCATÁRIO</p>
        <p>
          <strong>4.7</strong> - AS MULTAS ,DEMAIS CUSTOS COM IPVA, DPVAT E LICENCIAMENTO, EVENTUAIS DANOS E AVARIAS NO VEÍCULO SÃO 
          DE RESPONSABILIDADE EXCLUSIVA DO LOCATÁRIO "CLIENTE" A PARTIR DA DATA DE HOJE.
        </p>
        <p className="text-red-600 font-bold">
          4.8 - O LOCATÁRIO ESTÁ CIENTE QUE O VEICULO FOI LOCADO NO ESTADO EM QUE SE ENCONTRA E SEM QUALQUER 
          GARANTIA POR PARTE DA LOCADORA
        </p>
        <p className="text-red-600 font-bold">
          &gt; VEICULO LEVADO PARA TESTE E EM MECANICO DE CONFIANCA DO CLIENTE ANTES DE FECHAR NEGOCIO. TODOS OS 
          DETALHES DO VEICULO VISTOS PREVIAMENTE PELO CLIENTE
        </p>
        <p>
          <strong>4.9</strong> - A Locadora não efetuará substituição da carro/moto em casa de furto, Roubo, Incêndio, colisão, apropriação indébita, apreensão pelas 
          autoridades competentes perda, furto ou roubo de chaves e documentos ou pane provocada por uso inadequado do carro SENDO 
        </p>
      </div>

      <div className="mt-12 pt-12 border-t border-black">
        <p className="text-center font-bold mb-8">
          Data da Entrega do Veículo {data.dataEntrega || 'SEXTA-FEIRA 27 MARÇO de 2026'} as {data.horaEntrega || '14:00'} hrs
        </p>
        <p className="text-center text-red-600 font-bold mb-12">
          O veiculo sera entregue no {data.localEntrega || 'posto de combustivel da cidade de taquarituba sp'}
        </p>

        <div className="flex justify-between mt-20">
          <div className="text-center w-1/2 px-4">
            <div className="border-t border-black pt-2">
              <p>{data.locatarioNome || 'Danilo Jose Neves'}</p>
              <p>CPF: {data.locatarioCpf || '312.873.708-88'}</p>
            </div>
          </div>
          <div className="text-center w-1/2 px-4">
            <div className="border-t border-black pt-2">
              <p>VMP LOCAÇÕES CNPJ : 45.224.617/0001-29</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
