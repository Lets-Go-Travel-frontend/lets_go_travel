"use client";

import { useRouter } from 'next/navigation';

export default function HeaderLogo() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div 
      className="cursor-pointer inline-block"
      onClick={handleLogoClick}
    >
      <img 
        src="/images/logo.png" 
        alt="Let's Go Vacation" 
        width={200} 
        height={80}
        className="hover:opacity-90 transition-opacity"
      />
    </div>
  );
}