import type { IUser } from '@/interfaces/User';
import { atom } from 'jotai';

// Info del usuario
export const userAtom = atom<IUser | null>(null);
