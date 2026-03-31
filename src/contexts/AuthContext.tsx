// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// --- NOVAS IMPORTAÇÕES PARA O SOCKET.IO E TOAST ---
import { socket } from '../services/socket';
import toast from 'react-hot-toast';

// 1. Definimos o "formato" dos dados do usuário (TypeScript)
export interface User {
  nomeUsuario: string;
  codigoUsuario: string;
  codigoGrupo: string;
  codigoParceiro: string;
  email: string;
  setorId: string;
  setorNome: string;
  nomeParceiro: string; // Adicionamos o nome do parceiro para exibir no perfil
}

// 2. Definimos o que a nossa "Caixa d'água" vai guardar e disponibilizar
interface AuthContextData {
  user: User | null; // Os dados do usuário (ou null se não estiver logado)
  carregarPerfilUsuario: (username: string) => Promise<void>; // Função para buscar os dados
  limparUsuario: () => void; // Função para limpar ao sair (logout)
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const carregarPerfilUsuario = async (username: string) => {
    try {
      const response = await api.get(`/api/sankhya/usuario/${username}`);
      if (response.data.sucesso) {
        setUser(response.data.dados); 
      }
    } catch (error) {
      console.error('Erro ao buscar perfil global do usuário:', error);
    }
  };

  const limparUsuario = () => {
    setUser(null);
    localStorage.removeItem('@SankhyaTickets:token');
    localStorage.removeItem('@SankhyaTickets:usuario');
    
    // --- DESCONECTA DO SOCKET AO SAIR ---
    socket.disconnect();
  };

  // NOVA FUNÇÃO: Faz o pedido silencioso do novo token
  const renovarTokenSilenciosamente = async () => {
    try {
      const tokenAtual = localStorage.getItem('@SankhyaTickets:token');
      // Se não tem token salvo, significa que o usuário não está logado, então não fazemos nada.
      if (!tokenAtual) return;

      const response = await api.post('/api/sankhya/refresh');
      
      if (response.data.sucesso && response.data.token) {
        // Substitui magicamente o token antigo pelo novo no navegador!
        localStorage.setItem('@SankhyaTickets:token', response.data.token);
        console.log('🔄 Token renovado com sucesso em background!');
      }
    } catch (error) {
      console.error('Falha ao tentar renovar o token:', error);
      // Se a API da Sankhya cair, você pode optar por forçar o logout chamando limparUsuario() aqui
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem('@SankhyaTickets:usuario');
    const token = localStorage.getItem('@SankhyaTickets:token');
    
    if (savedUsername && token) {
      carregarPerfilUsuario(savedUsername);
    }

    // CRONÔMETRO DE REFRESH: 4 minutos = 240.000 milissegundos
    const TEMPO_REFRESH = 240000; 

    const intervaloDeRefresh = setInterval(() => {
      // A cada 4 minutos, verifica se o cara está logado e renova o token
      if (localStorage.getItem('@SankhyaTickets:token')) {
        renovarTokenSilenciosamente();
      }
    }, TEMPO_REFRESH);

    // Função de limpeza: destrói o cronômetro caso o AuthProvider saia da tela
    return () => clearInterval(intervaloDeRefresh);
  }, []);

  // =================================================================
  // LÓGICA DO SOCKET.IO (Tempo Real)
  // =================================================================
  useEffect(() => {
    // Só conectamos se o usuário estiver logado e tivermos os dados dele
    if (user && user.codigoUsuario && user.setorId) {
      
      // 1. Conecta ao servidor
      socket.connect();

      // 2. Avisa ao servidor quem somos para entrarmos nas salas corretas
      socket.emit('entrar_sistema', {
        codigoUsuario: Number(user.codigoUsuario),
        setorId: Number(user.setorId)
      });

      // 3. Fica "escutando" ativamente o evento 'nova_notificacao'
      socket.on('nova_notificacao', (dados) => {
        // Quando chegar, disparamos um Toast customizado na tela do usuário
        toast(
          (t) => (
            <div className="flex flex-col gap-1 cursor-pointer" onClick={() => toast.dismiss(t.id)}>
              <span className="font-bold text-blue-900 flex items-center gap-2">
                🔔 {dados.titulo}
              </span>
              <span className="text-sm text-gray-700">{dados.mensagem}</span>
              <span className="text-xs text-gray-400 mt-1 font-medium">{dados.data}</span>
            </div>
          ),
          {
            duration: 8000, // Fica 8 segundos na tela
            position: 'top-right',
            style: { 
              border: '1px solid #BFDBFE', 
              background: '#EFF6FF',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }
          }
        );
      });

      // 4. Função de limpeza: se o componente for desmontado, paramos de ouvir
      return () => {
        socket.off('nova_notificacao');
        socket.disconnect();
      };
    }
  }, [user]); // Esse useEffect roda sempre que a variável 'user' mudar

  return (
    <AuthContext.Provider value={{ user, carregarPerfilUsuario, limparUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Criamos um Hook personalizado para facilitar o uso nos outros arquivos
export const useAuth = () => useContext(AuthContext);