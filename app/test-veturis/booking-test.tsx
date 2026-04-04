"use client";

import { IBookingResponse, ICancelResponse } from "../types/standard";

interface BookingTestProps {
    result: IBookingResponse | null;
    cancelResult?: ICancelResponse | null;
    onCancel: () => Promise<void>;
}

/**
 * [FE-005]: Validador de Flujo Transaccional
 * Componente dedicado a mostrar el resultado de la reserva y permitir la cancelación de prueba.
 */
export default function BookingTest({ result, cancelResult, onCancel }: BookingTestProps) {
    if (!result && !cancelResult) return null;

    return (
        <section className="bg-green-50 p-6 border-2 border-green-200 rounded-xl mt-8">
            <h2 className="text-xl font-bold text-green-900 mb-2">3. Validador Transaccional (Live)</h2>
            <div className="space-y-4">
                {result && (
                    <>
                        <p className="flex justify-between items-center">
                            <span>Estado Reserva:</span>
                            <span className={`px-3 py-1 rounded-full text-white font-bold ${result.status === 'CONFIRMED' ? 'bg-green-600' : 'bg-red-600'}`}>
                                {result.status}
                            </span>
                        </p>
                        
                        {result.locator && (
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <p className="text-sm text-gray-500 mb-1 font-bold">LOCALIZADOR GDS:</p>
                                <p className="text-2xl font-mono font-bold tracking-widest text-blue-900">{result.locator}</p>
                            </div>
                        )}
                        
                        {result.error && (
                            <p className="text-sm text-red-700 italic border-l-4 border-red-400 pl-3">
                                {result.error}
                            </p>
                        )}

                        {result.status === 'CONFIRMED' && result.locator && !cancelResult && (
                            <button 
                                onClick={onCancel}
                                className="w-full bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 duration-150"
                            >
                                CANCELAR ESTA RESERVA EN GDS
                            </button>
                        )}
                    </>
                )}

                {cancelResult && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="font-bold text-orange-800 mb-2 uppercase text-xs">Resultado de Cancelación:</p>
                        <p className="text-sm font-bold text-gray-900">{cancelResult.message}</p>
                        {cancelResult.cancellationPrice !== undefined && (
                            <p className="text-xs text-gray-600 mt-1">Gasto de cancelación: {cancelResult.cancellationPrice} {cancelResult.currency || 'EUR'}</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
