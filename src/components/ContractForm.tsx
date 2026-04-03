import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from 'lucide-react';
import { ContractData } from '../types';
import { cn } from '../lib/utils';

const contractSchema = z.object({
  locatarioNome: z.string().min(1, "Nome é obrigatório"),
  locatarioCpf: z.string().min(1, "CPF é obrigatório"),
  locatarioRg: z.string().min(1, "RG é obrigatório"),
  locatarioEndereco: z.string().min(1, "Endereço é obrigatório"),
  locatarioTelefone: z.string().optional(),
  locatarioEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  
  veiculoMarca: z.string().min(1, "Marca é obrigatória"),
  veiculoModelo: z.string().min(1, "Modelo é obrigatório"),
  veiculoCor: z.string().min(1, "Cor é obrigatória"),
  veiculoCombustivel: z.string().min(1, "Combustível é obrigatório"),
  veiculoPlaca: z.string().min(1, "Placa é obrigatória"),
  veiculoRenavam: z.string().min(1, "RENAVAM é obrigatória"),
  veiculoChassis: z.string().min(1, "CHASSIS é obrigatório"),
  veiculoNomeFinanciado: z.string().min(1, "Nome do proprietário é obrigatório"),
  veiculoDocumentacao: z.string().min(1, "Documentação é obrigatória"),

  valorEntrada: z.number().min(0),
  valorParcela: z.number().min(0),
  numeroParcelas: z.number().min(1),
  dataVencimentoPrimeira: z.string(),
  diaVencimento: z.number().min(1).max(31),

  dataEntrega: z.string(),
  horaEntrega: z.string(),
  localEntrega: z.string(),
}) satisfies z.ZodType<ContractData>;

interface ContractFormProps {
  initialData: Partial<ContractData>;
  onChange: (data: Partial<ContractData>) => void;
  onSubmit: (data: ContractData) => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ initialData, onChange, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ContractData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      valorEntrada: 10000,
      valorParcela: 604,
      numeroParcelas: 60,
      diaVencimento: 27,
      dataVencimentoPrimeira: '2026-04-27',
      dataEntrega: '2026-03-27',
      horaEntrega: '14:00',
      localEntrega: 'posto de combustivel da cidade de taquarituba sp',
      veiculoDocumentacao: 'DOCUMENTAÇÃO EXERCICIO 2026 TUDO OK',
      ...initialData
    }
  });

  // Watch for changes and update preview
  React.useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as Partial<ContractData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Dados do Locatário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome Completo" {...register('locatarioNome')} error={errors.locatarioNome?.message} />
          <Input label="CPF" {...register('locatarioCpf')} error={errors.locatarioCpf?.message} />
          <Input label="RG" {...register('locatarioRg')} error={errors.locatarioRg?.message} />
          <Input label="Endereço Completo" {...register('locatarioEndereco')} error={errors.locatarioEndereco?.message} />
          <Input label="Telefone" {...register('locatarioTelefone')} error={errors.locatarioTelefone?.message} />
          <Input label="Email" {...register('locatarioEmail')} error={errors.locatarioEmail?.message} />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Dados do Veículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Marca" {...register('veiculoMarca')} error={errors.veiculoMarca?.message} />
          <Input label="Modelo" {...register('veiculoModelo')} error={errors.veiculoModelo?.message} />
          <Input label="Cor" {...register('veiculoCor')} error={errors.veiculoCor?.message} />
          <Input label="Combustível" {...register('veiculoCombustivel')} error={errors.veiculoCombustivel?.message} />
          <Input label="Placa" {...register('veiculoPlaca')} error={errors.veiculoPlaca?.message} />
          <Input label="RENAVAM" {...register('veiculoRenavam')} error={errors.veiculoRenavam?.message} />
          <Input label="CHASSIS" {...register('veiculoChassis')} error={errors.veiculoChassis?.message} />
          <Input label="Proprietário/Financiado" {...register('veiculoNomeFinanciado')} error={errors.veiculoNomeFinanciado?.message} />
          <Input label="Status da Documentação" {...register('veiculoDocumentacao')} error={errors.veiculoDocumentacao?.message} className="md:col-span-2" />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Condições de Pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Valor Entrada (R$)" type="number" step="0.01" {...register('valorEntrada', { valueAsNumber: true })} error={errors.valorEntrada?.message} />
          <Input label="Valor Parcela (R$)" type="number" step="0.01" {...register('valorParcela', { valueAsNumber: true })} error={errors.valorParcela?.message} />
          <Input label="Nº de Parcelas" type="number" {...register('numeroParcelas', { valueAsNumber: true })} error={errors.numeroParcelas?.message} />
          <Input label="Data 1ª Parcela" type="date" {...register('dataVencimentoPrimeira')} error={errors.dataVencimentoPrimeira?.message} />
          <Input label="Dia de Vencimento" type="number" {...register('diaVencimento', { valueAsNumber: true })} error={errors.diaVencimento?.message} />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Entrega do Veículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Data de Entrega" type="date" {...register('dataEntrega')} error={errors.dataEntrega?.message} />
          <Input label="Hora de Entrega" type="time" {...register('horaEntrega')} error={errors.horaEntrega?.message} />
          <Input label="Local de Entrega" {...register('localEntrega')} error={errors.localEntrega?.message} className="md:col-span-3" />
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          Por favor, preencha todos os campos obrigatórios corretamente.
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200"
      >
        Gerar Contrato Final
      </button>
    </form>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(
  ({ label, error, className, ...props }, ref) => (
    <div className={cn("space-y-1", className)}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
          error && "border-red-500 focus:ring-red-500"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
