import { BrainCircuit } from 'lucide-react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" >
      <BrainCircuit {...props} className={cn("text-primary", props.className)} />
    </div>
  );
}
