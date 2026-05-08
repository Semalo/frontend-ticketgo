import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { refreshTokenResponseSchema } from '../schemas/auth';
import { usuarioResponseSchema } from '../schemas/usuario';
import type { User } from '../types';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const carregarPerfilUsuario = async (username: string) => {
    try {
      const response = await api.get(`/api/sankhya/usuario/${username}`);
      const parsed = usuarioResponseSchema.safeParse(response.data);

      if (!parsed.success) {
        console.error('Resposta inválida ao buscar perfil do usuário:', parsed.error);
        return;
      }

      if (parsed.data.sucesso && parsed.data.dados) {
        setUser(parsed.data.dados);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil global do usuário:', error);
    }
  };

  const limparUsuario = () => {
    setUser(null);
    localStorage.removeItem('@SankhyaTickets:token');
    localStorage.removeItem('@SankhyaTickets:usuario');
  };

  const renovarTokenSilenciosamente = async () => {
    try {
      const tokenAtual = localStorage.getItem('@SankhyaTickets:token');
      if (!tokenAtual) return;

      const response = await api.post('/api/sankhya/refresh');
      const parsed = refreshTokenResponseSchema.safeParse(response.data);

      if (!parsed.success) {
        console.error('Resposta inválida ao renovar token:', parsed.error);
        return;
      }

      if (parsed.data.sucesso && parsed.data.token) {
        localStorage.setItem('@SankhyaTickets:token', parsed.data.token);
        console.log('🔄 Token renovado com sucesso em background!');
      }
    } catch (error) {
      console.error('Falha ao tentar renovar o token:', error);
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem('@SankhyaTickets:usuario');
    const token = localStorage.getItem('@SankhyaTickets:token');

    if (savedUsername && token) {
      setTimeout(() => {
        void carregarPerfilUsuario(savedUsername);
      }, 0);
    }

    const TEMPO_REFRESH = 240000;

    const intervaloDeRefresh = setInterval(() => {
      if (localStorage.getItem('@SankhyaTickets:token')) {
        void renovarTokenSilenciosamente();
      }
    }, TEMPO_REFRESH);

    return () => clearInterval(intervaloDeRefresh);
  }, []);

  return <AuthContext.Provider value={{ user, carregarPerfilUsuario, limparUsuario }}>{children}</AuthContext.Provider>;
}
