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
  X,
  Lock,
  Headset,
  Ticket,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; 
import toast from 'react-hot-toast';
// Importação do dicionário de setores adicionada aqui
import { SETORES_MAP } from '../utils/dicionarios'; 

export function DetalhesChamado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const codigoUsuario = user?.codigoUsuario;
  const setorUsuarioLogado = user?.setorId;

  const [chamado, setChamado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [setorDestino, setSetorDestino] = useState(''); // Novo estado para o setor de destino
  const [novaMensagem, setNovaMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [descricaoAnexo, setDescricaoAnexo] = useState('');
  const [enviandoAnexo, setEnviandoAnexo] = useState(false);

  const podeGerir = chamado && setorUsuarioLogado?.toString() === chamado.idSetorDestino?.toString();

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
        toast.success('Anexo enviado com sucesso!');
        setArquivoSelecionado(null);
        setDescricaoAnexo('');
        await buscarDetalhes(); 
      } else {
        toast.error('Erro: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao enviar anexo:', error);
      toast.error('Falha na conexão ao enviar o anexo.');
    } finally {
      setEnviandoAnexo(false);
    }
  };

  const buscarDetalhes = async () => {
    try {
      const response = await api.get(`/api/sankhya/chamados/${id}`);
      if (response.data.sucesso) {
        const dados = response.data.dados;
        setChamado(dados);
        setStatus(dados.idStatus); 
        setPrioridade(dados.prioridade);
        setSetorDestino(dados.idSetorDestino?.toString() || ''); // Inicializa o setor de destino atual
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do chamado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) buscarDetalhes();
  }, [id]);

  const handleSalvarAlteracoes = async () => {
    if (!codigoUsuario) return toast.error('Erro: Usuário não identificado.');
    if (!podeGerir) return toast.error('Você não tem permissão para alterar este chamado.');

    setSalvando(true);

    try {
      // Cria o payload base que sempre será enviado
      const payload: any = {
        codAnalista: codigoUsuario,
        idStatus: status,
        prioridade: prioridade,
      };

      // REGRA: Só adiciona o idSetorDestino no payload se ele for diferente do original que veio do banco
      const setorOriginal = chamado.idSetorDestino?.toString();
      if (setorDestino && setorDestino !== setorOriginal) {
        payload.idSetorDestino = setorDestino;
      }

      const response = await api.put(`/api/sankhya/chamados/${id}`, payload);

      if (response.data.sucesso) {
        toast.success('Alterações guardadas com sucesso!');
        await buscarDetalhes(); 
      } else {
        toast.error('Erro ao guardar: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast.error('Falha na conexão ao tentar atualizar o chamado.');
    } finally {
      setSalvando(false);
    }
  };

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !codigoUsuario) return;
    
    setEnviando(true);

    try {
      const payload = {
        codAnalista: codigoUsuario, 
        descricao: novaMensagem
      };

      const response = await api.post(`/api/sankhya/chamados/${id}/interacao`, payload);

      if (response.data.sucesso) {
        setNovaMensagem(''); 
        await buscarDetalhes(); 
      } else {
        toast.error('Erro ao enviar mensagem: ' + response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao enviar interação:', error);
      toast.error('Falha na conexão.');
    } finally {
      setEnviando(false);
    }
  };

  const renderStatusBadge = (idStatus: string, nomeStatus: string) => {
    switch (idStatus) {
      case '0': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">{nomeStatus}</span>;
      case '1': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{nomeStatus}</span>;
      case '2': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">{nomeStatus}</span>;
      case '3': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">{nomeStatus}</span>;
      default: return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{nomeStatus}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="font-medium text-gray-900">A carregar detalhes do chamado...</p>
      </div>
    );
  }

  if (!chamado) {
    return (
      <div className="px-6 py-16 text-center flex flex-col items-center justify-center bg-white rounded-xl shadow-sm max-w-2xl mx-auto mt-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
          <Ticket className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chamado não encontrado</h2>
        <p className="mt-2 text-sm text-gray-500 mb-6">Não foi possível localizar as informações para este ID.</p>
        <button 
          onClick={() => navigate('/chamados')} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} /> Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/chamados')} 
            className="p-2.5 text-gray-500 bg-white border border-gray-200 shadow-sm hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                #{chamado.idChamado}
              </h1>
              {renderStatusBadge(chamado.idStatus, chamado.nomeStatus)}
            </div>
            <p className="text-gray-500 text-sm sm:text-base font-medium flex items-center gap-2">
              <Ticket size={16} className="text-gray-400" />
              {chamado.nomeAssunto}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Descrição do Pedido</h2>
            </div>
            <div className="p-6">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {chamado.problema || <span className="text-gray-400 italic">Nenhuma descrição detalhada informada.</span>}
              </div>
            </div>
          </div>

          <div className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Histórico de Interações</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-gray-100 before:via-gray-200 before:to-gray-100">
                {chamado.interacoes?.length > 0 ? chamado.interacoes.map((interacao: any) => (
                  <div key={interacao.id} className="relative flex items-start gap-4 md:gap-6">
                    <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shrink-0 z-10 shadow-sm
                      ${interacao.tipo === 'status' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                      {interacao.tipo === 'comentario' ? <MessageSquare size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div className="flex-1 min-w-0 bg-white ring-1 ring-gray-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                        <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                          <User size={14} className="text-gray-400"/> {interacao.autor}
                        </span>
                        <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md w-fit">
                          {interacao.data}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${interacao.tipo === 'status' ? 'text-gray-500 italic' : 'text-gray-700 whitespace-pre-wrap'}`}>
                        {interacao.texto}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500 text-sm">Nenhuma interação registada até ao momento.</div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Adicionar uma atualização ou anexo</label>
              
              {arquivoSelecionado && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-800 flex items-center gap-2">
                      <Paperclip size={16} /> {arquivoSelecionado.name}
                    </span>
                    <button onClick={() => setArquivoSelecionado(null)} disabled={enviandoAnexo} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={descricaoAnexo} 
                    onChange={(e) => setDescricaoAnexo(e.target.value)} 
                    placeholder="Escreva uma descrição para este ficheiro..." 
                    disabled={enviandoAnexo} 
                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                  />
                  <button 
                    onClick={handleEnviarAnexo} 
                    disabled={enviandoAnexo} 
                    className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
                  >
                    {enviandoAnexo ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> A enviar anexo...</> : 'Confirmar Envio de Anexo'}
                  </button>
                </div>
              )}

              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setArquivoSelecionado(e.target.files?.[0] || null)} />

              <form onSubmit={handleEnviarMensagem} className="relative">
                <div className="overflow-hidden rounded-xl border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                  <textarea
                    rows={3}
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    placeholder="Escreva a sua mensagem ou atualização aqui..."
                    className="block w-full resize-y border-0 py-3 px-4 border-b-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none outline-none sm:text-sm sm:leading-6 min-h-25"
                    disabled={enviando || enviandoAnexo}
                  />
                  
                  <div className="flex items-center justify-between py-2.5 px-3 bg-white border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={enviando || enviandoAnexo} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Anexar ficheiro"
                    >
                      <Paperclip size={18} /> <span className="hidden sm:inline">Anexar</span>
                    </button>
                    
                    <button 
                      type="submit" 
                      disabled={enviando || enviandoAnexo || !!arquivoSelecionado || !novaMensagem.trim()} 
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {enviando ? 'A enviar...' : 'Enviar Mensagem'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          <div className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-slate-600" />
              Gestão do Pedido
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estado Atual</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!podeGerir} 
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900 shadow-sm disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="0">Aguardando usuário</option>
                  <option value="1">Aberto</option>
                  <option value="2">Em atendimento</option>
                  <option value="3">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prioridade</label>
                <select 
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  disabled={!podeGerir} 
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900 shadow-sm disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENTE">Urgente</option>
                  <option value="IMEDIATO">Imediato</option>
                </select>
              </div>

              {/* NOVO CAMPO: Transferir para o Setor */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transferir para o Setor</label>
                <select 
                  value={setorDestino}
                  onChange={(e) => setSetorDestino(e.target.value)}
                  disabled={!podeGerir} 
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900 shadow-sm disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="" disabled>Selecione um setor...</option>
                  {Object.entries(SETORES_MAP).map(([id, nome]) => (
                    <option key={id} value={id}>{nome}</option>
                  ))}
                </select>
              </div>

              {podeGerir ? (
                <button 
                  onClick={handleSalvarAlteracoes}
                  disabled={salvando}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70"
                >
                  <Save size={18} /> {salvando ? 'A guardar...' : 'Guardar Alterações'}
                </button>
              ) : (
                <div className="mt-4 flex items-start gap-2.5 text-xs text-amber-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200/60 leading-relaxed">
                  <Lock size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <p>Apenas analistas do <strong>setor de destino</strong> podem alterar o estado, a prioridade ou transferir este chamado.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3 flex items-center gap-2">
              <User size={18} className="text-slate-600" />
              Detalhes do Solicitante
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5"><User size={14}/> Nome do Utilizador</span>
                <span className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{chamado.contato}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5"><Building size={14}/> Setor de Origem</span>
                <span className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{chamado.nomeSetorOrigem}</span>
              </li>
              <li className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5"><Clock size={14}/> Data de Abertura</span>
                <span className="font-medium text-gray-800">{chamado.dataAbertura}</span>
              </li>
            </ul>
          </div>
          
          {chamado?.nomeAtendente && (
            <div className="bg-linear-to-b from-blue-50 to-white ring-1 ring-blue-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-blue-100 pb-3 flex items-center gap-2">
                <Headset size={18} className="text-blue-600" /> 
                Atendimento
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex flex-col gap-1">
                  <span className="text-xs text-blue-500/80 uppercase font-bold flex items-center gap-1.5">
                    <User size={14}/> Analista Responsável
                  </span>
                  <span className="font-semibold text-blue-900">{chamado.nomeAtendente}</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
