import { Metadata } from 'next';
import RegisterPageForm from '@/components/Auth/RegisterPageForm';

export const metadata: Metadata = {
  title: 'Registro - Let\'s Go Vacation',
  description: 'Crea tu cuenta en Let\'s Go Vacation',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Contenido principal */}
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <RegisterPageForm />
        </div>
      </main>
    </div>
  );
}