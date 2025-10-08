import type { IService } from '@/interfaces/Service';
import { atom } from 'jotai';

export const serviceAtom = atom<IService[]>([]);
