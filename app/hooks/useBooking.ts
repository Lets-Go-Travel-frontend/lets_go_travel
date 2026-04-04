import { useState } from "react";
import { 
    IBookingRequest, 
    IBookingResponse, 
    IDetailsResponse, 
    ICancelRequest, 
    ICancelResponse, 
    IVoucherResponse, 
    IBookingListResponse, 
    IBookingListRequest,
    IModifyRequest,
    IModifyResponse
} from "../types/standard";

export const useBooking = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<IBookingResponse | null>(null);
    const [cancelResult, setCancelResult] = useState<ICancelResponse | null>(null);
    const [bookingList, setBookingList] = useState<IBookingListResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getDetails = async (bookingToken: string): Promise<IDetailsResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3005/details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingToken })
            });

            if (!res.ok) throw new Error("Details request failed");
            const data: IDetailsResponse = await res.json();
            return data;
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const bookHotel = async (bookingRequest: IBookingRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3005/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingRequest)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Booking request failed");
            }
            const data: IBookingResponse = await res.json();
            setResult(data);
            return data;
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
            setResult({ status: 'ERROR', error: error.message });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const cancelBooking = async (cancelRequest: ICancelRequest): Promise<ICancelResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3005/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cancelRequest)
            });

            if (!res.ok) throw new Error("Cancellation request failed");
            const data: ICancelResponse = await res.json();
            setCancelResult(data);
            return data;
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getBookingList = async (request: IBookingListRequest): Promise<IBookingListResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3005/booking-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Booking list request failed");
            }
            const data: IBookingListResponse = await res.json();
            setBookingList(data);
            return data;
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getVoucher = async (bookingId: string, securityCode: string): Promise<IVoucherResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3005/voucher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, securityCode })
            });

            if (!res.ok) throw new Error("Voucher request failed");
            const data: IVoucherResponse = await res.json();
            return data;
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const modifyBooking = async (modifyRequest: IModifyRequest): Promise<IModifyResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3005/modify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(modifyRequest)
            });

            if (!res.ok) throw new Error("Modification request failed");
            const data: IModifyResponse = await res.json();
            return data;
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { 
        getDetails, 
        bookHotel, 
        cancelBooking, 
        getBookingList, 
        getVoucher, 
        modifyBooking,
        isLoading, 
        result, 
        cancelResult, 
        bookingList, 
        error 
    };
};
