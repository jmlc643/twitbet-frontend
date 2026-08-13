import { z } from 'zod';

export const createLeagueSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre es demasiado largo'),
  initial_balance: z.number().min(0, 'El balance inicial debe ser mayor o igual a 0'),
  max_recharges: z.number().min(1, 'El número de recargas debe ser al menos 1'),
  hide_standings: z.boolean(),
  min_bets_to_qualify: z.number().min(0).optional(),
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
  min_bets_to_qualify: z.number().min(0).optional(),
});

export type UpdateLeagueInput = z.infer<typeof updateLeagueSchema>;

export const createMatchSchema = z.object({
  title: z.string().min(1, 'El título del partido es obligatorio').max(100, 'El título es demasiado largo'),
  start_time: z.string().min(1, 'La fecha de inicio es obligatoria'),
});

export type CreateMatchInput = z.infer<typeof createMatchSchema>;

export const marketTypeSchema = z.enum(['RESULT', 'TOTALS', 'HANDICAP', 'CORRECT_SCORE', 'OTHER']).optional();

export const createMarketSchema = z.object({
  name: z.string().min(1, 'El nombre del mercado es obligatorio'),
  type: marketTypeSchema,
  options: z.array(
    z.object({
      name: z.string().min(1, 'El nombre de la opción es obligatorio'),
      odds: z.number().min(1.01, 'Las cuotas deben ser mayores a 1'),
    })
  ).min(2, 'Debe haber al menos 2 opciones en el mercado'),
});

export type CreateMarketInput = z.infer<typeof createMarketSchema>;
