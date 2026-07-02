export interface ClientData {
  name: string;
  phone: string;
  email: string;
  date: string;
  address: string;
}

export interface AreaItem {
  id: string;
  name: string;
  width: number;
  length: number;
  valuePerM2: number;
}

export interface AdditionalItem {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
}

export interface ProfessionalData {
  name: string;
  phone: string;
  email: string;
  document: string; // CNPJ or CPF
  companyName: string;
  logo?: string | null; // Base64 or URL
}

export interface Proposal {
  id?: string;
  title?: string;
  client: ClientData;
  professional: ProfessionalData;
  areas: AreaItem[];
  additionals: AdditionalItem[];
  observations: string;
  validity: string;
  paymentTerms: string;
  deadline: string;
  theme?: "default" | "arte-em-ferro" | "pintura-eletrostatica";
}
