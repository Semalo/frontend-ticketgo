import { useState, useEffect } from 'react';
import { 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  Clock, 
  Loader2,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Tipagem básica para os dados que vêm do backend
interface RelatorioItem {
  id: string;
  dataAbertura: string;
  dataAlteracao: string;
  setor: string;
  assunto: string;
  status: string;
  problema: string;
  tempoResolucao: string;
}

export function Relatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  
  const { user } = useAuth(); 
  
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarRelatorios = async () => {
    if (!user?.setorId) return;

    setCarregando(true);
    try {
      const token = localStorage.getItem('@SankhyaTickets:token'); 

      if (!token) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        setCarregando(false);
        return;
      }

      const queryParams = new URLSearchParams();
      if (dataInicio) queryParams.append('dataInicio', dataInicio);
      if (dataFim) queryParams.append('dataFim', dataFim);
      if (statusFiltro) queryParams.append('statusFiltro', statusFiltro);
      
      queryParams.append('setorUsuarioLogado', user.setorId.toString());

      const authHeader = token.startsWith('Bearer') ? token : `Bearer ${token}`;

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/sankhya/relatorios?${queryParams.toString()}`, {
        headers: {
          'Authorization': authHeader 
        }
      });

      const json = await response.json();

      if (json.sucesso) {
        setDados(json.dados);
      } else {
        toast.error(json.mensagem || 'Erro ao gerar relatório. Tente novamente.');
      }
    } catch (error) {
      console.error('Falha na requisição:', error);
      toast.error('Falha de conexão com o servidor ao gerar relatório.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (user?.setorId) {
      buscarRelatorios();
    }
  }, [user?.setorId]); 

  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault();
    buscarRelatorios();
  };

  const handleExportar = (formato: string) => {
    console.log(`A exportar para ${formato}...`);
    toast.success(`A exportação para ${formato} será implementada em breve!`);
  };

  // ==========================================
  // CÁLCULO DOS KPIs
  // ==========================================
  const totalChamados = dados.length;
  const chamadosConcluidos = dados.filter(item => item.status.toLowerCase().includes('concluído') || item.status.toLowerCase().includes('fechado')).length;
  const taxaResolucao = totalChamados > 0 ? Math.round((chamadosConcluidos / totalChamados) * 100) : 0;

  // Função auxiliar para as etiquetas de status
  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('concluído') || s.includes('fechado')) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">{status}</span>;
    }
    if (s.includes('atendimento')) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">{status}</span>;
    }
    if (s.includes('aberto')) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{status}</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm text-white">
              <BarChart3 size={24} strokeWidth={2} />
            </div>
            Relatórios e Métricas
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Extraia dados, analise o desempenho da sua equipa e acompanhe os indicadores de atendimento.
          </p>
        </div>
        
        {/* Botões de Exportação */}
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button 
            onClick={() => handleExportar('Excel')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <Download size={18} className="text-emerald-600" /> Excel
          </button>
          <button 
            onClick={() => handleExportar('PDF')}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors shadow-sm"
          >
            <FileText size={18} className="text-rose-600" /> PDF
          </button>
        </div>
      </div>

      {/* Área de Filtros */}
      <form onSubmit={handleGerarRelatorio} className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Filter size={16} className="text-blue-500" />
          Filtros de Pesquisa
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Período */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Data Início</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Data Fim</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Estado</label>
            <select 
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all shadow-sm"
            >
              <option value="">Todos os estados</option>
              <option value="Aberto">Aberto</option>
              <option value="Atendimento">Em Atendimento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
          <button 
            type="submit"
            disabled={carregando}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            {carregando ? <><Loader2 size={18} className="animate-spin" /> A filtrar...</> : 'Aplicar Filtros'}
          </button>
        </div>
      </form>

      {/* Resumo Rápido (Cards / KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl ring-1 ring-inset ring-blue-100">
            <Inbox size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total no Período</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{carregando ? '-' : totalChamados}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-inset ring-emerald-100">
            <TrendingUp size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Taxa de Resolução</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{carregando ? '-' : `${taxaResolucao}%`}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-linear-to-bl from-purple-50 to-transparent rounded-bl-full"></div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl ring-1 ring-inset ring-purple-100">
            <Clock size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tempo Médio</p>
            <h3 className=" font-black text-gray-400 mt-1 flex items-center gap-2 text-sm">
               Em breve
            </h3>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Resultados da Pesquisa</h3>
          {!carregando && dados.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
              {dados.length} registo(s)
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Setor Origem</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assunto</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {carregando ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Loader2 size={32} className="animate-spin text-blue-600 mb-4" />
                      <p className="font-medium text-gray-900">A processar relatório...</p>
                      <p className="text-sm mt-1">Conectando à base de dados.</p>
                    </div>
                  </td>
                </tr>
              ) : dados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center flex-col items-center justify-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4 ring-1 ring-gray-100">
                      <BarChart3 className="h-8 w-8 text-gray-400" aria-hidden="true" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum dado encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Não existem chamados que correspondam aos filtros selecionados.
                    </p>
                  </td>
                </tr>
              ) : (
                dados.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">#{item.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {item.dataAbertura}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{item.setor}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.problema}>
                      <div className="font-medium text-gray-900 truncate">{item.assunto}</div>
                      <div className="text-gray-400 text-xs mt-0.5 truncate">{item.problema || 'Sem descrição'}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {renderStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}