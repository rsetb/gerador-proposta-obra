import React from "react";
import { Proposal } from "../types";
import { formatCurrency, formatAreaSize, calculateAreaM2, calculateAreaSubtotal, calculateAdditionalSubtotal } from "../utils";
import { FileText, Calendar, MapPin, User, Building, Phone, Mail, Award, CheckSquare, Hash } from "lucide-react";

interface ProposalPreviewProps {
  proposal: Proposal;
}

export default function ProposalPreview({ proposal }: ProposalPreviewProps) {
  // Calculations
  const totalAreasValue = proposal.areas.reduce(
    (sum, area) => sum + calculateAreaSubtotal(area.width, area.length, area.valuePerM2),
    0
  );

  const totalAdditionalsValue = proposal.additionals.reduce(
    (sum, item) => sum + calculateAdditionalSubtotal(item.quantity, item.unitValue),
    0
  );

  const totalProposalValue = totalAreasValue + totalAdditionalsValue;

  const totalM2 = proposal.areas.reduce(
    (sum, area) => sum + calculateAreaM2(area.width, area.length),
    0
  );

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div
      id="proposal-document"
      className="bg-white text-slate-800 shadow-xl rounded-2xl p-6 md:p-12 max-w-[21cm] mx-auto border border-slate-100 font-sans print:shadow-none print:p-0 print:border-none print:mx-0 print:w-full"
    >
      {/* HEADER DO DOCUMENTO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b-2 border-slate-100 print:pb-6">
        <div>
          {proposal.professional.companyName ? (
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="h-6 w-1.5 bg-indigo-600 rounded-full inline-block"></span>
              {proposal.professional.companyName}
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="h-6 w-1.5 bg-indigo-600 rounded-full inline-block"></span>
              Proposta Comercial de Obra
            </h1>
          )}
          {proposal.professional.name && (
            <p className="text-sm font-medium text-slate-600 mt-1">
              Responsável: {proposal.professional.name}
            </p>
          )}
          {proposal.professional.document && (
            <p className="text-xs text-slate-400 mt-0.5">
              CNPJ/CPF: {proposal.professional.document}
            </p>
          )}
        </div>

        <div className="text-left md:text-right space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider print:bg-slate-100 print:text-slate-700">
            <FileText className="w-3.5 h-3.5" /> Proposta de Prestação de Serviço
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center md:justify-end gap-1">
            <Hash className="w-3.5 h-3.5" />
            <span className="font-semibold">Nº PROP-{new Date(proposal.client.date || Date.now()).getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</span>
          </p>
          <p className="text-xs text-slate-400 flex items-center md:justify-end gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Emissão: {formatDate(proposal.client.date)}</span>
          </p>
        </div>
      </div>

      {/* DADOS DE CONTATO DO PRESTADOR E CLIENTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100 print:py-6 text-sm">
        {/* Contratada / Profissional */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 print:text-slate-600">
            PRESTADOR (CONTRATADA)
          </h3>
          <div className="space-y-2 text-slate-600">
            <p className="font-semibold text-slate-900">
              {proposal.professional.name || "Não informado"}
            </p>
            {proposal.professional.companyName && (
              <p className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{proposal.professional.companyName}</span>
              </p>
            )}
            {proposal.professional.phone && (
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{proposal.professional.phone}</span>
              </p>
            )}
            {proposal.professional.email && (
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{proposal.professional.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Cliente */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 print:text-slate-600">
            CLIENTE (CONTRATANTE)
          </h3>
          <div className="space-y-2 text-slate-600">
            <p className="font-semibold text-slate-900">
              {proposal.client.name || "Não informado"}
            </p>
            {proposal.client.phone && (
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{proposal.client.phone}</span>
              </p>
            )}
            {proposal.client.email && (
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{proposal.client.email}</span>
              </p>
            )}
            {proposal.client.address && (
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{proposal.client.address}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CORPO 1: METRAGEM E VALORES POR CÔMODO */}
      <div className="py-8 border-b border-slate-100 print:py-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-amber-500 rounded-full"></span>
          1. Detalhamento de Áreas e Medições
        </h3>
        {proposal.areas.length === 0 ? (
          <p className="text-slate-400 italic text-sm">Nenhuma área ou cômodo detalhado nesta proposta.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-semibold uppercase">
                  <th className="py-3 px-2">Setor / Cômodo</th>
                  <th className="py-3 px-2 text-right">Dimensões</th>
                  <th className="py-3 px-2 text-right">Área Total</th>
                  <th className="py-3 px-2 text-right">Valor por m²</th>
                  <th className="py-3 px-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposal.areas.map((area) => {
                  const size = calculateAreaM2(area.width, area.length);
                  const subtotal = calculateAreaSubtotal(area.width, area.length, area.valuePerM2);

                  return (
                    <tr key={area.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                      <td className="py-3.5 px-2 font-medium text-slate-900">{area.name || "Cômodo sem nome"}</td>
                      <td className="py-3.5 px-2 text-right text-slate-500 font-mono text-xs">
                        {area.width.toFixed(2)}m × {area.length.toFixed(2)}m
                      </td>
                      <td className="py-3.5 px-2 text-right font-medium text-slate-700 font-mono text-xs">
                        {size.toFixed(2)} m²
                      </td>
                      <td className="py-3.5 px-2 text-right text-slate-600 font-mono text-xs">
                        {formatCurrency(area.valuePerM2)}
                      </td>
                      <td className="py-3.5 px-2 text-right font-semibold text-slate-900 font-mono text-xs">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-100 bg-slate-50/50 font-medium">
                  <td className="py-3 px-2 text-slate-600 font-semibold" colSpan={2}>
                    Total de Metragem Calculada
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900 font-mono text-xs">
                    {totalM2.toFixed(2)} m²
                  </td>
                  <td className="py-3 px-2" colSpan={1}></td>
                  <td className="py-3 px-2 text-right font-bold text-indigo-700 font-mono text-xs print:text-black">
                    {formatCurrency(totalAreasValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* CORPO 2: SERVIÇOS E ITENS ADICIONAIS */}
      <div className="py-8 border-b border-slate-100 print:py-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full"></span>
          2. Serviços e Materiais Adicionais
        </h3>
        {proposal.additionals.length === 0 ? (
          <p className="text-slate-400 italic text-sm">Nenhum serviço ou material adicional cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-semibold uppercase">
                  <th className="py-3 px-2">Descrição do Item / Serviço</th>
                  <th className="py-3 px-2 text-center w-24">Qtd</th>
                  <th className="py-3 px-2 text-right w-36">Valor Unitário</th>
                  <th className="py-3 px-2 text-right w-36">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposal.additionals.map((item) => {
                  const subtotal = calculateAdditionalSubtotal(item.quantity, item.unitValue);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                      <td className="py-3.5 px-2 text-slate-800">{item.description || "Sem descrição"}</td>
                      <td className="py-3.5 px-2 text-center text-slate-600 font-mono text-xs">{item.quantity}</td>
                      <td className="py-3.5 px-2 text-right text-slate-600 font-mono text-xs">
                        {formatCurrency(item.unitValue)}
                      </td>
                      <td className="py-3.5 px-2 text-right font-semibold text-slate-900 font-mono text-xs">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-100 bg-slate-50/50 font-medium">
                  <td className="py-3 px-2 text-slate-600 font-semibold" colSpan={3}>
                    Subtotal de Adicionais
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-indigo-700 font-mono text-xs print:text-black">
                    {formatCurrency(totalAdditionalsValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* CORPO 3: CONDIÇÕES E PRAZOS */}
      <div className="py-8 border-b border-slate-100 print:py-6 text-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-violet-500 rounded-full"></span>
          3. Prazos e Condições Comerciais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 rounded-xl p-5 border border-slate-100 print:bg-transparent print:p-0 print:border-none print:grid-cols-1 print:gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Validade da Proposta</span>
            <p className="font-medium text-slate-800">{proposal.validity || "Não informada"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Cronograma / Prazo</span>
            <p className="font-medium text-slate-800">{proposal.deadline || "Não informado"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Condições de Pagamento</span>
            <p className="font-medium text-slate-800">{proposal.paymentTerms || "Não informadas"}</p>
          </div>
        </div>

        {proposal.observations && (
          <div className="mt-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observações Gerais</span>
            <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/20 rounded-xl p-4 border border-dashed border-slate-200 print:border-none print:p-0">
              {proposal.observations}
            </div>
          </div>
        )}
      </div>

      {/* CORPO 4: RESUMO FINANCEIRO */}
      <div className="py-8 print:py-6">
        <div className="w-full md:w-80 ml-auto bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-lg print:shadow-none print:bg-slate-100 print:text-slate-800 print:border print:border-slate-300">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 print:border-slate-300 print:text-slate-500">
            Resumo da Proposta
          </h4>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 print:text-slate-600">Subtotal de Áreas:</span>
            <span className="font-mono font-medium">{formatCurrency(totalAreasValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 print:text-slate-600">Subtotal de Adicionais:</span>
            <span className="font-mono font-medium">{formatCurrency(totalAdditionalsValue)}</span>
          </div>
          <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline print:border-slate-300">
            <span className="text-base font-bold text-slate-200 print:text-slate-900">VALOR TOTAL:</span>
            <span className="text-xl font-extrabold font-mono text-indigo-400 print:text-indigo-900">
              {formatCurrency(totalProposalValue)}
            </span>
          </div>
        </div>
      </div>

      {/* CORPO 5: ASSINATURAS */}
      <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-12 print:mt-12 print:pt-8 text-center text-xs text-slate-500">
        <div className="space-y-6">
          <div className="w-full max-w-[200px] mx-auto border-b border-slate-300 h-10"></div>
          <div>
            <p className="font-bold text-slate-800">{proposal.professional.name || "O Profissional"}</p>
            {proposal.professional.companyName && <p className="text-[10px] text-slate-400 mt-0.5">{proposal.professional.companyName}</p>}
            <p className="text-[10px] text-slate-400 mt-1">CONTRATADA (PRESTADOR)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="w-full max-w-[200px] mx-auto border-b border-slate-300 h-10"></div>
          <div>
            <p className="font-bold text-slate-800">{proposal.client.name || "O Cliente"}</p>
            <p className="text-[10px] text-slate-400 mt-1">CONTRATANTE (CLIENTE)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
