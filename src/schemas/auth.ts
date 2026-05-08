import { z } from 'zod';

export const loginResponseSchema = z.object({
  sucesso: z.boolean().optional(),
  token: z.coerce.string().min(1),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});

export const refreshTokenResponseSchema = z.object({
  sucesso: z.boolean(),
  token: z.coerce.string().optional(),
  erro: z.string().optional(),
  mensagem: z.string().optional(),
});
