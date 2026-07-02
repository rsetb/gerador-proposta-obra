import { Proposal } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatAreaSize(width: number, length: number): string {
  const size = width * length;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(size) + " m²";
}

export function calculateAreaM2(width: number, length: number): number {
  return width * length;
}

export function calculateAreaSubtotal(width: number, length: number, valuePerM2: number): number {
  return width * length * valuePerM2;
}

export function calculateAdditionalSubtotal(quantity: number, unitValue: number): number {
  return quantity * unitValue;
}

export const initialProposal: Proposal = {
  client: {
    name: "Construções & Incorporações Silva Ltda.",
    phone: "(11) 98765-4321",
    email: "contato@silvaincorporadora.com.br",
    date: new Date().toISOString().split("T")[0],
    address: "Avenida das Nações Unidas, 12901 - Brooklin Paulista, São Paulo - SP",
  },
  professional: {
    name: "Eng. Roberto Vasconcelos",
    phone: "(11) 99999-8888",
    email: "roberto@vasconcelosengenharia.com.br",
    document: "12.345.678/0001-90",
    companyName: "Vasconcelos Engenharia & Reformas",
  },
  areas: [
    {
      id: "1",
      name: "Sala de Estar (Revestimento e Pintura)",
      width: 4.5,
      length: 6.0,
      valuePerM2: 120.0,
    },
    {
      id: "2",
      name: "Cozinha Americana (Instalação de Porcelanato)",
      width: 3.5,
      length: 4.0,
      valuePerM2: 150.0,
    },
    {
      id: "3",
      name: "Suíte Master (Regularização de Piso e Gesso)",
      width: 4.0,
      length: 5.0,
      valuePerM2: 95.0,
    },
  ],
  additionals: [
    {
      id: "add-1",
      description: "Caçamba para retirada de entulho (3 unidades)",
      quantity: 3,
      unitValue: 350.0,
    },
    {
      id: "add-2",
      description: "Mão de obra para revisão de pontos elétricos e hidráulicos",
      quantity: 1,
      unitValue: 1200.0,
    },
    {
      id: "add-3",
      description: "Saco de Cimento CP-II Itaú (50kg)",
      quantity: 15,
      unitValue: 38.5,
    },
  ],
  observations: "1. Os materiais de acabamento (porcelanatos, tintas especiais, luminárias) serão fornecidos pelo cliente.\n2. A contratada disponibilizará todas as ferramentas, EPIs e mão de obra qualificada.\n3. Garantia de 5 anos sobre defeitos estruturais e de impermeabilização.",
  validity: "15 dias a partir da data de emissão",
  paymentTerms: "40% de sinal na assinatura do contrato, 30% na metade do cronograma e 30% na entrega das chaves.",
  deadline: "30 dias úteis a contar do início das atividades",
};
