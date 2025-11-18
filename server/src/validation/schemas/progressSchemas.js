import { z } from 'zod';
import { MODULES } from '../../utils/constants.js';

export const progressUpdateSchema = z.object({
  moduleId: z
    .string()
    .min(1, 'Module ID is required')
    .refine((value) => MODULES.includes(value), 'Unknown module ID'),
  percentage: z.number().min(0).max(100),
});

export const progressStreakSchema = z.object({
  streak: z.number().int().min(0).optional(),
});
