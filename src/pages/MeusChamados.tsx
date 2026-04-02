import { useState, useEffect } from 'react';
import { Ticket, Clock, AlertCircle, Search, ArrowUpRight, ArrowDownLeft, CheckCircle2, Download, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; 
import * as XLSX from 'xlsx';

interface Chamado {
  idChamado: number;
  contato: string;
  dataAbertura: string;
  prioridade: string;
  problema: string;
  nomeAssunto: string;
  nomeStatus: string;
  idStatus: string;
  codUsuInc: string;
  idSetorDestino: string;
  setorOrigem: string; 
}

type FiltroTipo = 'TODOS' | 'RECEBIDOS' | 'ENVIADOS' | 'CONCLUÍDOS';

const formatarComoTitulo = (texto?: string) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export function MeusChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('RECEBIDOS');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const codigoUsuario = user?.codigoUsuario;

  useEffect(() => {
    const buscarChamados = async () => {
      if (!user?.setorId || !codigoUsuario) return; 

      try {
        setLoading(true);
        const response = await api.get('/api/sankhya/chamados', {
          params: {
            setorDestino: user.setorId,
            codUsuInc: codigoUsuario 
          }
        });
        
        if (response.data.sucesso) {
          setChamados(response.data.dados);
        }
      } catch (error) {
        console.error('Erro ao buscar chamados:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarChamados();
  }, [user, codigoUsuario]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, filtroTipo]);

  const chamadosFiltrados = chamados.filter(chamado => {
    const textoMatch = chamado.idChamado.toString().includes(busca) ||
                       chamado.nomeAssunto.toLowerCase().includes(busca.toLowerCase()) ||
                       chamado.contato.toLowerCase().includes(busca.toLowerCase());

    const abertoPorMim = String(chamado.codUsuInc) === String(codigoUsuario);
    const paraMeuSetor = String(chamado.idSetorDestino) === String(user?.setorId);
    const encerrado = String(chamado.idStatus) === '3'; 

    let tipoMatch = true;

    if (filtroTipo === 'TODOS') {
      tipoMatch = true; 
    } 
    else if (filtroTipo === 'RECEBIDOS') {
      tipoMatch = paraMeuSetor && !encerrado;
    } 
    else if (filtroTipo === 'ENVIADOS') {
      tipoMatch = abertoPorMim && !encerrado;
    } 
    else if (filtroTipo === 'CONCLUÍDOS') {
      tipoMatch = encerrado;
    }

    return textoMatch && tipoMatch;
  });

  const exportarParaExcel = () => {
    if (chamadosFiltrados.length === 0) {
      alert('Não há dados para exportar com o filtro atual.');
      return;
    }

    const dadosParaExcel = chamadosFiltrados.map((chamado) => ({
      'ID': chamado.idChamado,
      'Solicitante': chamado.contato,
      'Setor de Origem': chamado.setorOrigem,
      'Assunto': chamado.nomeAssunto,
      'Descrição do Problema': chamado.problema,
      'Status': chamado.nomeStatus,
      'Prioridade': chamado.prioridade,
      'Data de Abertura': chamado.dataAbertura,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chamados');
    XLSX.writeFile(workbook, 'Relatorio_Meus_Chamados.xlsx');
  };

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const chamadosPagina = chamadosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(chamadosFiltrados.length / itensPorPagina);

  const renderStatusBadge = (status: string, nome: string) => {
    switch (status) {
      case '0': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{nome}</span>;
      case '1': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{nome}</span>;
      case '2': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{nome}</span>;
      case '3': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{nome}</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{nome}</span>;
    }
  };

  const abas = [
    { id: 'TODOS', label: 'Todos os Chamados', icon: Inbox },
    { id: 'RECEBIDOS', label: 'Para minha fila', icon: ArrowDownLeft },
    { id: 'ENVIADOS', label: 'Abertos por mim', icon: ArrowUpRight },
    { id: 'CONCLUÍDOS', label: 'Concluídos', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full mx-auto space-y-6 px-2 sm:px-4 lg:px-8 py-6">
      
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm text-white">
              <Ticket size={24} strokeWidth={2} />
            </div>
            Gestão de Chamados
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Acompanhe, gerencie e responda às solicitações direcionadas à sua fila ou abertas por você.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex flex-col sm:flex-row gap-3">
          {/* Campo de Busca */}
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all shadow-sm"
              placeholder="Buscar ID, assunto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          <button
            onClick={exportarParaExcel}
            className="inline-flex items-center justify-center gap-x-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Download className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs (Abas de Filtro) */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {abas.map((aba) => {
            const Icon = aba.icon;
            const isAtivo = filtroTipo === aba.id;
            return (
              <button
                key={aba.id}
                onClick={() => setFiltroTipo(aba.id as FiltroTipo)}
                className={`
                  whitespace-nowrap flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${isAtivo 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                <Icon size={18} className={isAtivo ? 'text-blue-500' : 'text-gray-400'} />
                {aba.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Container da Tabela */}
      <div className="bg-white ring-1 ring-gray-300 sm:rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-14 text-center text-gray-500 flex flex-col items-center justify-center bg-gray-50/50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-medium text-gray-900">Sincronizando dados...</p>
            <p className="text-sm mt-1">Conectando à base da Sankhya.</p>
          </div>
        ) : chamadosFiltrados.length === 0 ? (
          <div className="px-6 py-16 text-center flex flex-col items-center justify-center bg-gray-50/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Ticket className="h-8 w-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum chamado encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há registros que correspondam aos filtros ou buscas aplicadas no momento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Origem</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Solicitante</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assunto</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prioridade</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Abertura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {chamadosPagina.map((chamado) => {
                  const abertoPorMim = chamado.codUsuInc === codigoUsuario?.toString();
                  const paraMeuSetor = chamado.idSetorDestino === user?.setorId?.toString();

                  return (
                    <tr
                      key={chamado.idChamado}
                      onClick={() => navigate(`/chamado/${chamado.idChamado}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {abertoPorMim && !paraMeuSetor ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md w-fit ring-1 ring-inset ring-emerald-600/20">
                            <ArrowUpRight size={14} /> <span className="hidden sm:inline">Enviado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md w-fit ring-1 ring-inset ring-blue-600/20">
                            <ArrowDownLeft size={14} /> <span className="hidden sm:inline">Recebido</span>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        #{chamado.idChamado}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">{chamado.contato}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{chamado.setorOrigem}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-50 sm:max-w-xs truncate" title={chamado.problema}>
                        <div className="font-medium text-gray-900 truncate">{chamado.nomeAssunto}</div>
                        <div className="text-gray-500 text-xs mt-0.5 truncate">{chamado.problema || 'Sem descrição detalhada'}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {renderStatusBadge(chamado.idStatus, chamado.nomeStatus)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                         <div className={`flex items-center gap-1.5 font-medium ${chamado.prioridade?.toUpperCase() === 'URGENTE' ? 'text-red-600' : 'text-gray-600'}`}>
                          {chamado.prioridade?.toUpperCase() === 'URGENTE' && <AlertCircle size={14} />}
                          {formatarComoTitulo(chamado.prioridade)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400" />
                          {chamado.dataAbertura}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {!loading && chamadosFiltrados.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando página <span className="font-medium">{paginaAtual}</span> de <span className="font-medium">{totalPaginas}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    disabled={paginaAtual === 1}
                    onClick={(e) => { e.stopPropagation(); setPaginaAtual((p) => p - 1); }}
                    className="relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={paginaAtual === totalPaginas}
                    onClick={(e) => { e.stopPropagation(); setPaginaAtual((p) => p + 1); }}
                    className="relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            </div>
            {/* Paginação Mobile */}
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual((p) => p - 1)}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual((p) => p + 1)}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}