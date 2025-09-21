import type { DashboardData } from '@/interfaces/DashboardData';
import { atom } from 'jotai';

// Info del dashboard
export const dashboardAtom = atom<DashboardData>();
