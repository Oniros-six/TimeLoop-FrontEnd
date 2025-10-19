import type { IUser } from '@/interfaces/User';
import { atom } from 'jotai';

// Atom para cachear la lista de usuarios del comercio
export const usersAtom = atom<IUser[]>([]);