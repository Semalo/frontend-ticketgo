import { useState, useEffect } from 'react';
import { Ticket, Clock, AlertCircle, Search, MoreHorizontal } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
// Interface do TypeScript baseada no que o Node.js devolve
interface Chamado {
  idChamado: number;
  contato: string;
  dataAbertura: string;
  prioridade: string;
  problema: string;
  nomeAssunto: string;
  nomeStatus: string;
  idStatus: string;
}

export function MeusChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10; // quantidade por página
  const navigate = useNavigate();
  // Busca os chamados assim que a tela abre
  useEffect(() => {
    const buscarChamados = async () => {
      try {
        const response = await api.get('/api/sankhya/chamados');
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
  }, []);
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);
  // Filtra os chamados pela barra de pesquisa (busca por ID ou Assunto)
  const chamadosFiltrados = chamados.filter(chamado =>
    chamado.idChamado.toString().includes(busca) ||
    chamado.nomeAssunto.toLowerCase().includes(busca.toLowerCase()) ||
    chamado.contato.toLowerCase().includes(busca.toLowerCase())
  );
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const chamadosPagina = chamadosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(chamadosFiltrados.length / itensPorPagina);
  // Função para renderizar a cor do status
  const renderStatusBadge = (status: string, nome: string) => {
    switch (status) {
      case '0': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">{nome}</span>;
      case '1': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{nome}</span>;
      case '2': return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">{nome}</span>;
      case '3': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{nome}</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{nome}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="text-blue-600" /> Fila de Chamados
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Acompanhe as solicitações em andamento (TI).</p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por ID, Nome ou Assunto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabela de Chamados */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            Carregando chamados...
          </div>
        ) : chamadosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum chamado encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Solicitante</th>
                  <th className="px-6 py-4 font-semibold">Assunto</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Prioridade</th>
                  <th className="px-6 py-4 font-semibold">Abertura</th>
                  <th className="px-6 py-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chamadosPagina.map((chamado) => (
                  <tr
                    key={chamado.idChamado}
                    onClick={() => navigate(`/chamado/${chamado.idChamado}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >

                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{chamado.idChamado}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {chamado.contato}
                    </td>

                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate" title={chamado.problema}>
                      <span className="font-medium text-gray-900 block">{chamado.nomeAssunto}</span>
                      <span className="text-xs text-gray-500 truncate">{chamado.problema}</span>
                    </td>

                    <td className="px-6 py-4">
                      {renderStatusBadge(chamado.idStatus, chamado.nomeStatus)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        {chamado.prioridade?.toUpperCase() === 'ALTA' && <AlertCircle size={16} className="text-red-500" />}
                        {chamado.prioridade}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {chamado.dataAbertura}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm">
              <span className="text-gray-500">
                Página {totalPaginas === 0 ? 0 : paginaAtual} de {totalPaginas || 0}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={paginaAtual === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaginaAtual((p) => p - 1);
                  }}
                  className="px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaginaAtual((p) => p + 1);
                  }}
                  className="px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}