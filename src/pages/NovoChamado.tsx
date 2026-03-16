import { useState, useEffect } from 'react';
import { Save, X, Clock, User, Building, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NovoChamado() {
  const navigate = useNavigate();

  // Simulando dados do usuário logado (futuramente virá do Contexto de Autenticação)
  const usuarioLogado = {
    nome: 'Raul Silva',
    setorOrigem: 'Contabilidade',
  };

  // Estado para capturar a data e hora atual
  const [dataHoraAtual, setDataHoraAtual] = useState('');

  useEffect(() => {
    const agora = new Date();
    // Formata a data para o padrão local (ex: 15/03/2026 10:30)
    setDataHoraAtual(agora.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
  }, []);

  // Estado do formulário
  const [formData, setFormData] = useState({
    setorDestino: '',
    contato: '',
    assunto: '',
    prioridade: 'Baixa',
    descricao: '',
    status: 'Aberto', // Padrão ao abrir um chamado
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Objeto final que será enviado para a API do Sankhya
    const payloadSankhya = {
      ...formData,
      usuarioSolicitante: usuarioLogado.nome,
      setorOrigem: usuarioLogado.setorOrigem,
      dataAtendimento: dataHoraAtual,
    };

    console.log('Dados prontos para o Sankhya:', payloadSankhya);
    alert('Chamado aberto com sucesso! (Simulação)');
    navigate('/dashboard'); // Volta para o dashboard após salvar
  };

  return (
    <div className="max-w-10xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Abrir Novo Chamado</h1>
        <p className="text-gray-500 mt-1">Preencha os detalhes abaixo para solicitar atendimento.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Seção 1: Informações Automáticas (Somente Leitura) */}
        <div className="bg-slate-50 border-b border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info size={16} /> Informações do Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Usuário Solicitante */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Solicitante</label>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                <User size={16} className="text-gray-400" />
                <span className="text-sm font-medium">{usuarioLogado.nome}</span>
              </div>
            </div>

            {/* Setor Origem */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Setor Origem</label>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                <Building size={16} className="text-gray-400" />
                <span className="text-sm font-medium">{usuarioLogado.setorOrigem}</span>
              </div>
            </div>

            {/* Data/Hora de Atendimento */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Abertura / Atendimento</label>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm font-medium">{dataHoraAtual}</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status Inicial</label>
              <div className="flex items-center gap-2 text-gray-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm font-medium text-blue-700">{formData.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Detalhes do Chamado (Campos Editáveis) */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setor Destino (Dropdown) */}
            <div>
              <label htmlFor="setorDestino" className="block text-sm font-medium text-gray-700 mb-1">
                Setor Destino *
              </label>
              <select
                id="setorDestino"
                name="setorDestino"
                value={formData.setorDestino}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Selecione o setor...</option>
                <option value="ti">Tecnologia da Informação (TI)</option>
                <option value="manutencao">Manutenção Predial</option>
                <option value="rh">Recursos Humanos</option>
                <option value="financeiro">Financeiro</option>
              </select>
            </div>

            {/* Prioridade (Dropdown) */}
            <div>
              <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                id="prioridade"
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="Baixa">Baixa (Pode aguardar)</option>
                <option value="Media">Média (Requer atenção em breve)</option>
                <option value="Alta">Alta (Urgente / Impacta operação)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assunto */}
            <div>
              <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                Assunto do Chamado *
              </label>
              <input
                type="text"
                id="assunto"
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                placeholder="Ex: Impressora sem toner"
                required
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Nome / Telefone de Contato */}
            <div>
              <label htmlFor="contato" className="block text-sm font-medium text-gray-700 mb-1">
                Nome e Telefone de Contato
              </label>
              <input
                type="text"
                id="contato"
                name="contato"
                value={formData.contato}
                onChange={handleChange}
                placeholder="Ex: João - (67) 99999-9999"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Descrição do Chamado */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição detalhada *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={5}
              placeholder="Descreva o problema ou solicitação com o máximo de detalhes possível..."
              required
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
            ></textarea>
          </div>
        </div>

        {/* Rodapé: Botões de Ação */}
        <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={18} /> Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 focus:ring-4 focus:ring-blue-500/50"
          >
            <Save size={18} /> Abrir Chamado
          </button>
        </div>

      </form>
    </div>
  );
}