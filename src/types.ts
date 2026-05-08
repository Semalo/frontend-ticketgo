import type { ChamadoDetalhe, ChamadoInteracao, ChamadoResumo } from './schemas/chamado';
import type { RelatorioItem } from './schemas/relatorio';
import type { User } from './schemas/usuario';

export type { ChamadoDetalhe, ChamadoInteracao, ChamadoResumo, RelatorioItem, User };

export interface AuthContextData {
  user: User | null;
  carregarPerfilUsuario: (username: string) => Promise<void>;
  limparUsuario: () => void;
}

export interface AtualizacaoChamadoPayload {
  codAnalista: string;
  idStatus: string;
  prioridade: string;
  idSetorDestino?: string;
}
