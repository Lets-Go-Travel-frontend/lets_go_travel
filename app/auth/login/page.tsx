import { Metadata } from 'next';
import LoginPageForm from '@/components/Auth/LoginPageForm';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Let\'s Go Vacation',
  description: 'Inicia sesión en tu cuenta de Let\'s Go Vacation',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Contenido principal */}
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <LoginPageForm />
        </div>
      </main>
    </div>
  );
}