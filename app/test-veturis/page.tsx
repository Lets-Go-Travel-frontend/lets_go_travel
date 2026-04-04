"use client";

import { useState } from "react";
import { useCentralizer } from "../hooks/useCentralizer";
import { useBooking } from "../hooks/useBooking";
import BookingTest from "./booking-test";
import { IBookingRequest, IDetailsResponse } from "../types/standard";

export default function VeturisSandbox() {
    const { data, isLoading: isSearching, searchHotels, isError: searchError } = useCentralizer();
    const { 
        getDetails, 
        bookHotel, 
        cancelBooking, 
        getBookingList, 
        getVoucher, 
        isLoading: isBooking, 
        result: bookingResult, 
        cancelResult,
        bookingList 
    } = useBooking();

    const [params, setParams] = useState({
        hotelId: "9553",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        adults: 2,
        children: 0,
        childrenAges: [] as number[],
        language: "SPA"
    });

    const [passengers, setPassengers] = useState([
        { name: "John", surname: "Doe", age: 30, docNumber: "12345678X", dateOfBirth: "1990-01-01" }
    ]);

    const [client, setClient] = useState({
        name: "John",
        surnames: "Doe",
        email: "john.doe@example.com",
        phone: "+34600000000",
        country: "15"
    });

    const [company, setCompany] = useState({
        name: "",
        cif: "",
        address: ""
    });

    const [isCorporate, setIsCorporate] = useState(false);
    const [agencyReference, setAgencyReference] = useState("");
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<IDetailsResponse | null>(null);
    const [voucherHtml, setVoucherHtml] = useState<string | null>(null);

    const handleSearch = () => {
        searchHotels(params);
    };

    const handleGetDetails = async (token: string) => {
        setSelectedToken(token);
        const details = await getDetails(token);
        setSelectedDetails(details);
    };

    const handleBook = async (token: string) => {
        const request: IBookingRequest = {
            bookingToken: token,
            client: client,
            passengers: passengers,
            company: isCorporate ? company : undefined,
            agencyReference: agencyReference,
            language: params.language
        };
        await bookHotel(request);
    };

    const handleCancelQuoted = async () => {
        if (bookingResult?.bookingId) {
            await cancelBooking({
                bookingId: bookingResult.bookingId,
                securityCode: bookingResult.securityCode || "",
                confirm: false
            });
        }
    };

    const handleCancelConfirmed = async () => {
        if (bookingResult?.bookingId) {
            await cancelBooking({
                bookingId: bookingResult.bookingId,
                securityCode: bookingResult.securityCode || "",
                confirm: true
            });
        }
    };

    const handleFetchBookingList = async () => {
        await getBookingList({
            dateRange: {
                fromDate: "2024-01-01",
                toDate: "2026-12-31",
                type: 1
            }
        });
    };

    const handleViewVoucher = async (id: string, code: string) => {
        const res = await getVoucher(id, code);
        if (res?.rawHtml) {
            setVoucherHtml(res.rawHtml);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
            <header className="mb-8 border-b pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-blue-900 tracking-tight">GDS VALIDATOR PRO</h1>
                    <p className="text-sm text-gray-500 font-mono italic">Veturis Production Bridge | Hollow Shell Architecture</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleFetchBookingList} className="bg-white text-blue-700 px-4 py-2 rounded-lg text-xs font-bold border border-blue-200 shadow-sm hover:bg-blue-50 transition">
                        🔄 RECARGAR RESERVAS (GDS LIST)
                    </button>
                    <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-bold border border-green-200 shadow-sm">
                        BRIDGE: 3005 ACTIVE
                    </span>
                </div>
            </header>

            {voucherHtml && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-10 backdrop-blur-sm">
                    <div className="bg-white w-full h-full max-w-5xl rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                            <h2 className="font-bold text-blue-900">📄 GDS VOUCHER</h2>
                            <button onClick={() => setVoucherHtml(null)} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 shadow-lg">CERRAR</button>
                        </div>
                        <iframe className="flex-1 w-full" srcDoc={voucherHtml} />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    {/* BÚSQUEDA REAL */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-md font-black mb-4 flex items-center gap-2 text-blue-900 uppercase tracking-wider">
                            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                            1. Parámetros de Búsqueda
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Hotel ID</label>
                                <input className="w-full p-3 border rounded-xl bg-gray-50 text-sm font-bold focus:ring-2 ring-blue-500 outline-none" value={params.hotelId} onChange={e => setParams({...params, hotelId: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="date" className="w-full p-3 border rounded-xl text-sm font-bold bg-gray-50" value={params.checkIn} onChange={e => setParams({...params, checkIn: e.target.value})} />
                                <input type="date" className="w-full p-3 border rounded-xl text-sm font-bold bg-gray-50" value={params.checkOut} onChange={e => setParams({...params, checkOut: e.target.value})} />
                            </div>
                            <button onClick={handleSearch} disabled={isSearching} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50">
                                {isSearching ? "🔍 CONSULTANDO GDS..." : "INICIAR BÚSQUEDA"}
                            </button>
                        </div>
                    </section>

                    {/* CONFIGURACIÓN CORPORATIVA */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-md font-black mb-4 flex items-center gap-2 text-blue-900 uppercase tracking-wider">
                            <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                            2. Configuración B2B
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                                <span className="text-sm font-bold text-purple-900">¿Reserva Corporativa?</span>
                                <input type="checkbox" className="w-5 h-5" checked={isCorporate} onChange={e => setIsCorporate(e.target.checked)} />
                            </div>
                            {isCorporate && (
                                <div className="space-y-2">
                                    <input placeholder="Empresa" className="w-full p-2 border rounded-lg text-xs font-bold" value={company.name} onChange={e => setCompany({...company, name: e.target.value})} />
                                    <input placeholder="CIF" className="w-full p-2 border rounded-lg text-xs font-bold" value={company.cif} onChange={e => setCompany({...company, cif: e.target.value})} />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    {/* RESULTADOS REALES */}
                    <div className="grid grid-cols-1 gap-4">
                        {data?.items.map((item, i) => (
                            <div key={i} className="bg-white border-2 border-transparent hover:border-blue-500 transition-all p-6 rounded-3xl shadow-sm group">
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-black text-xl text-blue-900 leading-tight">{item.hotelName} (ID: {item.hotelId})</h3>
                                        </div>
                                        <p className="text-sm font-bold text-blue-600 mt-2">{item.roomName} - {item.boardName}</p>
                                        <div className="mt-4 flex justify-between items-end">
                                            <div className="text-2xl font-black text-green-600">
                                                {item.pricing.grossPrice.toFixed(2)} {item.pricing.currency}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleGetDetails(item.bookingToken)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-black">DETALLES</button>
                                                <button onClick={() => handleBook(item.bookingToken)} disabled={isBooking} className="bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-black">RESERVAR</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedDetails && selectedToken === item.bookingToken && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl border text-xs font-bold space-y-2">
                                        <p className="text-blue-900 uppercase">📊 Información GDS Real:</p>
                                        <div className="flex justify-between"><span>Saldo Agencia:</span> <span>{selectedDetails.extraData?.agencyBalance?.toFixed(2)} EUR</span></div>
                                        {selectedDetails.extraData?.supplements?.map((s, idx) => (
                                            <div key={idx} className="flex justify-between text-orange-600"><span>{s.name}:</span> <span>+{s.price.toFixed(2)} EUR</span></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <BookingTest result={bookingResult} cancelResult={cancelResult} onCancel={handleCancelQuoted} />
                </div>
            </div>
        </div>
    );
}
