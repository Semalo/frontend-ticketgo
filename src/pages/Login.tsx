import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api'; // Ajuste para o URL do seu backend
export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(''); // Novo estado para tratar os erros
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(''); // Limpa os erros anteriores antes de tentar novamente
    
    try {
      // Chamada real para a nossa API Node.js
      const response = await axios.post(`${API_BASE_URL}/login`, {
        usuario,
        senha
      });
      
      // CORREÇÃO AQUI: Mudamos de .token para .access_token
      if (response.data && response.data.access_token) {
        // Salvamos o access_token no localStorage
        localStorage.setItem('@Logistica:token', response.data.access_token);
        localStorage.setItem('@Logistica:usuario', usuario); // Opcional: salva o nome do usuário para exibir no dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      // Pega a mensagem de erro que vem do backend
      const mensagemErro = error.response?.data?.erro || "Erro ao conectar com o servidor.";
  
      
      // Adicionado: Seta o estado de erro para aparecer aquela caixinha vermelha no seu layout
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container principal: Ocupa a tela toda, centraliza o conteúdo e tem um fundo cinza claro
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      {/* Card de Login: Responsivo (w-full max-w-md), com sombra e bordas arredondadas */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        
        {/* Cabeçalho do Form */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal de Chamados</h1>
          <p className="text-gray-500">Acesse com suas credenciais do Sankhya</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Campo: Usuário */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Campo: Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Botão de Submit */}
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md focus:ring-4 focus:ring-blue-500/50"
          >
            Entrar no Sistema
          </button>

        </form>
        
        {/* Rodapé opcional para suporte */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Problemas com o acesso? <a href="#" className="text-blue-600 hover:underline">Contate a TI</a>
        </div>

      </div>
    </div>
  );
}