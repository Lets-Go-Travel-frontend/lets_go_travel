"use client";

import { Suspense } from 'react';
import VerificationForm from '@/app/components/Auth/VerificationForm';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <p>Cargando...</p>
        </div>
      }>
        <VerificationForm />
      </Suspense>
    </div>
  );
}