import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  Building,  
  Save,
  CheckCircle2,
  Paperclip,
  X
} from 'lucide-react';
import api from '../services/api';

export function DetalhesChamado() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // BUSCA O USUÁRIO LOGADO NO LOCALSTORAGE
  // ==========================================
  const usuarioStorage = localStorage.getItem('usuario_logado');
  const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
  // Pega o código do usuário logado. Se falhar, usa '1936' como garantia para não quebrar.
  const CODIGO_ANALISTA_ATUAL = usuario?.codigoUsuario || '1936'; 

  // Estados dos dados que vêm da API
  const [chamado, setChamado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Estados geríveis no ecrã (Selects e Inputs)
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  // ==========================================
  // ESTADOS PARA O ANEXO
  // ==========================================
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [descricaoAnexo, setDescricaoAnexo] = useState('');
  const [enviandoAnexo, setEnviandoAnexo] = useState(false);

  const handleEnviarAnexo = async () => {
    if (!arquivoSelecionado) return;
    setEnviandoAnexo(true);

    try {
      const formData = new FormData();
      formData.append('arquivo', arquivoSelecionado);
      formData.append('descricao', descricaoAnexo || 'Anexo via Portal');

      const response = await api.post(`/api/sankhya/chamados/${id}/anexo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.sucesso) {
        alert('Anexo enviado com sucesso!');
        setArquivoSelecionado(null);
        setDescricaoAnexo('');
        await buscarDetalhes(); // Recarrega para vermos a atualização
      } else {
        alert('Erro: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao enviar anexo:', error);
      alert('Falha na conexão ao enviar o anexo.');
    } finally {
      setEnviandoAnexo(false);
    }
  };

  // 1. Função para carregar/recarregar os dados
  const buscarDetalhes = async () => {
    try {
      const response = await api.get(`/api/sankhya/chamados/${id}`);
      if (response.data.sucesso) {
        const dados = response.data.dados;
        setChamado(dados);
        
        // Sincroniza os selects com os dados reais do banco
        setStatus(dados.idStatus); 
        setPrioridade(dados.prioridade);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do chamado:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Chama a busca na primeira vez que a tela abre
  useEffect(() => {
    if (id) buscarDetalhes();
  }, [id]);

  // 3. Salvar Alterações (Status)
  const handleSalvarAlteracoes = async () => {
    setSalvando(true);

    try {
      // Adicionamos a prioridade no envio
      const payload = {
        codAnalista: CODIGO_ANALISTA_ATUAL,
        idStatus: status,
        prioridade: prioridade 
      };

      const response = await api.put(`/api/sankhya/chamados/${id}`, payload);

      if (response.data.sucesso) {
        alert('Alterações guardadas com sucesso!');
        await buscarDetalhes(); 
      } else {
        alert('Erro ao guardar: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Falha na conexão ao tentar atualizar o chamado.');
    } finally {
      setSalvando(false);
    }
  };

  // 4. Enviar nova mensagem/interação
  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    
    setEnviando(true);

    try {
      // Usando o código do analista logado!
      const payload = {
        codAnalista: CODIGO_ANALISTA_ATUAL, 
        descricao: novaMensagem
      };

      const response = await api.post(`/api/sankhya/chamados/${id}/interacao`, payload);

      if (response.data.sucesso) {
        setNovaMensagem(''); // Limpa a caixa de texto
        await buscarDetalhes(); // Recarrega a timeline
      } else {
        alert('Erro ao enviar mensagem: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao enviar interação:', error);
      alert('Falha na conexão ao tentar enviar a resposta.');
    } finally {
      setEnviando(false);
    }
  };

  // Tela de Carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        A carregar detalhes do pedido...
      </div>
    );
  }

  // Se o ID não existir no banco
  if (!chamado) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Chamado não encontrado</h2>
        <button onClick={() => navigate('/chamados')} className="mt-4 text-blue-600 hover:underline">Voltar para a lista</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Cabeçalho de Navegação */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/chamados')} 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">CHM-{chamado.idChamado}</h1>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
              {chamado.nomeStatus}
            </span>
          </div>
          <p className="text-gray-500 mt-1 font-medium">{chamado.nomeAssunto}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal (Esquerda) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              Descrição do Pedido
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {chamado.problema || 'Nenhuma descrição detalhada informada.'}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Histórico de Interações
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {chamado.interacoes.map((interacao: any) => (
                <div key={interacao.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    {interacao.tipo === 'comentario' ? <MessageSquare size={16} /> : <CheckCircle2 size={16} />}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 text-sm">{interacao.autor}</span>
                      <span className="text-xs text-gray-500 font-medium">{interacao.data}</span>
                    </div>
                    <p className={`text-sm ${interacao.tipo === 'status' ? 'text-gray-500 italic' : 'text-gray-700 whitespace-pre-wrap'}`}>
                      {interacao.texto}
                    </p>
                  </div>
                  
                </div>
              ))}

            </div>

            {/* ========================================== */}
            {/* ÁREA DE INSERÇÃO DE COMENTÁRIOS E ANEXOS */}
            {/* ========================================== */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar um comentário ou anexo</label>
              
              {/* Preview e Envio de Anexo */}
              {arquivoSelecionado && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-800 flex items-center gap-2">
                      <Paperclip size={16} /> {arquivoSelecionado.name}
                    </span>
                    <button 
                      onClick={() => setArquivoSelecionado(null)} 
                      disabled={enviandoAnexo}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={descricaoAnexo}
                    onChange={(e) => setDescricaoAnexo(e.target.value)}
                    placeholder="Escreva uma descrição para este ficheiro..."
                    disabled={enviandoAnexo}
                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <button 
                    onClick={handleEnviarAnexo}
                    disabled={enviandoAnexo}
                    className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {enviandoAnexo ? 'A enviar anexo...' : 'Confirmar Envio de Anexo'}
                  </button>
                </div>
              )}

              {/* Input de arquivo escondido */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => setArquivoSelecionado(e.target.files?.[0] || null)}
              />

              {/* Formulário de Mensagem Normal */}
              <form onSubmit={handleEnviarMensagem} className="relative">
                <textarea 
                  rows={3}
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Escreva a sua mensagem ou atualização..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                  disabled={enviando || enviandoAnexo}
                ></textarea>
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={enviando || enviandoAnexo}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50" 
                    title="Anexar ficheiro"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button 
                    type="submit" 
                    disabled={enviando || enviandoAnexo || !!arquivoSelecionado}
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {enviando ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Coluna Lateral (Direita) */}
        <div className="space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Gestão do Pedido</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="0">Aguardando usuário</option>
                  <option value="1">Aberto</option>
                  <option value="2">Em atendimento</option>
                  <option value="3">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridade</label>
                <select 
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENTE">Urgente</option>
                  <option value="IMEDIATO">Imediato</option>
                </select>
              </div>

              <button 
                onClick={handleSalvarAlteracoes}
                disabled={salvando}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Save size={18} /> {salvando ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Detalhes do Solicitante</h3>
            
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1"><User size={14}/> Nome</span>
                <span className="font-medium text-gray-800">{chamado.contato}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1"><Building size={14}/> Setor Origem</span>
                <span className="font-medium text-gray-800">{chamado.nomeSetorOrigem}</span>
              </li>
              <li className="flex flex-col mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1"><Clock size={14}/> Aberto em</span>
                <span className="font-medium text-gray-800">{chamado.dataAbertura}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}