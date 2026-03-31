// src/services/socket.ts
import { io } from 'socket.io-client';

// Criamos a conexão apontando para o seu backend.
// autoConnect: false serve para que o Socket só conecte DEPOIS que tivermos certeza de quem é o usuário.
export const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  autoConnect: false,
});