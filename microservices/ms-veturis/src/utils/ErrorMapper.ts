/**
 * [GDS_CONTRACT_v3_9]: Universal Error Mapping for Veturis
 * Traduce los errores descriptivos de Veturis a códigos estandarizados para el Centralizador.
 */

export enum GdsErrorType {
    VALIDATION = 'GDS_VALIDATION_ERROR',
    AVAILABILITY = 'GDS_AVAILABILITY_ERROR',
    PRERESERVA = 'GDS_PREBOOKING_ERROR',
    PAYMENT = 'GDS_PAYMENT_ERROR',
    CONFIRMATION = 'GDS_CONFIRMATION_ERROR',
    CANCELLATION = 'GDS_CANCELLATION_ERROR',
    SYSTEM = 'GDS_SYSTEM_ERROR',
    UNKNOWN = 'GDS_UNKNOWN_ERROR'
}

export interface IStandardError {
    type: GdsErrorType;
    message: string;
    rawProviderError?: string;
    isRecoverable: boolean;
}

export class ErrorMapper {
    public static map(veturisError: string): IStandardError {
        const err = veturisError.toUpperCase();

        if (err.includes('ERROR_PRERESERVA')) {
            return {
                type: GdsErrorType.PRERESERVA,
                message: 'El GDS no pudo bloquear la habitación. Es posible que el precio haya cambiado.',
                rawProviderError: veturisError,
                isRecoverable: true
            };
        }

        if (err.includes('ERROR_DATA')) {
            return {
                type: GdsErrorType.VALIDATION,
                message: 'Datos de pasajeros o cliente inválidos según el GDS.',
                rawProviderError: veturisError,
                isRecoverable: true
            };
        }

        if (err.includes('ERROR_CONFIRMACION')) {
            return {
                type: GdsErrorType.CONFIRMATION,
                message: 'Fallo crítico al confirmar la reserva. Contactar con soporte.',
                rawProviderError: veturisError,
                isRecoverable: false
            };
        }

        if (err.includes('LA RESERVA AÚN NO ESTÁ CONFIRMADA')) {
            return {
                type: GdsErrorType.CANCELLATION,
                message: 'No se puede cancelar una reserva que no ha sido confirmada previamente.',
                rawProviderError: veturisError,
                isRecoverable: false
            };
        }

        if (err.includes('RESERVA ESTÁ YA ANULADA')) {
            return {
                type: GdsErrorType.CANCELLATION,
                message: 'Esta reserva ya ha sido cancelada previamente.',
                rawProviderError: veturisError,
                isRecoverable: false
            };
        }

        if (err.includes('ERROR 1824') || err.includes('ELEMENT \'BOOKINGID\'')) {
            // [Ticket TRX-303]: Extractor Inteligente de Error 1824
            const fieldMatch = veturisError.match(/Element '(.*?)'/i);
            const field = fieldMatch ? fieldMatch[1] : 'Unknown';
            return {
                type: GdsErrorType.VALIDATION,
                message: `Error de validación GDS. Verifique el formato o existencia del campo: ${field}`,
                rawProviderError: veturisError,
                isRecoverable: false
            };
        }

        if (err.includes('ERROR 1825')) {
            return {
                type: GdsErrorType.AVAILABILITY,
                message: 'No hay disponibilidad para los criterios seleccionados en el GDS.',
                rawProviderError: veturisError,
                isRecoverable: false
            };
        }

        // Errores genéricos
        return {
            type: GdsErrorType.UNKNOWN,
            message: veturisError || 'Error desconocido del proveedor GDS.',
            rawProviderError: veturisError,
            isRecoverable: false
        };
    }
}
