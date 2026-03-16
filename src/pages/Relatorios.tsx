import { useState } from 'react';
import { 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

// Mock de dados para o relatório
const mockRelatorio = [
  { id: 'CHM-1045', setor: 'Vendas', assunto: 'Dúvida lançamento', status: 'Aberto', tempoResolucao: '-', dataAbertura: '15/03/2026' },
  { id: 'CHM-1010', setor: 'Contabilidade', assunto: 'Acesso bloqueado', status: 'Concluído', tempoResolucao: '4h 30m', dataAbertura: '10/03/2026' },
  { id: 'CHM-1005', setor: 'Diretoria', assunto: 'Relatório despesas', status: 'Concluído', tempoResolucao: '1h 15m', dataAbertura: '05/03/2026' },
  { id: 'CHM-0998', setor: 'RH', assunto: 'Erro na folha', status: 'Concluído', tempoResolucao: '12h 00m', dataAbertura: '01/03/2026' },
];

export function Relatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [setorFiltro, setSetorFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui entrará a chamada à API do Sankhya com os filtros selecionados
    console.log('Gerando relatório com filtros:', { dataInicio, dataFim, setorFiltro, statusFiltro });
    alert('Relatório atualizado com os filtros selecionados!');
  };

  const handleExportar = (formato: string) => {
    console.log(`Exportando para ${formato}...`);
    alert(`Download do ${formato} iniciado! (Simulação)`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Métricas</h1>
          <p className="text-gray-500 mt-1">Extraia dados e analise o desempenho dos atendimentos.</p>
        </div>
        
        {/* Botões de Exportação */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExportar('Excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
          >
            <Download size={16} /> Excel
          </button>
          <button 
            onClick={() => handleExportar('PDF')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Área de Filtros */}
      <form onSubmit={handleGerarRelatorio} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          Filtros do Relatório
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Período */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Início</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Fim</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Setor */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Setor</label>
            <select 
              value={setorFiltro}
              onChange={(e) => setSetorFiltro(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos os Setores</option>
              <option value="TI">TI</option>
              <option value="Contabilidade">Contabilidade</option>
              <option value="RH">RH</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <select 
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos</option>
              <option value="Aberto">Aberto</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </form>

      {/* Resumo Rápido (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><BarChart3 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total no Período</p>
            <h3 className="text-xl font-bold text-gray-900">142 Chamados</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Taxa de Resolução</p>
            <h3 className="text-xl font-bold text-gray-900">92%</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tempo Médio (SLA)</p>
            <h3 className="text-xl font-bold text-gray-900">4h 15m</h3>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">Resultados da Pesquisa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Setor</th>
                <th className="px-6 py-3">Assunto</th>
                <th className="px-6 py-3">Tempo Resolução</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockRelatorio.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">{item.dataAbertura}</td>
                  <td className="px-6 py-4">{item.setor}</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">{item.assunto}</td>
                  <td className="px-6 py-4 font-medium">{item.tempoResolucao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500 bg-gray-50">
          A exibir 4 de 142 registos.
        </div>
      </div>

    </div>
  );
}