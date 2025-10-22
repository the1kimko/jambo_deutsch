import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(25, 'Password must be under 25 characters');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .regex(/^\s*\S+\s+\S+/, 'Please enter both first and last name')
  .transform((val) => val.trim());

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    goal: z.enum(['General', 'Visa Prep', 'Exam Prep']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;