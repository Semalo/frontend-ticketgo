import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  Building,  
  Save,
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import api from '../services/api'; // Importamos a nossa conexão com o backend



export function DetalhesChamado() {
  
  const { id } = useParams(); // Pega o ID na URL
  const navigate = useNavigate();

  // Estados dos dados que vêm da API
  const [chamado, setChamado] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados geríveis no ecrã (Selects e Inputs)
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');

  // 1. Busca os dados reais no banco de dados assim que a tela abre
  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const response = await api.get(`/api/sankhya/chamados/${id}`);
        if (response.data.sucesso) {
          const dados = response.data.dados;
          setChamado(dados);
          
          // Sincroniza os selects com os dados reais do banco
          setStatus(dados.idStatus); // Usamos o ID do status (0, 1, 2, 3)
          setPrioridade(dados.prioridade);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do chamado:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) buscarDetalhes();
  }, [id]);

  const handleSalvarAlteracoes = () => {
    // Aqui entrará o PUT/POST para a API do Sankhya
    console.log('A atualizar chamado:', { id, status, prioridade });
    alert('Alterações prontas para serem guardadas (Falta ligar rota PUT)!');
  };

  const handleEnviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    
    console.log('Nova mensagem adicionada:', novaMensagem);
    setNovaMensagem('');
    alert('Comentário pronto para ser enviado (Falta ligar rota POST)!');
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
        
        {/* Coluna Principal (Esquerda): Descrição e Chat/Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cartão de Descrição Original */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              Descrição do Pedido
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {chamado.problema || 'Nenhuma descrição detalhada informada.'}
            </div>
          </div>

          {/* Cartão de Timeline (Interações) */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 flex items-center gap-2">
    <Clock size={18} className="text-blue-600" />
    Histórico de Interações
  </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {/* AQUI ESTÁ A MUDANÇA: Usamos chamado.interacoes */}
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

            {/* Nova Mensagem */}
            <form onSubmit={handleEnviarMensagem} className="mt-8 border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar um comentário</label>
              <div className="relative">
                <textarea 
                  rows={3}
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Escreva a sua mensagem ou atualização..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                ></textarea>
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Anexar ficheiro">
                    <Paperclip size={18} />
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                    Enviar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Coluna Lateral (Direita): Gestão do Chamado */}
        <div className="space-y-6">
          
          {/* Ações Rápidas (Alterar Status/Prioridade) */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Gestão do Pedido</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                {/* O value agora lê o ID do dicionário do Node.js */}
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
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta / Urgente</option>
                </select>
              </div>

              <button 
                onClick={handleSalvarAlteracoes}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                <Save size={18} /> Guardar Alterações
              </button>
            </div>
          </div>

          {/* Cartão de Informações do Solicitante */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Detalhes do Solicitante</h3>
            
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1"><User size={14}/> Nome</span>
                {/* Idealmente a query traria o nome do usuário pelo CODUSUINC, aqui mostramos o contato/solicitante */}
                <span className="font-medium text-gray-800">{chamado.contato}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1"><Building size={14}/> Setor Origem</span>
                <span className="font-medium text-gray-800">{chamado.idSetorOrigem || 'Não informado'}</span>
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