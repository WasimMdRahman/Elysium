
'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/logo';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000); // Same duration as the animation

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="logo-container">
      <Logo className="h-32 w-32" />
    </div>
  );
}
