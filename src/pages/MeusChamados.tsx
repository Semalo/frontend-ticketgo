import { useState } from 'react';
import { Search, Filter, Eye, Inbox, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
// Mock de dados (Simulando o retorno da API do Sankhya)
const mockChamados = [
  { id: 'CHM-1045', assunto: 'Dúvida sobre lançamento contábil', setorOrigem: 'Vendas', setorDestino: 'Contabilidade', solicitante: 'Maria Souza', data: '15/03/2026', status: 'Aberto', prioridade: 'Alta' },
  { id: 'CHM-1046', assunto: 'Ajuste de centro de custo', setorOrigem: 'RH', setorDestino: 'Contabilidade', solicitante: 'Carlos Lima', data: '14/03/2026', status: 'Em Andamento', prioridade: 'Média' },
  { id: 'CHM-1042', assunto: 'Impressora sem toner', setorOrigem: 'Contabilidade', setorDestino: 'TI', solicitante: 'Raul Silva', data: '15/03/2026', status: 'Aberto', prioridade: 'Baixa' },
  { id: 'CHM-1030', assunto: 'Ar condicionado pingando', setorOrigem: 'Contabilidade', setorDestino: 'Manutenção', solicitante: 'Raul Silva', data: '12/03/2026', status: 'Em Andamento', prioridade: 'Média' },
  { id: 'CHM-1010', assunto: 'Acesso bloqueado no Sankhya', setorOrigem: 'Contabilidade', setorDestino: 'TI', solicitante: 'Raul Silva', data: '10/03/2026', status: 'Concluído', prioridade: 'Alta' },
  { id: 'CHM-1005', assunto: 'Relatório de despesas', setorOrigem: 'Diretoria', setorDestino: 'Contabilidade', solicitante: 'Ana Paula', data: '05/03/2026', status: 'Concluído', prioridade: 'Média' },
];

export function MeusChamados() {
  const [activeTab, setActiveTab] = useState<'entrada' | 'saida' | 'historico'>('entrada');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulando o setor do usuário logado
  const setorUsuario = 'Contabilidade';

  // Lógica de filtragem baseada na aba ativa e no setor do usuário
  const chamadosFiltrados = mockChamados.filter((chamado) => {
    const matchesSearch = chamado.assunto.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          chamado.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'entrada') {
      // Caixa de Entrada: Chamados destinados ao meu setor que não estão concluídos
      return chamado.setorDestino === setorUsuario && chamado.status !== 'Concluído';
    } 
    if (activeTab === 'saida') {
      // Minhas Solicitações: Chamados que meu setor abriu que não estão concluídos
      return chamado.setorOrigem === setorUsuario && chamado.status !== 'Concluído';
    }
    // Histórico: Todos os chamados do meu setor que já foram concluídos
    return (chamado.setorOrigem === setorUsuario || chamado.setorDestino === setorUsuario) && chamado.status === 'Concluído';
  });

  // Funções para estilizar os Badges (Etiquetas)
  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'Média': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Baixa': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto': return 'bg-blue-100 text-blue-700';
      case 'Em Andamento': return 'bg-purple-100 text-purple-700';
      case 'Concluído': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-10xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Chamados</h1>
          <p className="text-gray-500 mt-1">Gerencie as demandas do setor de {setorUsuario}</p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por ID ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Navegação por Abas (Tabs) */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('entrada')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'entrada' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Inbox size={18} /> Caixa de Entrada
          </button>
          <button
            onClick={() => setActiveTab('saida')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'saida' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Send size={18} /> Minhas Solicitações
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'historico' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={18} /> Histórico (Concluídos)
          </button>
        </div>

        {/* Tabela de Dados Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID Chamado</th>
                <th className="px-6 py-4">Assunto</th>
                <th className="px-6 py-4 whitespace-nowrap">
                  {activeTab === 'saida' ? 'Setor Destino' : 'Setor Origem'}
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Data</th>
                <th className="px-6 py-4 whitespace-nowrap">Prioridade</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chamadosFiltrados.length > 0 ? (
                chamadosFiltrados.map((chamado) => (
                  <tr key={chamado.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {chamado.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {chamado.assunto}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">Sol: {chamado.solicitante}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {activeTab === 'saida' ? chamado.setorDestino : chamado.setorOrigem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {chamado.data}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPrioridadeColor(chamado.prioridade)}`}>
                        {chamado.prioridade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(chamado.status)}`}>
                        {chamado.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Link to={`/chamado/${chamado.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye size={18} />
                    </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nenhum chamado encontrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}