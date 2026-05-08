import { z } from 'zod';

export const relatorioItemSchema = z.object({
  id: z.coerce.string(),
  dataAbertura: z.coerce.string(),
  dataAlteracao: z.coerce.string(),
  setor: z.coerce.string(),
  assunto: z.coerce.string(),
  status: z.coerce.string(),
  problema: z.coerce.string(),
  tempoResolucao: z.coerce.string(),
});

export const relatorioListResponseSchema = z.object({
  sucesso: z.boolean(),
  dados: z.array(relatorioItemSchema).optional(),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});

export type RelatorioItem = z.infer<typeof relatorioItemSchema>;
