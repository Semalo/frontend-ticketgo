import { z } from 'zod';

export const chamadoResumoSchema = z.object({
  idChamado: z.coerce.number(),
  contato: z.coerce.string(),
  dataAbertura: z.coerce.string(),
  prioridade: z.coerce.string(),
  problema: z.coerce.string(),
  nomeAssunto: z.coerce.string(),
  nomeStatus: z.coerce.string(),
  idStatus: z.coerce.string(),
  codUsuInc: z.coerce.string(),
  idSetorDestino: z.coerce.string(),
  setorOrigem: z.coerce.string(),
});

export const chamadoInteracaoSchema = z.object({
  id: z.union([z.string(), z.number()]),
  tipo: z.coerce.string(),
  autor: z.coerce.string(),
  data: z.coerce.string(),
  texto: z.coerce.string(),
});

export const chamadoDetalheSchema = z.object({
  ...chamadoResumoSchema.shape,
  nomeSetorOrigem: z.coerce.string().optional(),
  nomeAtendente: z.coerce.string().optional(),
  interacoes: z.array(chamadoInteracaoSchema).optional(),
});

export const chamadosListResponseSchema = z.object({
  sucesso: z.boolean(),
  dados: z.array(chamadoResumoSchema).optional(),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});

export const chamadoDetalheResponseSchema = z.object({
  sucesso: z.boolean(),
  dados: chamadoDetalheSchema.optional(),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});

export const chamadoMutationResponseSchema = z.object({
  sucesso: z.boolean(),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});

export type ChamadoResumo = z.infer<typeof chamadoResumoSchema>;
export type ChamadoInteracao = z.infer<typeof chamadoInteracaoSchema>;
export type ChamadoDetalhe = z.infer<typeof chamadoDetalheSchema>;
