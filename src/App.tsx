import React, { useState, useEffect } from "react";
import { Proposal } from "./types";
import { initialProposal } from "./utils";
import ProposalForm from "./components/ProposalForm";
import ProposalPreview from "./components/ProposalPreview";
import { HardHat, Edit2, Eye, Printer, Download, RefreshCw, Trash2, HelpCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
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

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("proposta_obras_data", JSON.stringify(proposal));
  }, [proposal]);

  // Clean all fields to start from scratch
  const handleClearAll = () => {
    if (window.confirm("Deseja realmente limpar todos os campos para iniciar uma nova proposta em branco?")) {
      const emptyProposal: Proposal = {
        client: { name: "", phone: "", email: "", date: new Date().toISOString().split("T")[0], address: "" },
        professional: { name: "", phone: "", email: "", document: "", companyName: "" },
        areas: [],
        additionals: [],
        observations: "",
        validity: "10 dias",
        paymentTerms: "A combinar",
        deadline: "A combinar",
      };
      setProposal(emptyProposal);
      setActiveTab("edit");
    }
  };

  // Restore the professional demo example
  const handleRestoreExample = () => {
    if (window.confirm("Deseja restaurar a proposta de exemplo? Isso substituirá seus dados atuais.")) {
      setProposal(initialProposal);
      setActiveTab("edit");
    }
  };

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
      // Temporarily add a print-like styling to the element to guarantee accurate colors/render
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
            <span>Edição segura: os dados são salvos automaticamente no seu navegador.</span>
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0 print:max-w-none">
        
        {/* EDIT TAB CONTAINER */}
        <div className={`${activeTab === "edit" ? "block" : "hidden"} print:hidden`}>
          {/* Quick Informative Banner */}
          <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-sm text-indigo-900">
            <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Como funciona?</p>
              <p className="text-indigo-700 mt-1 leading-relaxed">
                Preencha os dados do cliente, adicione os cômodos medindo largura × comprimento e o valor por m² cobrado.
                O sistema calcula as áreas e subtotais automaticamente. Você também pode incluir custos adicionais como caçambas, projetos ou taxas.
                Depois, clique em <strong>Pré-visualizar</strong> ou use os botões acima para <strong>Imprimir</strong> ou <strong>Baixar PDF</strong>.
              </p>
            </div>
          </div>

          <ProposalForm proposal={proposal} onChange={setProposal} />
        </div>

        {/* PREVIEW TAB CONTAINER - ALWAY ALIVE IN DOM BUT SHOWN AND PREPARED FOR PRINT */}
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
