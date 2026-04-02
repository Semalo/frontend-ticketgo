// src/services/api.ts
import axios from 'axios';

// 1. Criamos a nossa base de conexão apontando para o servidor Node.js
export const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
});

// ==========================================\
// INTERCEPTADOR DE REQUISIÇÕES (IDA)
// ==========================================\
api.interceptors.request.use(
  (config) => {
    // Procura o token no navegador
    const token = localStorage.getItem('@SankhyaTickets:token');

    // Se encontrar, adiciona no cabeçalho
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================\
// INTERCEPTADOR DE RESPOSTAS (VOLTA)
// ==========================================\
api.interceptors.response.use(
  (response) => {
    // Se deu tudo certo com a requisição, simplesmente devolve os dados
    return response;
  },
  (error) => {
    // Se o backend retornou um erro, verificamos se existe uma resposta estruturada
    if (error.response) {
      const status = error.response.status;

      // Se o código for 500 (Erro no Servidor) ou 400 (Requisição Inválida) ou 401 (Sessão Expirada/Não Autorizado)
      if (status === 500 || status === 400 || status === 401 || status === 403 || status === 504) {
        console.warn(`Erro ${status} detetado. A redirecionar para o login...`);
        
        // 1. Limpamos o armazenamento local para remover o token inválido/antigo
        localStorage.removeItem('@SankhyaTickets:token');
        localStorage.removeItem('@SankhyaTickets:usuario');
        
        // 2. Forçamos o redirecionamento para a página raiz (Login)
        // Usamos window.location.href em vez de useNavigate porque estamos fora de um componente React
        window.location.href = '/'; 
      }
    }

    // Repassamos o erro para a frente, para que o componente (ex: NovoChamado) 
    // também possa dar um console.log ou parar um 'loading' se precisar.
    return Promise.reject(error);
  }
);

export default api;