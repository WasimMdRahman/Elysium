
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Loader } from 'lucide-react';

interface DashboardCardProps {
  href: string;
  imageUrl: string;
  imageHint: string;
  title: string;
  description: string;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function DashboardCard({ href, imageUrl, imageHint, title, description, isLoading, onClick }: DashboardCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick(e);
  };
  
  return (
    <Link href={href} className="group" onClick={handleClick}>
      <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <div className="relative mb-2 h-10 w-10 overflow-hidden rounded-lg">
                <Image 
                    src={imageUrl} 
                    alt={`${title} icon`} 
                    fill
                    sizes="40px"
                    className="object-cover"
                    data-ai-hint={imageHint}
                />
            </div>
            <CardTitle className="font-headline">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {isLoading ? (
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5 text-green-800 transition-transform duration-200 group-hover:translate-x-1 dark:text-muted-foreground" />
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
