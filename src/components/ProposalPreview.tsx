import React from "react";
import { Proposal } from "../types";
import { formatCurrency, formatAreaSize, calculateAreaM2, calculateAreaSubtotal, calculateAdditionalSubtotal } from "../utils";
import { FileText, Calendar, MapPin, Building, Phone, Mail, Hash } from "lucide-react";

interface ProposalPreviewProps {
  proposal: Proposal;
}

// Vector Logo for D'Ponte (Arte em Ferro)
function BlacksmithLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 print:w-18 print:h-18 shrink-0 select-none">
      {/* Outer elegant borders */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#b45309" strokeWidth="2" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="4 2" />
      
      {/* Simulated Curved labels */}
      <path id="curve-top-text" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="none" />
      <path id="curve-bottom-text" d="M 88 50 A 38 38 0 0 1 12 50" fill="none" stroke="none" />
      
      <text fill="#451a03" fontSize="8" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="0.5">
        <textPath href="#curve-top-text" startOffset="50%" textAnchor="middle">
          D'PONTE
        </textPath>
      </text>
      
      <text fill="#78350f" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.2">
        <textPath href="#curve-bottom-text" startOffset="50%" textAnchor="middle">
          ARTE EM FERRO
        </textPath>
      </text>

      {/* Central Blacksmith Hammer & Anvil Icon */}
      <g transform="translate(30, 34) scale(0.8)">
        {/* Anvil */}
        <path d="M 5 25 L 12 20 L 38 20 L 45 25 L 35 32 L 35 38 L 42 42 L 8 42 L 15 38 L 15 32 Z" fill="#1c1917" />
        <path d="M 4 20 C 12 20, 18 15, 18 10 L 8 10 Z" fill="#78350f" />
        {/* Hammer */}
        <rect x="22" y="5" width="4" height="20" rx="1" fill="#d97706" transform="rotate(-30 24 15)" />
        <rect x="18" y="3" width="10" height="6" rx="1" fill="#1c1917" transform="rotate(-30 24 15)" />
      </g>
      
      <text x="50" y="80" fill="#b45309" fontSize="4.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
        DESDE 2024
      </text>
      
      <circle cx="14" cy="50" r="1.5" fill="#d97706" />
      <circle cx="86" cy="50" r="1.5" fill="#d97706" />
    </svg>
  );
}

// Vector Logo for DPONT (Pintura Eletrostática)
function ElectrostaticLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 print:w-18 print:h-18 shrink-0 select-none">
      {/* Background dark circle */}
      <circle cx="50" cy="50" r="47" fill="#1e293b" stroke="#eab308" strokeWidth="2.5" />
      
      {/* Yellow spray paint splatter effect */}
      <path d="M 22 45 C 15 25, 35 15, 45 25 C 48 35, 32 50, 22 45 Z" fill="#eab308" opacity="0.75" />
      <path d="M 28 35 C 32 15, 60 12, 62 25 C 55 42, 38 35, 28 35 Z" fill="#eab308" opacity="0.9" />
      <circle cx="18" cy="24" r="2.5" fill="#eab308" />
      <circle cx="25" cy="18" r="1.5" fill="#eab308" />
      
      {/* Spray Gun silhouette in center */}
      <g transform="translate(42, 28) scale(0.72)" fill="#ffffff">
        {/* Gun main metal chamber */}
        <path d="M 10 5 L 30 5 L 28 15 L 12 15 Z" />
        {/* Yellow nozzle */}
        <rect x="5" y="8" width="5" height="4.5" fill="#eab308" />
        {/* Pistol grip handle */}
        <path d="M 20 15 L 26 36 L 33 33 L 26 15 Z" />
        {/* Technical trigger guard */}
        <path d="M 15 15 Q 12 25, 18 30" stroke="#ffffff" strokeWidth="2.5" fill="none" />
      </g>
      
      {/* Yellow high pressure spray beam */}
      <path d="M 40 38 L 22 25 L 21 51 Z" fill="#eab308" opacity="0.4" />

      {/* Modern heavy labels */}
      <text x="50" y="73" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily="Impact, Arial Black, sans-serif" textAnchor="middle" letterSpacing="1">
        DPONT
      </text>
      <text x="50" y="84" fill="#eab308" fontSize="4" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">
        PINTURA ELETROSTATICA
      </text>
    </svg>
  );
}

