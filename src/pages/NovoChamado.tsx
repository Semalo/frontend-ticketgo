import { useState, useEffect } from 'react';
import { Save, X, Clock, User, Building, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Certifique-se de que o caminho está correto
import { SETORES_MAP, ASSUNTOS_MAP } from '../utils/dicionarios'; // Importando os dicionários

export function NovoChamado() {
  const navigate = useNavigate();

  // Simulando dados do usuário logado (futuramente virá do Contexto de Autenticação)
  const usuarioLogado = {
    nome: 'RAUL LOPES', // Coloquei em maiúsculo para combinar com a Sankhya
    codigo: '1936', // Adicionado o código do usuário para a Sankhya
    setorOrigem: '14', // Usando o ID do setor (ex: 14 = TI)
  };

  // Estado para capturar a data e hora atual
  const [dataHoraAtual, setDataHoraAtual] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const agora = new Date();
    // Formata a data para o padrão local (ex: 15/03/2026 10:30)
    setDataHoraAtual(agora.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
  }, []);

  // Estado do formulário atualizado para os campos da Sankhya
  const [formData, setFormData] = useState({
    idSetorDestino: '',
    contato: usuarioLogado.nome, // Já preenche com o nome do logado
    idAssunto: '',
    problema: '', // Equivalente à 'descricao' do seu código original
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Objeto final que será enviado para a API (Sankhya)
    const payloadSankhya = {
      idSetorDestino: formData.idSetorDestino,
      contato: formData.contato,
      idAssunto: formData.idAssunto,
      codUsuInc: usuarioLogado.codigo,
      problema: formData.problema,
    };

    try {
      const response = await api.post('/api/sankhya/chamados', payloadSankhya);

      if (response.data.sucesso) {
        alert('Chamado aberto com sucesso!');
        navigate('/chamados'); // Volta para a lista de chamados
      } else {
        alert('Erro ao criar chamado: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao salvar no Sankhya:', error);
      alert('Erro ao comunicar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
                {/* Busca o nome do setor pelo ID usando o dicionário */}
                <span className="text-sm font-medium">{SETORES_MAP[usuarioLogado.setorOrigem] || 'Desconhecido'}</span>
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
                <span className="text-sm font-medium text-blue-700">Aberto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Detalhes do Chamado (Campos Editáveis) */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setor Destino (Dropdown Dinâmico) */}
            <div>
              <label htmlFor="idSetorDestino" className="block text-sm font-medium text-gray-700 mb-1">
                Setor Destino *
              </label>
              <select
                id="idSetorDestino"
                name="idSetorDestino"
                value={formData.idSetorDestino}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Selecione o setor...</option>
                {Object.entries(SETORES_MAP).map(([id, nome]) => (
                  <option key={id} value={id}>{nome}</option>
                ))}
              </select>
            </div>

            {/* Assunto do Chamado (Dropdown Dinâmico) */}
            <div>
              <label htmlFor="idAssunto" className="block text-sm font-medium text-gray-700 mb-1">
                Assunto do Chamado *
              </label>
              <select
                id="idAssunto"
                name="idAssunto"
                value={formData.idAssunto}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Selecione o assunto...</option>
                {Object.entries(ASSUNTOS_MAP).map(([id, nome]) => (
                  <option key={id} value={id}>{nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome / Telefone de Contato */}
            <div>
              <label htmlFor="contato" className="block text-sm font-medium text-gray-700 mb-1">
                Nome e Telefone de Contato *
              </label>
              <input
                type="text"
                id="contato"
                name="contato"
                value={formData.contato}
                onChange={handleChange}
                placeholder="Ex: João - (67) 99999-9999"
                required
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
             {/* Removi o campo "Prioridade" daqui porque, segundo o JSON que me enviaste, o Sankhya não pede ele no INSERT inicial. Caso o Sankhya precise, podemos adicioná-lo depois. */}
             <div className="flex flex-col justify-center">
                <span className="text-xs text-gray-500 italic flex items-center gap-1 mt-6">
                  * A prioridade será avaliada pelo analista responsável.
                </span>
             </div>
          </div>

          {/* Descrição do Chamado */}
          <div>
            <label htmlFor="problema" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição detalhada *
            </label>
            <textarea
              id="problema"
              name="problema"
              value={formData.problema}
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
            onClick={() => navigate('/chamados')} // Ajustei a navegação para voltar à lista
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={18} /> Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50"
          >
            {loading ? 'A processar...' : <><Save size={18} /> Abrir Chamado</>}
          </button>
        </div>

      </form>
    </div>
  );
}