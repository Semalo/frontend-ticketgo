import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Ticket, 
  TrendingUp,
  MoreVertical,
  Eye
} from 'lucide-react';

// Mock de dados globais (Visão de Super Usuário/TI)
const mockChamadosRecentes = [
  { id: 'CHM-1049', assunto: 'Servidor ERP lento', setorOrigem: 'Vendas', prioridade: 'Alta', status: 'Aberto', tempo: '10 min atrás' },
  { id: 'CHM-1048', assunto: 'Criação de novo usuário', setorOrigem: 'RH', prioridade: 'Média', status: 'Aberto', tempo: '1 hora atrás' },
  { id: 'CHM-1047', assunto: 'Monitor piscando', setorOrigem: 'Contabilidade', prioridade: 'Baixa', status: 'Em Andamento', tempo: '2 horas atrás' },
  { id: 'CHM-1046', assunto: 'Ajuste de permissão MGE', setorOrigem: 'Diretoria', prioridade: 'Alta', status: 'Aberto', tempo: '3 horas atrás' },
  { id: 'CHM-1040', assunto: 'Instalação de Pacote Office', setorOrigem: 'Marketing', prioridade: 'Média', status: 'Concluído', tempo: 'Ontem' },
];

// Dados para simular um gráfico de barras por setor
const chamadosPorSetor = [
  { setor: 'Vendas', quantidade: 12, cor: 'bg-blue-500', width: 'w-3/4' },
  { setor: 'Contabilidade', quantidade: 8, cor: 'bg-indigo-500', width: 'w-1/2' },
  { setor: 'RH', quantidade: 5, cor: 'bg-purple-500', width: 'w-1/3' },
  { setor: 'Diretoria', quantidade: 2, cor: 'bg-pink-500', width: 'w-1/6' },
];

export function DashboardTI() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Cabeçalho do Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel de Controle - TI</h1>
        <p className="text-gray-500 mt-1">Visão geral de todos os chamados da empresa.</p>
      </div>

      {/* Grid de KPIs (Métricas Principais) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Abertos */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Abertos</p>
            <h3 className="text-2xl font-bold text-gray-900">24</h3>
          </div>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Em Andamento</p>
            <h3 className="text-2xl font-bold text-gray-900">13</h3>
          </div>
        </div>

        {/* Card 3: Críticos / Alta Prioridade */}
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm flex items-center gap-4 ring-1 ring-red-50">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg animate-pulse">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-red-600">Prioridade Alta</p>
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
          </div>
        </div>

        {/* Card 4: Concluídos Hoje */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Resolvidos Hoje</p>
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
          </div>
        </div>
      </div>

      {/* Área de Conteúdo Principal (Gráficos e Tabelas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda: Tabela de Chamados Recentes (Ocupa 2 colunas no desktop) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" /> 
              Fila Recente
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Ver todos</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="px-5 py-3">Chamado</th>
                  <th className="px-5 py-3">Origem</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Tempo</th>
                  <th className="px-5 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockChamadosRecentes.map((chamado) => (
                  <tr key={chamado.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{chamado.id}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{chamado.assunto}</p>
                    </td>
                    <td className="px-5 py-4 font-medium">{chamado.setorOrigem}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        chamado.prioridade === 'Alta' ? 'bg-red-100 text-red-700' :
                        chamado.status === 'Concluído' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {chamado.prioridade === 'Alta' ? 'Urgente' : chamado.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{chamado.tempo}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna Direita: Volume por Setor */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Volume por Setor</h2>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18}/></button>
          </div>
          
          <div className="p-5 flex-1 flex flex-col justify-center space-y-6">
            {chamadosPorSetor.map((item) => (
              <div key={item.setor}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.setor}</span>
                  <span className="text-gray-500 font-bold">{item.quantidade}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${item.cor} ${item.width} h-2.5 rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-xs text-gray-500">Métrica baseada nos últimos 30 dias</p>
          </div>
        </div>

      </div>
    </div>
  );
}