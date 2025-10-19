import type { ICommerce } from '@/interfaces/Commerce';
import { atom } from 'jotai';

export const commerceAtom = atom<ICommerce | null>(null);