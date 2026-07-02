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
    name: "Residencial Villa Lobos - Bloco C",
    phone: "(11) 98765-4321",
    email: "financeiro@villaloboscondo.com.br",
    date: new Date().toISOString().split("T")[0],
    address: "Rua dos Pinheiros, 450 - Pinheiros, São Paulo - SP",
  },
  professional: {
    name: "Roberto D'Ponte",
    phone: "(11) 99999-8888",
    email: "contato@dpontearteferro.com.br",
    document: "12.345.678/0001-90",
    companyName: "D'Ponte Arte em Ferro",
    logo: null,
  },
  areas: [
    {
      id: "1",
      name: "Grade de Proteção Externa (Estilo Colonial Trabalhado)",
      width: 12.0,
      length: 1.5,
      valuePerM2: 280.0,
    },
    {
      id: "2",
      name: "Portão Basculante Principal de Ferro Maciço",
      width: 4.5,
      length: 2.4,
      valuePerM2: 350.0,
    },
    {
      id: "3",
      name: "Corrimão de Escada Interna Caracol (Ornato Clássico)",
      width: 1.2,
      length: 6.0,
      valuePerM2: 190.0,
    },
  ],
  additionals: [
    {
      id: "add-1",
      description: "Pintura Eletrostática a Pó Premium (Preto Fosco Microtexturizado)",
      quantity: 1,
      unitValue: 2450.0,
    },
    {
      id: "add-2",
      description: "Serviço de Solda Mig e Instalação Estrutural no Local",
      quantity: 1,
      unitValue: 1200.0,
    },
    {
      id: "add-3",
      description: "Frete e Transporte de Peças Pesadas em Caminhão Munck",
      quantity: 1,
      unitValue: 650.0,
    },
  ],
  observations: "1. Força e Tradição: Todo o trabalho é fabricado de forma artesanal com garantia de durabilidade e resistência contra intempéries.\n2. Tratamento Anticorrosivo: Todas as peças recebem banho de fundo fosfatizante e pintura eletrostática a pó.\n3. Instalação: Inclusa no valor total apresentado nesta proposta.",
  validity: "15 dias a partir da data de emissão",
  paymentTerms: "50% de sinal na aprovação do projeto técnico e 50% na conclusão da instalação.",
  deadline: "25 dias úteis a contar do sinal e liberação do vão para medição final",
  theme: "arte-em-ferro",
};
