import { z } from 'zod';

export const createLeagueSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre es demasiado largo'),
  initial_balance: z.number().min(0, 'El balance inicial debe ser mayor o igual a 0'),
  max_recharges: z.number().min(1, 'El número de recargas debe ser al menos 1'),
  hide_standings: z.boolean(),
});

export type CreateLeagueInput = z.infer<typeof createLeagueSchema>;

export const joinLeagueSchema = z.object({
  invite_code: z.string().length(8, 'El código debe tener exactamente 8 caracteres').toUpperCase(),
});

export type JoinLeagueInput = z.infer<typeof joinLeagueSchema>;

export const updateLeagueSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre es demasiado largo'),
  initial_balance: z.number().min(0, 'El balance inicial debe ser mayor o igual a 0'),
  max_recharges: z.number().min(1, 'El número de recargas debe ser al menos 1'),
  hide_standings: z.boolean(),
});

export type UpdateLeagueInput = z.infer<typeof updateLeagueSchema>;
