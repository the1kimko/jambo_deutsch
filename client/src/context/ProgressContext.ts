// src/context/ProgressContext.ts
import { createContext } from 'react';
import type { ProgressContextType } from '@/types/progress';

export const ProgressContext = createContext<ProgressContextType | null>(null);