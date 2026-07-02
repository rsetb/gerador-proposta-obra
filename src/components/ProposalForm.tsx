import React, { useState, useRef } from "react";
import { Proposal, AreaItem, AdditionalItem } from "../types";
import { Trash2, Plus, Users, Landmark, Maximize, ShoppingBag, ClipboardList, ChevronDown, ChevronUp, Palette, Upload, Image } from "lucide-react";
import { formatCurrency, calculateAreaM2, calculateAreaSubtotal, calculateAdditionalSubtotal } from "../utils";

interface ProposalFormProps {
  proposal: Proposal;
  onChange: (updated: Proposal) => void;
}

export default function ProposalForm({ proposal, onChange }: ProposalFormProps) {
  const [showProfData, setShowProfData] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, envie apenas arquivos de imagem (PNG, JPG, JPEG, SVG, etc).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateProfessional({ logo: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateProfessional({ logo: null });
  };

  // Helper to update specific sub-state
  const updateClient = (fields: Partial<Proposal["client"]>) => {
    onChange({
      ...proposal,
      client: { ...proposal.client, ...fields },
    });
  };

  const updateProfessional = (fields: Partial<Proposal["professional"]>) => {
    onChange({
      ...proposal,
      professional: { ...proposal.professional, ...fields },
    });
  };

  // Areas CRUD
  const addArea = () => {
    const newArea: AreaItem = {
      id: Date.now().toString(),
      name: "",
      width: 0,
      length: 0,
      valuePerM2: 0,
    };
    onChange({
      ...proposal,
      areas: [...proposal.areas, newArea],
    });
  };

  const removeArea = (id: string) => {
    onChange({
      ...proposal,
      areas: proposal.areas.filter((a) => a.id !== id),
    });
  };

  const updateArea = (id: string, fields: Partial<AreaItem>) => {
    onChange({
      ...proposal,
      areas: proposal.areas.map((a) => (a.id === id ? { ...a, ...fields } : a)),
    });
  };

  // Additionals CRUD
  const addAdditional = () => {
    const newItem: AdditionalItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitValue: 0,
    };
    onChange({
      ...proposal,
      additionals: [...proposal.additionals, newItem],
    });
  };

  const removeAdditional = (id: string) => {
    onChange({
      ...proposal,
      additionals: proposal.additionals.filter((item) => item.id !== id),
    });
  };

  const updateAdditional = (id: string, fields: Partial<AdditionalItem>) => {
    onChange({
      ...proposal,
      additionals: proposal.additionals.map((item) =>
        item.id === id ? { ...item, ...fields } : item
      ),
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. DADOS DO CLIENTE */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Dados do Cliente</h2>
            <p className="text-sm text-slate-500">Informações de contato e local da obra</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Nome do Cliente / Empresa</label>
            <input
              type="text"
              placeholder="Ex: João Silva ou Construtora ABC"
              value={proposal.client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Telefone</label>
              <input
                type="text"
                placeholder="Ex: (11) 99999-9999"
                value={proposal.client.phone}
                onChange={(e) => updateClient({ phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Data da Proposta</label>
              <input
                type="date"
                value={proposal.client.date}
                onChange={(e) => updateClient({ date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              placeholder="Ex: cliente@email.com"
              value={proposal.client.email}
              onChange={(e) => updateClient({ email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Endereço da Obra</label>
            <input
              type="text"
              placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
              value={proposal.client.address}
              onChange={(e) => updateClient({ address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>
        </div>
      </section>

      {/* 2. DADOS DO PROFISSIONAL (COLLAPSIBLE FOR BETTER UX) */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-4">
        <button
          type="button"
          onClick={() => setShowProfData(!showProfData)}
          className="w-full flex items-center justify-between text-left focus:outline-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Seus Dados (Profissional / Empresa)</h2>
              <p className="text-sm text-slate-500">Exibidos no cabeçalho e campo de assinatura</p>
            </div>
          </div>
          {showProfData ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showProfData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nome do Profissional / Responsável</label>
              <input
                type="text"
                placeholder="Ex: Eng. Carlos Santana"
                value={proposal.professional.name}
                onChange={(e) => updateProfessional({ name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nome da Empresa (opcional)</label>
              <input
                type="text"
                placeholder="Ex: Santana Reformas & Decorações"
                value={proposal.professional.companyName}
                onChange={(e) => updateProfessional({ companyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">CNPJ / CPF</label>
              <input
                type="text"
                placeholder="Ex: 00.000.000/0001-00"
                value={proposal.professional.document}
                onChange={(e) => updateProfessional({ document: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Telefone Profissional</label>
                <input
                  type="text"
                  placeholder="Ex: (11) 98888-7777"
                  value={proposal.professional.phone}
                  onChange={(e) => updateProfessional({ phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">E-mail de Contato</label>
                <input
                  type="email"
                  placeholder="Ex: contato@empresa.com"
                  value={proposal.professional.email}
                  onChange={(e) => updateProfessional({ email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO: IDENTIDADE VISUAL & TEMA */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Identidade Visual & Tema</h2>
            <p className="text-sm text-slate-500">Escolha o estilo de design e adicione o logotipo da sua empresa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Seleção do Tema */}
          <div className="lg:col-span-7 space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Estilo & Cores do Orçamento</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tema Padrão */}
              <button
                type="button"
                onClick={() => onChange({ ...proposal, theme: "default" })}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  proposal.theme === "default" || !proposal.theme
                    ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/10"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">Corporativo Azul</span>
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-600"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 border"></span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Design limpo, neutro e altamente profissional para qualquer tipo de obra ou reforma.
                </p>
              </button>

              {/* Tema Arte em Ferro (D'Ponte) */}
              <button
                type="button"
                onClick={() => onChange({ ...proposal, theme: "arte-em-ferro" })}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  proposal.theme === "arte-em-ferro"
                    ? "border-amber-600 bg-amber-50/10 ring-2 ring-amber-600/10"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">D'Ponte (Arte em Ferro)</span>
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-700"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-stone-900"></span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Estilo rústico, forte e elegante de serralheria artística, detalhes em bronze, cinza escuro e serifas.
                </p>
              </button>

              {/* Tema Pintura Eletrostática (DPONT) */}
              <button
                type="button"
                onClick={() => onChange({ ...proposal, theme: "pintura-eletrostatica" })}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  proposal.theme === "pintura-eletrostatica"
                    ? "border-yellow-500 bg-yellow-50/10 ring-2 ring-yellow-500/10"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">DPONT (Pintura)</span>
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-900"></span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Visual arrojado, moderno e técnico. Combinação de preto industrial e respingo amarelo.
                </p>
              </button>
            </div>
          </div>

          {/* Upload de Logotipo */}
          <div className="lg:col-span-5 space-y-3">
            <label className="text-sm font-semibold text-slate-700 block">Logotipo da Empresa</label>
            
            {proposal.professional.logo ? (
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="relative w-16 h-16 bg-white border rounded-lg overflow-hidden flex items-center justify-center p-1 shadow-xs">
                  <img
                    src={proposal.professional.logo}
                    alt="Logo Empresa"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">Logotipo carregado</p>
                  <p className="text-[10px] text-slate-400">Usando arquivo personalizado</p>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 mt-1 cursor-pointer block"
                  >
                    Excluir Logotipo
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/30"
                    : "border-slate-300 hover:border-indigo-400 bg-slate-50/30 hover:bg-white"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Arraste seu logo aqui ou clique para buscar</p>
                <p className="text-[10px] text-slate-400 mt-1">Formatos suportados: PNG, JPG, JPEG, SVG (Máx 2MB)</p>
                
                {/* Visual indicator of the dynamic theme logo that will be used if empty */}
                <p className="text-[10px] text-amber-600 font-semibold mt-2.5">
                  {(proposal.theme === "arte-em-ferro" || !proposal.theme) && "📌 Ativo: Usando logo vetorizado D'PONTE de fábrica"}
                  {proposal.theme === "pintura-eletrostatica" && "📌 Ativo: Usando logo vetorizado DPONT de fábrica"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. MEDIDAS (ÁREAS) DA OBRA */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Medidas e Áreas da Obra</h2>
              <p className="text-sm text-slate-500">Adicione cômodos ou setores com cálculo de m²</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addArea}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs hover:shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Adicionar Área
          </button>
        </div>

        {proposal.areas.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Maximize className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Nenhuma área cadastrada ainda.</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">Adicione cômodos para calcular o valor com base na metragem.</p>
            <button
              type="button"
              onClick={addArea}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Primeiro Cômodo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposal.areas.map((area, index) => {
              const areaM2 = calculateAreaM2(area.width, area.length);
              const subtotal = calculateAreaSubtotal(area.width, area.length, area.valuePerM2);

              return (
                <div
                  key={area.id}
                  className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-colors relative group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Área #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeArea(area.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover Área"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Descrição/Nome */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Descrição do Cômodo / Setor</label>
                      <input
                        type="text"
                        placeholder="Ex: Quarto Master, Banheiro, Fachada"
                        value={area.name}
                        onChange={(e) => updateArea(area.id, { name: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                      />
                    </div>

                    {/* Largura */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Largura (m)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={area.width || ""}
                        onChange={(e) => updateArea(area.id, { width: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                      />
                    </div>

                    {/* Comprimento */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Comprimento (m)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={area.length || ""}
                        onChange={(e) => updateArea(area.id, { length: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                      />
                    </div>

                    {/* Valor por m2 */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Valor por m² (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          value={area.valuePerM2 || ""}
                          onChange={(e) => updateArea(area.id, { valuePerM2: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    {/* Resultado / Real-time calculation */}
                    <div className="md:col-span-2 flex items-center justify-between p-3 bg-indigo-50/40 rounded-xl border border-indigo-50 text-sm">
                      <div className="text-indigo-800">
                        <span className="font-medium">Metragem: </span>
                        <span className="font-bold">{areaM2.toFixed(2)} m²</span>
                      </div>
                      <div className="text-indigo-900 text-right">
                        <span className="font-medium">Subtotal: </span>
                        <span className="font-bold text-base">{formatCurrency(subtotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. ITENS ADICIONAIS / SERVIÇOS EXTRA */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Serviços e Materiais Adicionais</h2>
              <p className="text-sm text-slate-500">Adicione diárias, caçambas, instalações, materiais ou taxas fixas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addAdditional}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs hover:shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Adicionar Serviço/Item
          </button>
        </div>

        {proposal.additionals.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Nenhum item adicional cadastrado.</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">Adicione custos complementares como diárias, frete ou materiais extras.</p>
            <button
              type="button"
              onClick={addAdditional}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposal.additionals.map((item, index) => {
              const subtotal = calculateAdditionalSubtotal(item.quantity, item.unitValue);

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-colors relative group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Serviço / Item Adicional #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAdditional(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover Item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Descrição */}
                    <div className="md:col-span-6 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Descrição do Serviço / Material</label>
                      <input
                        type="text"
                        placeholder="Ex: Aluguel de Caçamba, Projeto Arquitetônico, Fiação Elétrica"
                        value={item.description}
                        onChange={(e) => updateAdditional(item.id, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                      />
                    </div>

                    {/* Quantidade */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="1"
                        value={item.quantity || ""}
                        onChange={(e) => updateAdditional(item.id, { quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                      />
                    </div>

                    {/* Valor Unitário */}
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Valor Unitário (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          value={item.unitValue || ""}
                          onChange={(e) => updateAdditional(item.id, { unitValue: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    {/* Real-time Subtotal */}
                    <div className="md:col-span-12 flex justify-end">
                      <div className="text-slate-700 text-sm font-semibold bg-emerald-50/50 px-4 py-1.5 rounded-lg border border-emerald-50">
                        Subtotal do item: <span className="text-emerald-700 text-base ml-1">{formatCurrency(subtotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. OBSERVAÇÕES, PRAZOS E CONDIÇÕES */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Termos, Prazos e Observações</h2>
            <p className="text-sm text-slate-500">Condições gerais da proposta para resguardar as partes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Prazo de Entrega / Duração</label>
            <input
              type="text"
              placeholder="Ex: 30 dias úteis após início"
              value={proposal.deadline}
              onChange={(e) => onChange({ ...proposal, deadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Validade da Proposta</label>
            <input
              type="text"
              placeholder="Ex: 10 dias úteis"
              value={proposal.validity}
              onChange={(e) => onChange({ ...proposal, validity: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Forma de Pagamento</label>
            <input
              type="text"
              placeholder="Ex: 50% de sinal, 50% na entrega"
              value={proposal.paymentTerms}
              onChange={(e) => onChange({ ...proposal, paymentTerms: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-sm font-medium text-slate-700">Observações Adicionais (condições gerais, garantias, etc.)</label>
            <textarea
              rows={5}
              placeholder="Digite cláusulas de exclusão, responsabilidades sobre materiais, limpeza pós-obra, fornecimento de caçambas, etc."
              value={proposal.observations}
              onChange={(e) => onChange({ ...proposal, observations: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-sans leading-relaxed"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
