import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(props.className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#3b82f6' }} /> 
          <stop offset="100%" style={{ stopColor: '#f59e0b' }} />
        </linearGradient>
      </defs>
      <path
        stroke="url(#logo-gradient)"
        d="M9.872 7.426c.31-.64.84-1.17 1.48-1.58.96-.615 2.16-.8 3.32-.515 2.32.57 3.96 2.89 3.39 5.21-.57 2.32-2.89 3.96-5.21 3.39-1.35-.33-2.48-1.15-3.15-2.24m.1-8.24a8.1 8.1 0 00-4.014 3.394c-1.57 2.686-.33 6.134 2.356 7.704 2.686 1.57 6.134.33 7.704-2.356a8.1 8.1 0 00-1.24-9.06m-5.462.637C7.628 9.073 6.3 11.027 6.3 13.5c0 1.63.54 3.1 1.45 4.26m-1.3-6.49s-.2 1 .3 2.1c.5 1.1 1.4 1.8 1.4 1.8M8.853 17.5s.52.8 1.5.8"
      />
      <path
        stroke="url(#logo-gradient)"
        d="M11.642 16.428c.343.896.2 1.933-.39 2.764-.59.83-1.61 1.25-2.65 1.1s-2.02-.75-2.5-1.74c-.48-.99-.3-2.1.25-2.92.55-.82 1.5-1.25 2.5-1.1s1.9.72 2.3 1.6.48 1.33.48 1.33z"
      />
    </svg>
  );
}
