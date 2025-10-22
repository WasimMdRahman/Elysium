
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Loader } from 'lucide-react';

interface DashboardCardProps {
  href: string;
  emoji: string;
  title: string;
  description: string;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function DashboardCard({ href, emoji, title, description, isLoading, onClick }: DashboardCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick(e);
  };
  
  return (
    <Link href={href} className="group" onClick={handleClick}>
      <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
                {emoji}
            </div>
            <div>
              <CardTitle className="font-headline">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {isLoading ? (
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
