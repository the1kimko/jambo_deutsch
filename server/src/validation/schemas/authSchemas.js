import {z} from 'zod';
import {nameValidator, passwordValidator} from "../utils/zodHelpers.js";

export const registerSchema = z
  .object({
    name: nameValidator,
    email: z.email('Invalid email address'),
    password: passwordValidator,
    confirmPassword: z.string(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
