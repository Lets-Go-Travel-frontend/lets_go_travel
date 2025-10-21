"use client";

import { useState } from 'react';
import { registerUser } from '@/lib/api/auth';

export default function TestAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Usar los mismos datos exactos que funcionaron en Postman
      const testData = {
        email: "test2@example.com", // Cambiar email para evitar conflicto
        password: "Test123!@#",
        firstName: "Test",
        lastName: "User",
        phone: "+1234567890"
      };
      
      console.log('🚀 Iniciando prueba de registro...');
      console.log('📝 Datos enviados:', testData);
      
      const response = await registerUser(testData);
      setResult(response);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

  const testRawFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Probar fetch directo al proxy
      const testData = {
        email: "test3@example.com",
        password: "Test123!@#", 
        first_name: "Test",
        last_name: "User"
      };

      console.log('🔍 Probando fetch directo al proxy...');
      
      const response = await fetch('/api/proxy/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('📡 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📡 Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Fetch directo error: ${errorMessage}`);
      console.error('❌ Error en fetch directo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Prueba de Conexión API</h1>
      
      <div className="space-y-2">
        <button
          onClick={testRegister}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Probando...' : 'Probar con servicio'}
        </button>
        
        <button
          onClick={testRawFetch}
          disabled={loading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Probando...' : 'Probar fetch directo al proxy'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Resultado:</strong>
          <pre className="mt-2 text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}