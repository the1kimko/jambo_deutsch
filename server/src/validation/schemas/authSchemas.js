import {z} from 'zod';
import {nameValidator, passwordValidator} from "../utils/zodHelpers.js";

// Client-side schema (keep as-is for client, but we'll migrate away from custom auth soon)
export const clientRegisterSchema = z
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

// Server-side schema (no confirmPassword, add goal if needed)
export const registerSchema = z.object({
  name: nameValidator,
  email: z.email('Invalid email address'),
  password: passwordValidator,
  goal: z.enum(['General', 'Visa Prep', 'Exam Prep', 'Other']).optional(), // Add if you want to persist goal
  role: z.enum(['user', 'admin']).optional(),
});

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
