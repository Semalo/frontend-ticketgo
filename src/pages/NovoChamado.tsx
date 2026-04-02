import { useState, useEffect } from 'react';
import { Save, X, Clock, User, Building, Info, PlusCircle, PenLine, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SETORES_MAP, ASSUNTOS_MAP } from '../utils/dicionarios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext'; 

export function NovoChamado() {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [dataHoraAtual, setDataHoraAtual] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const agora = new Date();
    setDataHoraAtual(agora.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
  }, []);

  const [formData, setFormData] = useState({
    idSetorDestino: '',
    contato: '', 
    idAssunto: '',
    problema: '', 
  });

  useEffect(() => {
    if (user?.nomeUsuario) {
      setFormData((prev) => ({ ...prev, contato: user.nomeUsuario }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codigoUsuario = user?.codigoUsuario; 

    if (!codigoUsuario) {
      toast.error('Erro: Não foi possível identificar o seu código de usuário. Tente fazer login novamente.');
      return;
    }

    setLoading(true);
    
    const payloadSankhya = {
      idSetorDestino: formData.idSetorDestino,
      contato: formData.contato,
      idAssunto: formData.idAssunto,
      codUsuInc: codigoUsuario, 
      problema: formData.problema,
    };

    try {
      const response = await api.post('/api/sankhya/chamados', payloadSankhya);

      if (response.data.sucesso) {
        toast.success('Chamado aberto com sucesso!');
        navigate('/chamados'); 
      } else {
        toast.error('Erro ao criar chamado: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao salvar no Sankhya:', error);
      toast.error('Erro ao comunicar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm text-white">
            <PlusCircle size={24} strokeWidth={2} />
          </div>
          Abrir Novo Chamado
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Preencha os detalhes abaixo com a maior clareza possível para que a equipa de suporte possa ajudar rapidamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Seção 1: Informações do Sistema (Contexto) */}
        <div className="bg-linear-to-r from-slate-50 to-white border-b border-gray-100 p-6 sm:p-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Info size={16} className="text-blue-500" /> Detalhes da Sessão
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Solicitante</label>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <User size={16} className="text-slate-400" />
                {user?.nomeUsuario || 'A carregar...'}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Setor Origem</label>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Building size={16} className="text-slate-400" />
                <span className="truncate" title={user?.setorNome || SETORES_MAP[user?.setorId as string]}>
                  {user?.setorNome || SETORES_MAP[user?.setorId as string] || 'Desconhecido'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Abertura</label>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Clock size={16} className="text-slate-400" />
                {dataHoraAtual}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Status Inicial</label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>
                  Aberto
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Formulário Editável */}
        <div className="p-6 sm:p-8 space-y-8">
          
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
            <PenLine size={16} className="text-blue-500" /> Dados do Pedido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Setor Destino */}
            <div className="space-y-1.5">
              <label htmlFor="idSetorDestino" className="block text-sm font-semibold text-gray-700">
                Setor Destino <span className="text-red-500">*</span>
              </label>
              <select
                id="idSetorDestino"
                name="idSetorDestino"
                value={formData.idSetorDestino}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm transition-all"
              >
                <option value="" disabled>Selecione o setor responsável...</option>
                {Object.entries(SETORES_MAP).map(([id, nome]) => (
                  <option key={id} value={id}>{nome}</option>
                ))}
              </select>
            </div>

            {/* Assunto do Chamado */}
            <div className="space-y-1.5">
              <label htmlFor="idAssunto" className="block text-sm font-semibold text-gray-700">
                Assunto do Chamado <span className="text-red-500">*</span>
              </label>
              <select
                id="idAssunto"
                name="idAssunto"
                value={formData.idAssunto}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm transition-all"
              >
                <option value="" disabled>Qual é o tema principal?</option>
                {Object.entries(ASSUNTOS_MAP).map(([id, nome]) => (
                  <option key={id} value={id}>{nome}</option>
                ))}
              </select>
            </div>
            
            {/* Contato */}
            <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
              <label htmlFor="contato" className="block text-sm font-semibold text-gray-700">
                Nome e Telefone de Contato <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contato"
                name="contato"
                value={formData.contato}
                onChange={handleChange}
                placeholder="Ex: João - (67) 99999-9999"
                required
                className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm transition-all"
              />
            </div>

            {/* Alerta de Prioridade */}
            <div className="hidden lg:flex items-center pt-6">
              <div className="flex gap-2.5 items-start text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                <p>A <strong>prioridade</strong> (Normal, Urgente, etc.) será avaliada e definida pelo analista responsável após a triagem inicial.</p>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label htmlFor="problema" className="block text-sm font-semibold text-gray-700">
              Descrição detalhada do problema ou pedido <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Por favor, forneça o máximo de contexto possível (sistemas envolvidos, mensagens de erro, etc).</p>
            <textarea
              id="problema"
              name="problema"
              value={formData.problema}
              onChange={handleChange}
              rows={6}
              placeholder="Descreva a sua necessidade aqui..."
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm transition-all resize-y"
            ></textarea>
          </div>
        </div>

        {/* Rodapé e Ações */}
        <div className="bg-gray-50 px-6 py-4 sm:px-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/chamados')}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <X size={18} /> Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> A submeter pedido...</>
            ) : (
              <><Save size={18} /> Confirmar e Abrir Chamado</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}