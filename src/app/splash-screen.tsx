
'use client';

import { useState, useEffect } from 'react';
import './splash-animation.css';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Should match the animation duration

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="splash-screen">
        <div className="logo-container">
            <h1 className="logo-text">elysium</h1>
        </div>
    </div>
  );
}
