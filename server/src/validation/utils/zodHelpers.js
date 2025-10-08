import {z} from 'zod';

export const nameValidator = z
  .string()
  .min(2, 'Name must be at least 2 charaters')
  .regex(/^\s*\S+\s+\S+/, 'Please enter both first and last name')
  .transform((val) => val.trim());

export const passwordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(25, 'Passowrd must be under 25 characters');
