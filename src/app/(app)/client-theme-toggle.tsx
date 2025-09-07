
'use client';

import dynamic from "next/dynamic";

export const ClientThemeToggle = dynamic(() => import('@/components/theme-toggle').then(m => m.ThemeToggle), { ssr: false });
