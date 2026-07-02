import React, { useState, useEffect } from "react";
import { Proposal } from "./types";
import { initialProposal, formatCurrency } from "./utils";
import ProposalForm from "./components/ProposalForm";
import ProposalPreview from "./components/ProposalPreview";
import {
  HardHat,
  Edit2,
  Eye,
  Printer,
  Download,
  RefreshCw,
  Trash2,
  HelpCircle,
  Save,
  Plus,
  Search,
  Copy,
  ChevronRight,
  ChevronLeft,
  FolderClosed,
  FileEdit,
  History
} from "lucide-react";

interface SavedProposalItem {
  id: string;
  title: string;
  clientName: string;
  totalValue: number;
  updatedAt: string;
  data: Proposal;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Current active proposal (working copy)
  const [proposal, setProposal] = useState<Proposal>(() => {
    const saved = localStorage.getItem("proposta_obras_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialProposal;
      }
    }
    return initialProposal;
  });

  // Saved list of proposals
  const [savedProposals, setSavedProposals] = useState<SavedProposalItem[]>(() => {
    const saved = localStorage.getItem("propostas_salvas");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // If no saved proposals but we have an initial demo, let's pre-populate the demo so it is easy to see
    const totalAreas = initialProposal.areas.reduce((sum, a) => sum + (a.width * a.length * a.valuePerM2), 0);
    const totalAdds = initialProposal.additionals.reduce((sum, a) => sum + (a.quantity * a.unitValue), 0);
    const initialDemoItem: SavedProposalItem = {
      id: "demo-ferro-1",
      title: "Grade Colonial e Portão - Villa Lobos",
      clientName: "Residencial Villa Lobos - Bloco C",
      totalValue: totalAreas + totalAdds,
      updatedAt: new Date().toLocaleString("pt-BR"),
      data: { ...initialProposal, id: "demo-ferro-1", title: "Grade Colonial e Portão - Villa Lobos" }
    };
    return [initialDemoItem];
  });

  // Local state for editing the title of the current active budget
  const [currentTitle, setCurrentTitle] = useState(proposal.title || "Orçamento Inicial");

  // Keep currentTitle in sync with the current active proposal
  useEffect(() => {
    setCurrentTitle(proposal.title || "Orçamento Inicial");
  }, [proposal.title, proposal.id]);

  // Backup current working proposal to localStorage
  useEffect(() => {
    localStorage.setItem("proposta_obras_data", JSON.stringify(proposal));
  }, [proposal]);

  // Backup saved proposals list to localStorage
  useEffect(() => {
    localStorage.setItem("propostas_salvas", JSON.stringify(savedProposals));
  }, [savedProposals]);

  // Create a new blank budget
  const handleNewProposal = () => {
    const emptyProposal: Proposal = {
      title: "Novo Orçamento",
      client: { name: "", phone: "", email: "", date: new Date().toISOString().split("T")[0], address: "" },
      professional: { ...proposal.professional }, // Keep professional details for user convenience
      areas: [],
      additionals: [],
      observations: "",
      validity: "15 dias",
      paymentTerms: "50% de sinal e 50% na conclusão.",
      deadline: "30 dias úteis",
      theme: "default"
    };
    setProposal(emptyProposal);
    setCurrentTitle("Novo Orçamento");
    setActiveTab("edit");
  };

  // Clean all fields with warning
  const handleClearAll = () => {
    if (window.confirm("Deseja realmente limpar todos os campos para iniciar uma nova proposta em branco?")) {
      handleNewProposal();
    }
  };

  // Restore the professional demo example
  const handleRestoreExample = () => {
    if (window.confirm("Deseja restaurar a proposta de exemplo? Isso substituirá seus dados atuais na tela.")) {
      setProposal(initialProposal);
      setCurrentTitle("Grade Colonial e Portão - Villa Lobos");
      setActiveTab("edit");
    }
  };

  // Calculate total for a given proposal
  const calculateProposalTotal = (p: Proposal) => {
    const areasTotal = p.areas.reduce((sum, a) => sum + (a.width * a.length * a.valuePerM2), 0);
    const addsTotal = p.additionals.reduce((sum, a) => sum + (a.quantity * a.unitValue), 0);
    return areasTotal + addsTotal;
  };

  // Save current proposal (save / update changes)
  const handleSaveCurrent = () => {
    const titleToSave = currentTitle.trim() || proposal.client.name || "Orçamento Sem Nome";
    const total = calculateProposalTotal(proposal);
    let updatedList = [...savedProposals];
    let workingProposal = { ...proposal, title: titleToSave };

    if (proposal.id) {
      // Overwrite/update existing saved budget
      const index = updatedList.findIndex(p => p.id === proposal.id);
      if (index !== -1) {
        updatedList[index] = {
          ...updatedList[index],
          title: titleToSave,
          clientName: proposal.client.name || "Cliente não informado",
          totalValue: total,
          updatedAt: new Date().toLocaleString("pt-BR"),
          data: workingProposal
        };
      } else {
        // If ID existed but was deleted from list somehow, push it back
        updatedList.push({
          id: proposal.id,
          title: titleToSave,
          clientName: proposal.client.name || "Cliente não informado",
          totalValue: total,
          updatedAt: new Date().toLocaleString("pt-BR"),
          data: workingProposal
        });
      }
    } else {
      // Generate a new ID and save
      const newId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      workingProposal = { ...workingProposal, id: newId };
      updatedList.push({
        id: newId,
        title: titleToSave,
        clientName: proposal.client.name || "Cliente não informado",
        totalValue: total,
        updatedAt: new Date().toLocaleString("pt-BR"),
        data: workingProposal
      });
      setProposal(workingProposal);
    }

    setSavedProposals(updatedList);
    alert(`Orçamento "${titleToSave}" salvo com sucesso!`);
  };

  // Save as a new copy
  const handleSaveAsNew = () => {
    const titleToSave = window.prompt("Insira o título para a nova cópia:", `Cópia de ${currentTitle}`);
    if (titleToSave === null) return; // Cancelled
    
    const finalTitle = titleToSave.trim() || "Cópia de " + currentTitle;
    const newId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const newProposalData: Proposal = {
      ...proposal,
      id: newId,
      title: finalTitle
    };

    const total = calculateProposalTotal(newProposalData);
    const newSavedItem: SavedProposalItem = {
      id: newId,
      title: finalTitle,
      clientName: newProposalData.client.name || "Cliente não informado",
      totalValue: total,
      updatedAt: new Date().toLocaleString("pt-BR"),
      data: newProposalData
    };

    setSavedProposals(prev => [...prev, newSavedItem]);
    setProposal(newProposalData);
    alert(`Cópia "${finalTitle}" criada e carregada na tela!`);
  };

  // Load a saved proposal
  const handleLoadProposal = (id: string) => {
    const found = savedProposals.find(p => p.id === id);
    if (found) {
      // Clone data to avoid reference mutation issues
      const cloned = JSON.parse(JSON.stringify(found.data)) as Proposal;
      setProposal(cloned);
      setCurrentTitle(cloned.title || "Orçamento Carregado");
      setActiveTab("edit");
    }
  };

  // Delete a saved proposal
  const handleDeleteProposal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card load click
    const found = savedProposals.find(p => p.id === id);
    const name = found ? found.title : "este orçamento";

    if (window.confirm(`Deseja realmente excluir "${name}"? Esta ação não poderá ser desfeita.`)) {
      const updatedList = savedProposals.filter(p => p.id !== id);
      setSavedProposals(updatedList);
      
      // If we deleted the active one, clean the active proposal's ID
      if (proposal.id === id) {
        setProposal(prev => {
          const cleaned = { ...prev };
          delete cleaned.id;
          cleaned.title = "Novo Orçamento";
          return cleaned;
        });
      }
    }
  };

  // Filter saved proposals based on search
  const filteredProposals = savedProposals.filter(
    p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Browser Native Print
  const handlePrint = () => {
    window.print();
  };

  // html2pdf PDF Downloader
  const handleDownloadPDF = () => {
    const element = document.getElementById("proposal-document");
    if (!element) return;

    // Get client name to name the file beautifully
    const clientNameClean = (proposal.client.name || "proposta")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-zA-Z0-9]/g, "_")  // replace special chars
      .toLowerCase()
      .slice(0, 30);

    const filename = `proposta_obra_${clientNameClean}.pdf`;

    const opt = {
      margin: [12, 12, 12, 12],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css"] }
    };

    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(element).save();
    } else {
      alert("Aguardando carregamento da biblioteca PDF. Por favor, tente novamente em alguns instantes.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 selection:bg-indigo-500 selection:text-white print:bg-white">
      
      {/* HEADER PRINCIPAL - ESCONDIDO NA IMPRESSÃO */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                PropostaFácil <span className="text-amber-600 font-semibold text-sm align-super">Obras</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">Gerador de Propostas de Engenharia & Reformas</p>
            </div>
          </div>

          {/* Segmented Control - Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-center">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Pré-visualizar</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-stretch justify-end md:self-auto">
            <button
              onClick={handlePrint}
              title="Imprimir Proposta Comercial"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-sm rounded-xl transition-all cursor-pointer border border-slate-200"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            
            <button
              onClick={handleDownloadPDF}
              title="Baixar em formato PDF"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUBBAR - ATALHOS DE EXEMPLO E LIMPEZA - ESCONDIDO NA IMPRESSÃO */}
      <div className="bg-slate-100/50 border-b border-slate-200/50 py-2.5 px-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Dados locais salvos automaticamente em tempo real no seu navegador.</span>
          </div>
          
          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={handleRestoreExample}
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restaurar Exemplo Completo
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleClearAll}
              className="text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar Todos os Campos
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL COM LAYOUT SPLIT (SIDEBAR + FORM/PREVIEW) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0 print:max-w-none">
        
        {/* EDIT TAB CONTAINER */}
        <div className={`${activeTab === "edit" ? "block" : "hidden"} print:hidden`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PAINEL LATERAL: ORÇAMENTOS SALVOS */}
            <aside className={`lg:col-span-4 space-y-6 ${sidebarOpen ? "block" : "hidden lg:block lg:col-span-1"}`}>
              
              {/* COLLAPSED MINI RAIL ON DESKTOP */}
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  title="Abrir Painel de Orçamentos Salvos"
                  className="hidden lg:flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer w-full"
                >
                  <FolderClosed className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider writing-mode-vertical">
                    Orçamentos
                  </span>
                  <ChevronRight className="w-4 h-4 mt-4" />
                </button>
              )}

              {/* FULL SIDEBAR */}
              {sidebarOpen && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-900">
                      <FolderClosed className="w-5 h-5 text-indigo-600" />
                      <h2 className="font-bold text-base">Meus Orçamentos</h2>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">
                        {savedProposals.length}
                      </span>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        title="Ocultar Painel"
                        className="hidden lg:block p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* IDENTIFICAÇÃO DO ORÇAMENTO ATUAL */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Orçamento Atual
                      </span>
                      {proposal.id ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Salvo no App
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Rascunho
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Título do Orçamento</label>
                      <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => {
                          setCurrentTitle(e.target.value);
                          setProposal(prev => ({ ...prev, title: e.target.value }));
                        }}
                        placeholder="Ex: Reforma - Apt 42"
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveCurrent}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAsNew}
                        title="Duplicar ou criar versão"
                        className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Criar Cópia
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleNewProposal}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all cursor-pointer mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Novo Orçamento em Branco
                    </button>
                  </div>

                  {/* BUSCADOR DE ORÇAMENTOS ANTERIORES */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por título ou cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all"
                    />
                  </div>

                  {/* LISTA DE ANTERIORES */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {filteredProposals.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-1">
                        <FolderClosed className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                        <p className="text-xs font-medium">Nenhum orçamento encontrado</p>
                      </div>
                    ) : (
                      filteredProposals.map((item) => {
                        const isActive = proposal.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleLoadProposal(item.id)}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative group ${
                              isActive
                                ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/5"
                                : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-700">
                                  {item.title}
                                </h3>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  Cliente: {item.clientName}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteProposal(item.id, e)}
                                title="Excluir este orçamento do banco local"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100/80 text-[10px] text-slate-400 font-medium">
                              <span className="font-mono font-bold text-indigo-600">
                                {formatCurrency(item.totalValue)}
                              </span>
                              <span className="flex items-center gap-1">
                                <History className="w-3 h-3" />
                                {item.updatedAt.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              )}
            </aside>

            {/* FORMULÁRIO PRINCIPAL DE EDIÇÃO */}
            <div className={`${sidebarOpen ? "lg:col-span-8" : "lg:col-span-11"} col-span-1 space-y-6`}>
              
              {/* TRIGGER SE O PAINEL ESTIVER COLLAPSED EM DESKTOP */}
              {!sidebarOpen && (
                <div className="hidden lg:flex items-center gap-2 mb-2 bg-white px-4 py-2 border border-slate-200 rounded-xl max-w-fit shadow-xs">
                  <span className="text-xs text-slate-500">Painel de orçamentos fechado</span>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Abrir Meus Orçamentos
                  </button>
                </div>
              )}

              {/* Banner Informativo */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-sm text-indigo-900 shadow-xs">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gerencie Múltiplos Orçamentos!</p>
                  <p className="text-indigo-700 mt-1 leading-relaxed text-xs">
                    Use o painel lateral para criar, salvar ou clonar propostas de trabalho. 
                    Seus orçamentos ficam seguros no seu próprio navegador e podem ser recarregados e editados a qualquer momento.
                  </p>
                </div>
              </div>

              <ProposalForm proposal={proposal} onChange={setProposal} />
            </div>

          </div>

        </div>

        {/* PREVIEW TAB CONTAINER - SHOWN AND PREPARED FOR PRINT */}
        <div className={`${activeTab === "preview" ? "block" : "hidden"} print:block`}>
          <ProposalPreview proposal={proposal} />
        </div>

      </main>

      {/* FOOTER DA APLICAÇÃO - ESCONDIDO NA IMPRESSÃO */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-2">
          <p>PropostaFácil Obras — Plataforma de Gestão de Orçamentos e Serviços.</p>
          <p>© {new Date().getFullYear()} — Criado com foco em usabilidade e design minimalista de alta qualidade.</p>
        </div>
      </footer>

    </div>
  );
}
