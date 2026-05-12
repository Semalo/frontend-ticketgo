// src/hooks/useSocketNotifications.ts
import { useEffect } from 'react';
import { socket } from '../services/socket';
import toast from 'react-hot-toast';
import type { User } from '../contexts/AuthContext';

interface ChamadoNovoPayload {
  idChamado: number;
  nomeAssunto: string;
  contato?: string;
}

interface ChamadoRespondidoPayload {
  idChamado: number;
  nomeAssunto?: string;
}

interface ChamadoStatusAlteradoPayload {
  idChamado: number;
  novoStatus: string;
}

// Hook que registra os listeners de socket e exibe toasts de notificação.
// Deve ser usado uma única vez no componente autenticado de nível superior (Layout).
export function useSocketNotifications(user: User | null) {
  useEffect(() => {
    if (!user) return;

    const handleNovoChamado = (data: ChamadoNovoPayload) => {
      toast(`Novo chamado #${data.idChamado}: ${data.nomeAssunto}`, {
        icon: '🔔',
        duration: 6000,
      });
    };

    const handleChamadoRespondido = (data: ChamadoRespondidoPayload) => {
      toast(`Chamado #${data.idChamado} recebeu uma nova resposta`, {
        icon: '💬',
        duration: 5000,
      });
    };

    const handleStatusAlterado = (data: ChamadoStatusAlteradoPayload) => {
      toast(`Status do chamado #${data.idChamado} alterado para: ${data.novoStatus}`, {
        icon: '🔄',
        duration: 5000,
      });
    };

    socket.on('chamado:novo', handleNovoChamado);
    socket.on('chamado:respondido', handleChamadoRespondido);
    socket.on('chamado:status_alterado', handleStatusAlterado);

    return () => {
      socket.off('chamado:novo', handleNovoChamado);
      socket.off('chamado:respondido', handleChamadoRespondido);
      socket.off('chamado:status_alterado', handleStatusAlterado);
    };
  }, [user]);
}
