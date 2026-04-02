import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Headset, User, Lock, LogIn, Loader2 } from 'lucide-react'; 

export function Login() {
  const { carregarPerfilUsuario } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/sankhya/login', {
        usuario: username,
        senha: password
      });

      const token = response.data.token; 

      if (token) {
        localStorage.setItem('@SankhyaTickets:token', token);
        localStorage.setItem('@SankhyaTickets:usuario', username.toUpperCase());
        await carregarPerfilUsuario(username.toUpperCase());
        toast.success('Login realizado com sucesso!');
        navigate('/chamados');
      }

    } catch (error: any) {
      const mensagemErro = error.response?.data?.erro || 'Erro ao conectar no servidor.';
      toast.error(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans px-4 sm:px-6 lg:px-8">
      
      {/* Elementos Decorativos de Fundo (Blur/Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Cartão de Login */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-slate-900/5 p-8 sm:p-10 relative z-10 transition-all">
        
        {/* Cabeçalho do Cartão (Logo) */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/20 mb-4">
            <Headset className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Ticket<span className="text-blue-600">Go</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 text-center">
            Insira as suas credenciais para aceder ao portal.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Usuário
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: joao.silva"
                required
                disabled={loading}
                className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all disabled:opacity-50 disabled:bg-slate-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Palavra-passe
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all disabled:opacity-50 disabled:bg-slate-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                A validar credenciais...
              </>
            ) : (
              <>
                Entrar no Sistema
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>
        
        {/* Rodapé do Cartão */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Acesso restrito a colaboradores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}