// Default blueprint/corporate logo
function DefaultBlueLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 print:w-16 print:h-16 shrink-0 select-none">
      <rect x="8" y="8" width="84" height="84" rx="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
      <path d="M 20 35 L 50 18 L 80 35 L 80 78 L 20 78 Z" fill="#dbeafe" />
      <path d="M 35 48 L 65 48 L 65 78 L 35 78 Z" fill="#3b82f6" />
      <line x1="50" y1="18" x2="50" y2="78" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="20" y1="52" x2="80" y2="52" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#1d4ed8" strokeWidth="2" />
    </svg>
  );
}

export default function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const theme = proposal.theme || "default";

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

  // Theme styling definitions
  const themeStyles = {
    default: {
      outerBg: "bg-white",
      textClass: "text-slate-800",
      accentText: "text-indigo-600",
      accentBg: "bg-indigo-50 text-indigo-700",
      accentBorder: "border-indigo-100",
      tableHeader: "text-slate-400 font-sans font-semibold uppercase text-xs",
      totalBg: "bg-slate-900 text-white",
      totalText: "text-indigo-400",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
      fontFamily: "font-sans",
      titleBorder: "border-b-2 border-slate-100",
      subHeaderBorder: "border-b border-slate-100",
      termBox: "bg-slate-50/50 border border-slate-100",
      sideBorder: "h-6 w-1.5 bg-indigo-600 rounded-full inline-block",
      obsBox: "bg-slate-50/20 border border-dashed border-slate-200",
      signLine: "border-slate-300",
    },
    "arte-em-ferro": {
      outerBg: "bg-stone-50/10",
      textClass: "text-stone-900",
      accentText: "text-amber-800",
      accentBg: "bg-amber-100/40 text-amber-900",
      accentBorder: "border-amber-200/50",
      tableHeader: "text-amber-900/60 font-serif font-bold uppercase text-xs",
      totalBg: "bg-stone-900 text-amber-50 border border-amber-800/30",
      totalText: "text-amber-500",
      badge: "bg-amber-100/30 text-amber-900 border-amber-200/30",
      fontFamily: "font-serif",
      titleBorder: "border-b-2 border-amber-900/10",
      subHeaderBorder: "border-b border-amber-900/5",
      termBox: "bg-amber-100/10 border border-amber-200/20",
      sideBorder: "h-6 w-1.5 bg-amber-700 rounded-full inline-block",
      obsBox: "bg-stone-50 border border-amber-900/10 p-5",
      signLine: "border-stone-400",
    },
    "pintura-eletrostatica": {
      outerBg: "bg-slate-950/20",
      textClass: "text-slate-900",
      accentText: "text-yellow-600",
      accentBg: "bg-yellow-500/10 text-yellow-800",
      accentBorder: "border-yellow-500/20",
      tableHeader: "text-slate-500 font-mono font-bold uppercase text-xs",
      totalBg: "bg-slate-950 text-yellow-400 border-2 border-yellow-500/40",
      totalText: "text-yellow-400",
      badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      fontFamily: "font-sans",
      titleBorder: "border-b-2 border-slate-900/10",
      subHeaderBorder: "border-b border-slate-900/5",
      termBox: "bg-slate-50 border border-slate-200/60",
      sideBorder: "h-6 w-1.5 bg-yellow-500 rounded-full inline-block",
      obsBox: "bg-slate-50 border border-slate-200 p-5",
      signLine: "border-slate-400",
    },
  };

  const s = themeStyles[theme];

  return (
    <div
      id="proposal-document"
      className={`${s.outerBg} ${s.textClass} ${s.fontFamily} shadow-xl rounded-2xl p-6 md:p-12 max-w-[21cm] mx-auto border border-slate-200/60 print:shadow-none print:p-0 print:border-none print:mx-0 print:w-full`}
    >
      {/* HEADER DO DOCUMENTO */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 ${s.titleBorder} print:pb-6`}>
        <div className="flex items-center gap-4">
          {/* Logo Rendering Decision */}
          {proposal.professional.logo ? (
            <div className="w-24 h-24 bg-white border border-slate-100 rounded-2xl p-1 flex items-center justify-center shrink-0 shadow-xs print:w-18 print:h-18">
              <img
                src={proposal.professional.logo}
                alt="Logo Empresa"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <>
              {theme === "arte-em-ferro" && <BlacksmithLogo />}
              {theme === "pintura-eletrostatica" && <ElectrostaticLogo />}
              {theme === "default" && <DefaultBlueLogo />}
            </>
          )}

          <div>
            {proposal.professional.companyName ? (
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className={s.sideBorder}></span>
                {proposal.professional.companyName}
              </h1>
            ) : (
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className={s.sideBorder}></span>
                Proposta de Orçamento
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
        </div>

        <div className="text-left md:text-right space-y-1">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${s.badge}`}>
            <FileText className="w-3.5 h-3.5" /> Proposta Comercial
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
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 py-8 ${s.subHeaderBorder} print:py-6 text-sm`}>
        {/* Contratada / Profissional */}
        <div className="space-y-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${s.accentText}`}>
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
          <h3 className={`text-xs font-bold uppercase tracking-wider ${s.accentText}`}>
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
      <div className={`py-8 ${s.subHeaderBorder} print:py-6`}>
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
                <tr className={`border-b border-slate-200 ${s.tableHeader}`}>
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
                    <tr key={area.id} className="hover:bg-slate-50/30 print:hover:bg-transparent">
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
                  <td className={`py-3 px-2 text-right font-bold font-mono text-xs ${s.accentText}`}>
                    {formatCurrency(totalAreasValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* CORPO 2: SERVIÇOS E ITENS ADICIONAIS */}
      <div className={`py-8 ${s.subHeaderBorder} print:py-6`}>
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
                <tr className={`border-b border-slate-200 ${s.tableHeader}`}>
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
                    <tr key={item.id} className="hover:bg-slate-50/30 print:hover:bg-transparent">
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
                  <td className={`py-3 px-2 text-right font-bold font-mono text-xs ${s.accentText}`}>
                    {formatCurrency(totalAdditionalsValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* CORPO 3: CONDIÇÕES E PRAZOS */}
      <div className={`py-8 ${s.subHeaderBorder} print:py-6 text-sm`}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-violet-500 rounded-full"></span>
          3. Prazos e Condições Comerciais
        </h3>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl p-5 ${s.termBox} print:bg-transparent print:p-0 print:border-none print:grid-cols-1 print:gap-4`}>
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
            <div className={`text-xs text-slate-600 whitespace-pre-line leading-relaxed rounded-xl ${s.obsBox} print:border-none print:p-0`}>
              {proposal.observations}
            </div>
          </div>
        )}
      </div>

      {/* CORPO 4: RESUMO FINANCEIRO */}
      <div className="py-8 print:py-6">
        <div className={`w-full md:w-80 ml-auto rounded-2xl p-6 space-y-4 shadow-lg ${s.totalBg} print:shadow-none print:bg-slate-100 print:text-slate-800 print:border print:border-slate-300`}>
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
            <span className={`text-xl font-extrabold font-mono ${s.totalText} print:text-indigo-900`}>
              {formatCurrency(totalProposalValue)}
            </span>
          </div>
        </div>
      </div>

      {/* CORPO 5: ASSINATURAS */}
      <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-12 print:mt-12 print:pt-8 text-center text-xs text-slate-500">
        <div className="space-y-6">
          <div className={`w-full max-w-[200px] mx-auto border-b h-10 ${s.signLine}`}></div>
          <div>
            <p className="font-bold text-slate-800">{proposal.professional.name || "O Profissional"}</p>
            {proposal.professional.companyName && <p className="text-[10px] text-slate-400 mt-0.5">{proposal.professional.companyName}</p>}
            <p className="text-[10px] text-slate-400 mt-1">CONTRATADA (PRESTADOR)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`w-full max-w-[200px] mx-auto border-b h-10 ${s.signLine}`}></div>
          <div>
            <p className="font-bold text-slate-800">{proposal.client.name || "O Cliente"}</p>
            <p className="text-[10px] text-slate-400 mt-1">CONTRATANTE (CLIENTE)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
