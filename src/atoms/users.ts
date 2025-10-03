import type { IUser } from '@/interfaces/User';
import { atom } from 'jotai';

export const usersAtom = atom<IUser[]>([]);
