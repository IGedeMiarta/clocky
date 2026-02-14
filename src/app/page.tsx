"use client";

import { useEffect, useState } from 'react';
import FlipClock from '@/components/FlipClock';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '100vh', width: '100vw', background: '#111' }}></div>;
  }

  return <FlipClock />;
}
