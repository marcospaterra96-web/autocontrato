export interface ContractData {
  // Locatário
  locatarioNome: string;
  locatarioCpf: string;
  locatarioRg: string;
  locatarioEndereco: string;
  locatarioTelefone?: string;
  locatarioEmail?: string;

  // Veículo
  veiculoMarca: string;
  veiculoModelo: string;
  veiculoCor: string;
  veiculoCombustivel: string;
  veiculoPlaca: string;
  veiculoRenavam: string;
  veiculoChassis: string;
  veiculoNomeFinanciado: string;

  // Pagamento
  valorEntrada: number;
  valorParcela: number;
  numeroParcelas: number;
  dataVencimentoPrimeira: string;
  diaVencimento: number;

  // Entrega
  dataEntrega: string;
  horaEntrega: string;
  localEntrega: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
