import { z } from 'zod';

export const usuarioSchema = z.object({
  nomeUsuario: z.coerce.string(),
  codigoUsuario: z.coerce.string(),
  codigoGrupo: z.coerce.string(),
  codigoParceiro: z.coerce.string(),
  email: z.coerce.string(),
  setorId: z.coerce.string(),
  setorNome: z.coerce.string(),
  nomeParceiro: z.coerce.string(),
});

export const usuarioResponseSchema = z.object({
  sucesso: z.boolean(),
  dados: usuarioSchema.optional(),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});

export type User = z.infer<typeof usuarioSchema>;
