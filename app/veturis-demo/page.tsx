"use client";

import { useState } from 'react';

const BRIDGE_API = 'http://localhost:3005';

// ─── Types ────────────────────────────────────────────────
interface Hotel { id: string; name: string; city: string; category?: string; }
interface Rate {
  hotelId: string; hotelName: string; stars: number; roomName: string; bookingToken: string;
  boardName: string; pricing: { netPrice: number; grossPrice: number; currency: string; isBindingRate: boolean };
  cancellationPolicy: { refundable: boolean; penaltyTiers: Array<{ fromDate: string; amount: number }> };
}
interface Details {
  status: string; price: number; currency: string; hotelName: string;
  description?: string; address?: string; city?: string;
  cancellationPolicy: { refundable: boolean; freeCancellationUntil?: string; penaltyTiers: Array<{ fromDate: string; amount: number }> };
  essentialInformation?: string[];
  priceChangeInfo?: { hasChanged: boolean; newPrice?: number };
  extraData?: { agencyBalance?: number };
}
interface BookingResult { status: string; locator?: string; bookingId?: string; securityCode?: string; }
interface CancelResult { status: string; message?: string; cancellationPrice?: number; currency?: string; }

type CancelState = 'idle' | 'quoting' | 'quoted' | 'cancelling' | 'cancelled';

export default function VeturisDemoPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search params
  const [query, setQuery] = useState('madrid');
  const [checkIn, setCheckIn] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 10); return d.toISOString().split('T')[0]; });
  const [nights, setNights] = useState(5);
  const [checkOut, setCheckOut] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 15); return d.toISOString().split('T')[0]; });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);

  // ── Sync checkOut with nights ──────────────────────────
  const syncCheckOut = (inDate: string, n: number) => {
    const d = new Date(inDate);
    d.setDate(d.getDate() + n);
    setCheckOut(d.toISOString().split('T')[0]);
  };

  const handleNightsChange = (n: number) => {
    setNights(n);
    syncCheckOut(checkIn, n);
  };

  const handleCheckInChange = (date: string) => {
    setCheckIn(date);
    syncCheckOut(date, nights);
  };

  // State
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [availability, setAvailability] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  // Cancel state machine
  const [cancelState, setCancelState] = useState<CancelState>('idle');
  const [cancelResult, setCancelResult] = useState<CancelResult | null>(null);

  const handleError = (err: unknown) => {
    setError(err instanceof Error ? err.message : JSON.stringify(err));
    setLoading(false);
  };

  const go = (s: number) => { setError(null); setStep(s); };

  // ── Children ages management ───────────────────────────
  const handleChildrenChange = (n: number) => {
    setChildren(n);
    setChildrenAges(prev => {
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill(7)];
      return prev.slice(0, n);
    });
  };

  // ── STEP 1: Catalog ────────────────────────────────────
  const handleCatalogSearch = async () => {
    setLoading(true); setError(null); setHotels([]);
    try {
      const res = await fetch(`${BRIDGE_API}/hotels/search?q=${encodeURIComponent(query)}&limit=50`);
      if (!res.ok) throw new Error('Error al buscar en el catálogo Redis');
      const data = await res.json();
      setHotels(data.hotels || []);
    } catch (err) { handleError(err); }
    finally { setLoading(false); }
  };

  // ── STEP 2: Availability ───────────────────────────────
  const handleCheckAvailability = async (hotel: Hotel) => {
    setLoading(true); setError(null); setAvailability([]); setSelectedHotel(hotel);
    try {
      const occupancies = [{ adults, children, ...(childrenAges.length > 0 ? { childrenAges } : {}) }];
      const res = await fetch(`${BRIDGE_API}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelId: hotel.id, checkIn, checkOut, occupancies, language: 'SPA' })
      });
      const data = await res.json();
      if (!res.ok || data.status === 'KO') throw new Error(data.message || 'GDS no respondió correctamente');
      setAvailability(data.items || []);
      go(2);
    } catch (err) { handleError(err); }
    finally { setLoading(false); }
  };

  // ── STEP 3: Details ────────────────────────────────────
  const handleGetDetails = async (rate: Rate) => {
    setLoading(true); setError(null); setSelectedRate(rate);
    try {
      const res = await fetch(`${BRIDGE_API}/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingToken: rate.bookingToken })
      });
      const data = await res.json();
      if (!res.ok || data.status === 'KO') throw new Error(data.message || 'Error validando tarifa en GDS');
      setDetails(data);
      go(3);
    } catch (err) { handleError(err); }
    finally { setLoading(false); }
  };

  // ── STEP 4: Book ───────────────────────────────────────
  const handleBook = async () => {
    if (!selectedRate || !details) return;
    setLoading(true); setError(null);
    try {
      const passengerList = [
        { name: 'Juan', surname: 'Demo', docNumber: '12345678X', dateOfBirth: '1990-01-01' },
        { name: 'Maria', surname: 'Demo', docNumber: '87654321Z', dateOfBirth: '1992-05-15' },
        ...Array.from({ length: children }, (_, i) => ({
          name: `Niño${i + 1}`, surname: 'Demo', docNumber: `N0000000${i + 1}`, dateOfBirth: `${2018 - i}-06-10`
        }))
      ].slice(0, adults + children);

      const payload = {
        bookingToken: selectedRate.bookingToken, language: 'SPA',
        client: { name: 'Juan', surnames: 'Demo Viajero', email: 'demo@letsgotravel.com', country: '15' },
        passengers: passengerList,
        remarks: 'Reserva de prueba API — No hospedar',
        ...(details.priceChangeInfo?.hasChanged ? { acceptedPriceChange: details.priceChangeInfo.newPrice } : {})
      };
      const res = await fetch(`${BRIDGE_API}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.status === 'ERROR') throw new Error(data.error || 'Reserva rechazada por GDS');
      setBookingResult(data);
      setCancelState('idle'); setCancelResult(null);
      go(4);
    } catch (err) { handleError(err); }
    finally { setLoading(false); }
  };

  // ── Cancel Quote (non-destructive) ─────────────────────
  const handleCancelQuote = async () => {
    if (!bookingResult) return;
    setCancelState('quoting'); setError(null);
    try {
      const res = await fetch(`${BRIDGE_API}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingResult.bookingId, securityCode: bookingResult.securityCode, confirm: false })
      });
      const data = await res.json();
      if (!res.ok || data.status === 'ERROR') throw new Error(data.message || 'Error consultando coste');
      setCancelResult(data);
      setCancelState('quoted');
    } catch (err) {
      setCancelState('idle');
      handleError(err);
    }
  };

  // ── Cancel Confirm (destructive) ───────────────────────
  const handleCancelConfirm = async () => {
    if (!bookingResult) return;
    setCancelState('cancelling'); setError(null);
    try {
      const res = await fetch(`${BRIDGE_API}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingResult.bookingId, securityCode: bookingResult.securityCode, confirm: true })
      });
      const data = await res.json();
      if (!res.ok || data.status === 'ERROR') throw new Error(data.message || 'Error en la cancelación');
      setCancelResult(data);
      setCancelState('cancelled');
    } catch (err) {
      setCancelState('idle');
      handleError(err);
    }
  };

  // ─── UI Helpers ────────────────────────────────────────
  const fmt = (price: number, currency = 'EUR') =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(price);

  const stepLabels = ['Catálogo', 'Disponibilidad', 'Validación', 'Reserva', 'Voucher'];

  const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-sm font-bold">LGT</div>
            <h1 className="text-2xl font-extrabold tracking-tight">Let&apos;s Go Travel</h1>
            <span className="ml-auto text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full border border-neutral-700">Veturis API v3.9 · Demo Mode</span>
          </div>
          <p className="text-neutral-500 text-sm pl-11">Motor GDS con Hollow Shell Architecture · RediSearch Stateless</p>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-xl flex items-start gap-3">
            <span className="text-lg mt-0.5">⛔</span>
            <div>
              <p className="font-semibold text-sm text-red-200">Error en el flujo GDS</p>
              <p className="text-xs mt-0.5 font-mono">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-300 text-lg leading-none">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="md:col-span-3 space-y-2">
            {stepLabels.map((label, i) => {
              const s = i + 1;
              const active = step === s;
              const done = step > s;
              return (
                <button key={s} onClick={() => s <= step && go(s)} disabled={s > step}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3
                    ${active ? 'bg-blue-600/15 border-blue-500/60 shadow-blue-500/10 shadow-md' : ''}
                    ${done ? 'bg-neutral-800/60 border-neutral-700 cursor-pointer' : ''}
                    ${!active && !done ? 'bg-neutral-900 border-neutral-800 opacity-40 cursor-not-allowed' : ''}`}>
                  <div className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0
                    ${active ? 'bg-blue-500 text-white' : done ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-500'}`}>
                    {done ? '✓' : s}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${active ? 'text-blue-300' : done ? 'text-neutral-300' : 'text-neutral-600'}`}>{label}</p>
                    <p className="text-xs text-neutral-600">
                      {s === 1 && 'RediSearch'}{s === 2 && 'XML Real-Time'}{s === 3 && 'Valuation GDS'}
                      {s === 4 && 'Confirmación'}{s === 5 && 'Post-Venta'}
                    </p>
                  </div>
                </button>
              );
            })}
            <div className="mt-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-500 space-y-1">
              <p className="font-bold text-neutral-400 mb-2">📌 Modo Demo</p>
              <p>· GDS Mock activo (IP no whitelisted)</p>
              <p>· Reservas NO impactan sistema real</p>
              <p>· Redis catálogo live</p>
            </div>
          </div>

          {/* Main panel */}
          <div className="md:col-span-9 bg-neutral-900 rounded-2xl border border-neutral-800 p-6 min-h-[520px] relative">

            {loading && (
              <div className="absolute inset-0 z-50 bg-neutral-950/80 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                <div className="h-10 w-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-blue-400 text-sm font-medium animate-pulse">Consultando GDS Veturis...</p>
              </div>
            )}

            {/* ─── STEP 1: Catalog ─────────────────────────── */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <span className="text-blue-400">🔍</span> Catálogo de Hoteles
                  <span className="ml-auto text-xs font-normal text-neutral-500">Fuente: RediSearch</span>
                </h2>

                {/* Search params row 1 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-neutral-500 mb-1">Destino o nombre del hotel</label>
                    <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCatalogSearch()}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                      placeholder="Ej: Madrid, Novotel, Tenerife..." />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={e => handleCheckInChange(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Noches</label>
                    <select value={nights} onChange={e => handleNightsChange(Number(e.target.value))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white">
                      {[...Array(30)].map((_, i) => <option key={i+1} value={i+1}>{i+1} noche{i > 0 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>

                {/* Search params row 2: occupancy */}
                <div className="flex flex-wrap items-end gap-3 mb-5">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Adultos</label>
                    <select value={adults} onChange={e => setAdults(Number(e.target.value))}
                      className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Niños</label>
                    <select value={children} onChange={e => handleChildrenChange(Number(e.target.value))}
                      className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  {children > 0 && (
                    <div className="flex gap-2 items-end">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Edad{children > 1 ? 'es' : ''} niño{children > 1 ? 's' : ''}</label>
                        <div className="flex gap-1.5">
                          {childrenAges.map((age, i) => (
                            <select key={i} value={age}
                              onChange={e => { const a = [...childrenAges]; a[i] = Number(e.target.value); setChildrenAges(a); }}
                              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 w-16">
                              {Array.from({ length: 18 }, (_, y) => y + 1).map(y => <option key={y} value={y}>{y} yr</option>)}
                            </select>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <button onClick={handleCatalogSearch}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all">
                    Buscar Hoteles →
                  </button>
                  {hotels.length > 0 && <span className="text-xs text-neutral-500">{hotels.length} resultado{hotels.length > 1 ? 's' : ''}</span>}
                </div>

                {/* Occupancy summary pill */}
                {(adults > 0 || children > 0) && nights > 0 && (
                  <div className="mb-3 flex gap-2 flex-wrap">
                    <span className="text-xs bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-full text-neutral-400">
                      🏨 {nights} noche{nights > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-full text-neutral-400">
                      👤 {adults} adulto{adults > 1 ? 's' : ''}
                      {children > 0 && ` · 🧒 ${children} niño${children > 1 ? 's' : ''} (${childrenAges.join(', ')} años)`}
                    </span>
                  </div>
                )}

                {/* Hotel results */}
                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {hotels.map((h, i) => (
                    <div key={i} className="flex justify-between items-center bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-xl px-4 py-3 group transition-all">
                      <div>
                        <p className="font-semibold text-sm text-neutral-200 group-hover:text-blue-400 transition-colors">{h.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{h.city} · <span className="font-mono text-neutral-400">#{h.id}</span></p>
                      </div>
                      <button onClick={() => handleCheckAvailability(h)}
                        className="text-xs bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-600/40 hover:border-blue-500 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ml-4">
                        Disponibilidad →
                      </button>
                    </div>
                  ))}
                  {hotels.length === 0 && !loading && (
                    <div className="text-center py-16 text-neutral-600">
                      <p className="text-3xl mb-3">🏨</p>
                      <p className="text-sm">Busca un destino para ver hoteles del catálogo</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── STEP 2: Availability ────────────────────── */}
            {step === 2 && (
              <div>
                <button onClick={() => go(1)} className="text-blue-400 text-xs mb-4 hover:underline flex items-center gap-1">← Volver al catálogo</button>
                <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <span className="text-green-400">📡</span> Tarifas en Tiempo Real
                </h2>
                <p className="text-sm text-neutral-500 mb-5">
                  <strong className="text-neutral-300">{selectedHotel?.name}</strong> · {checkIn} → {checkOut} · {adults} adulto{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} niño${children > 1 ? 's' : ''}` : ''}
                </p>

                {availability.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-neutral-700 rounded-xl text-neutral-500">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="text-sm">Sin disponibilidad para este hotel en las fechas seleccionadas.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availability.map((rate, i) => (
                      <div key={i} className="bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all group">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded">{rate.boardName}</span>
                            {rate.cancellationPolicy?.refundable
                              ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/50 px-2 py-0.5 rounded">✅ Cancelación flexible</span>
                              : <span className="text-xs bg-red-900/30 text-red-400 border border-red-800/40 px-2 py-0.5 rounded">🔒 No reembolsable</span>}
                          </div>
                          <h4 className="font-bold text-neutral-100 group-hover:text-blue-300 transition-colors">{rate.roomName}</h4>
                          <p className="text-xs text-neutral-500 mt-1">Precio neto agencia: {fmt(rate.pricing.netPrice, rate.pricing.currency)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-white">{fmt(rate.pricing.grossPrice, rate.pricing.currency)}</p>
                          <p className="text-xs text-neutral-500 mb-2">precio público</p>
                          <button onClick={() => handleGetDetails(rate)}
                            className="text-sm bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-green-700/20">
                            Auditar Políticas →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── STEP 3: Valuation ───────────────────────── */}
            {step === 3 && (
              <div>
                <button onClick={() => go(2)} className="text-blue-400 text-xs mb-4 hover:underline flex items-center gap-1">← Volver a tarifas</button>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <span className="text-yellow-400">📋</span> Validación GDS — Valuation
                </h2>

                {details ? (
                  <div className="space-y-4">
                    {details.priceChangeInfo?.hasChanged && details.priceChangeInfo.newPrice !== details.price && (
                      <div className="bg-orange-950/50 border border-orange-700/60 rounded-xl p-4">
                        <p className="text-orange-300 font-bold text-sm">⚠️ Fluctuación de Precio detectada</p>
                        <p className="text-orange-200 text-xs mt-1">Nuevo precio mandatorio: <strong>{fmt(details.priceChangeInfo.newPrice!, details.currency)}</strong></p>
                      </div>
                    )}

                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-neutral-500">Hotel confirmado</p>
                        <p className="font-bold text-white text-lg leading-tight">
                          {details.hotelName || selectedHotel?.name}
                        </p>
                        {details.address && <p className="text-xs text-neutral-500 mt-0.5">{details.address}{details.city ? ` · ${details.city}` : ''}</p>}
                        {details.description && <p className="text-xs text-neutral-600 mt-1 italic">{details.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">Precio agencia confirmado</p>
                        <p className="text-2xl font-extrabold text-green-400">{fmt(details.price, details.currency)}</p>
                      </div>
                    </div>

                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
                      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                        🛡️ Política de Cancelación
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${details.cancellationPolicy.refundable ? 'bg-green-900/50 text-green-400 border border-green-800/50' : 'bg-red-900/40 text-red-400 border border-red-800/40'}`}>
                          {details.cancellationPolicy.refundable ? 'Reembolsable' : 'No Reembolsable'}
                        </span>
                      </h3>
                      {details.cancellationPolicy.freeCancellationUntil && (
                        <p className="text-xs text-green-400 mb-2">✅ Cancelación gratuita hasta: <strong>{details.cancellationPolicy.freeCancellationUntil}</strong></p>
                      )}
                      {details.cancellationPolicy.penaltyTiers?.length > 0 ? (
                        <div className="space-y-1.5">
                          {details.cancellationPolicy.penaltyTiers.map((p, i) => (
                            <div key={i} className="flex justify-between text-xs border-b border-neutral-700 pb-1.5">
                              <span className="text-neutral-400">A partir de <strong className="text-neutral-200">{p.fromDate}</strong></span>
                              <span className="text-red-400 font-medium">Penalización: {fmt(p.amount, details.currency)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500 italic">Sin cargos de cancelación reportados por el carrier.</p>
                      )}
                    </div>

                    {details.essentialInformation && details.essentialInformation.length > 0 && (
                      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
                        <h3 className="font-bold text-sm mb-2">ℹ️ Información Esencial</h3>
                        <ul className="space-y-1">
                          {details.essentialInformation.map((info, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5 shrink-0">•</span>{info}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.extraData?.agencyBalance !== undefined && (
                      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex justify-between items-center">
                        <p className="text-sm text-neutral-400">Saldo disponible en cuenta agencia</p>
                        <p className="text-lg font-bold text-blue-300">{fmt(details.extraData.agencyBalance, details.currency)}</p>
                      </div>
                    )}

                    <button onClick={handleBook}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-purple-700/20 hover:-translate-y-0.5 transform">
                      ⚡ Confirmar Reserva en GDS
                    </button>
                    <p className="text-xs text-center text-neutral-600">La reserva se ejecutará con pasajeros de prueba</p>
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-600">
                    <p className="text-sm">Selecciona una tarifa para ver la validación.</p>
                  </div>
                )}
              </div>
            )}

            {/* ─── STEP 4: Confirmed ───────────────────────── */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  {cancelState === 'cancelled'
                    ? <><span className="text-red-400">🚫</span> Reserva Anulada</>
                    : <><span className="text-green-400">🎉</span> Reserva Confirmada por GDS</>}
                </h2>

                {bookingResult && (
                  <div className="space-y-4">
                    {/* Booking card */}
                    <div className={`border rounded-2xl p-5 space-y-3 transition-all duration-500
                      ${cancelState === 'cancelled'
                        ? 'bg-red-950/20 border-red-800/50 opacity-70'
                        : 'bg-green-950/20 border-green-800/40'}`}>
                      {cancelState === 'cancelled' && (
                        <div className="bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2 text-sm text-red-300 font-semibold flex items-center gap-2">
                          🚫 Esta reserva ha sido anulada definitivamente
                        </div>
                      )}
                      {[
                        { label: 'Localizador Veturis', value: bookingResult.locator, color: 'text-green-400', bg: 'bg-green-400/10' },
                        { label: 'ID Sistema Central', value: bookingResult.bookingId, color: 'text-white', bg: 'bg-neutral-700/50' },
                        { label: 'Código de Seguridad', value: bookingResult.securityCode, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                      ].map(({ label, value, color, bg }) => (
                        <div key={label} className={`flex justify-between items-center rounded-lg px-4 py-3 ${bg}`}>
                          <span className="text-xs text-neutral-400">{label}</span>
                          <span className={`font-mono font-bold text-sm ${color} ${cancelState === 'cancelled' ? 'line-through opacity-50' : ''}`}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cancel panel — only show if not already cancelled */}
                    {cancelState !== 'cancelled' && (
                      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
                        <h3 className="font-bold text-sm mb-3 text-neutral-300">🔧 Acciones Post-Venta</h3>

                        {/* Quote result banner */}
                        {cancelState === 'quoted' && cancelResult && (
                          <div className="mb-3 bg-orange-950/40 border border-orange-700/50 rounded-xl p-4">
                            <p className="text-sm font-bold text-orange-300 mb-1">💰 Coste de Cancelación</p>
                            <div className="flex items-end gap-3">
                              <p className="text-3xl font-extrabold text-orange-300">
                                {fmt(cancelResult.cancellationPrice ?? 0, cancelResult.currency || 'EUR')}
                              </p>
                              <p className="text-xs text-orange-400/70 mb-1">
                                {(cancelResult.cancellationPrice ?? 0) === 0 ? '✅ Cancelación gratuita en este momento' : '⚠️ Se aplicará esta penalización'}
                              </p>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">Reserva: <span className="font-mono text-neutral-400">{bookingResult.bookingId}</span></p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Quote button */}
                          <button
                            onClick={handleCancelQuote}
                            disabled={cancelState === 'quoting' || cancelState === 'cancelling'}
                            className="text-sm border border-orange-600/50 text-orange-400 hover:bg-orange-600/10 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition-all text-left">
                            {cancelState === 'quoting' ? (
                              <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 border border-orange-400 border-t-transparent rounded-full animate-spin" />Consultando GDS...</span>
                            ) : (
                              <>
                                <span className="block text-base mb-0.5">💰</span>
                                {cancelState === 'quoted' ? 'Volver a consultar' : 'Consultar Coste de Cancelación'}
                                <span className="block text-xs text-neutral-600 mt-0.5">Sin confirmar la anulación</span>
                              </>
                            )}
                          </button>

                          {/* Confirm cancel button */}
                          <button
                            onClick={handleCancelConfirm}
                            disabled={cancelState === 'quoting' || cancelState === 'cancelling'}
                            className="text-sm border border-red-700/50 text-red-400 hover:bg-red-700/10 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition-all text-left">
                            {cancelState === 'cancelling' ? (
                              <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />Anulando en GDS...</span>
                            ) : (
                              <>
                                <span className="block text-base mb-0.5">❌</span>
                                Anular Reserva
                                <span className="block text-xs text-neutral-600 mt-0.5">Cancela definitivamente en GDS</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Post-cancellation state */}
                    {cancelState === 'cancelled' && cancelResult && (
                      <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 text-center">
                        <p className="text-2xl mb-2">🚫</p>
                        <p className="font-bold text-red-300 text-base">Reserva anulada con éxito</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Penalización aplicada: <strong className="text-red-400">{fmt(cancelResult.cancellationPrice ?? 0, 'EUR')}</strong>
                        </p>
                        <button onClick={() => { setStep(1); setHotels([]); setAvailability([]); setDetails(null); setBookingResult(null); setCancelState('idle'); setCancelResult(null); }}
                          className="mt-4 text-xs text-neutral-400 hover:text-white transition-colors underline">
                          Iniciar nueva prueba
                        </button>
                      </div>
                    )}

                    {/* Voucher + Reset buttons */}
                    {cancelState !== 'cancelled' && (
                      <div className="flex gap-3">
                        <button onClick={() => go(5)}
                          className="flex-1 text-sm bg-blue-700/30 hover:bg-blue-600/30 text-blue-300 border border-blue-700/40 py-2.5 rounded-xl font-semibold transition-all">
                          Ver Voucher →
                        </button>
                        <button onClick={() => { setStep(1); setHotels([]); setAvailability([]); setDetails(null); setBookingResult(null); setCancelState('idle'); setCancelResult(null); }}
                          className="flex-1 text-sm bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 border border-neutral-600 py-2.5 rounded-xl font-semibold transition-all">
                          🔄 Nueva Prueba
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ─── STEP 5: Voucher ─────────────────────────── */}
            {step === 5 && (
              <div>
                <button onClick={() => go(4)} className="text-blue-400 text-xs mb-4 hover:underline flex items-center gap-1">← Volver</button>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <span className="text-blue-400">🎫</span> Voucher de Reserva
                </h2>
                {bookingResult && (
                  <div className="bg-white text-neutral-900 rounded-xl overflow-hidden border border-neutral-700">
                    <div className="bg-[#062571] text-white px-6 py-4 text-center">
                      <h2 className="text-xl font-extrabold">Let&apos;s Go Travel</h2>
                      <p className="text-sm text-blue-200">Confirmación de Reserva Hotelera</p>
                      <p className="text-xs text-blue-300 mt-1 opacity-80">
                        {details?.hotelName || selectedHotel?.name}
                        {(details?.city || selectedHotel?.city) ? ` · ${details?.city || selectedHotel?.city}` : ''}
                      </p>
                    </div>
                    <div className="p-6 space-y-3 text-sm">
                      {[
                        { label: 'Hotel', value: details?.hotelName || selectedHotel?.name || 'Hotel Demo', bold: true },
                        { label: 'Dirección', value: details?.address || '—' },
                        { label: 'Ciudad', value: details?.city || selectedHotel?.city || '—' },
                        { label: 'Localizador', value: bookingResult.locator, bold: true, color: 'text-blue-800' },
                        { label: 'Booking ID', value: bookingResult.bookingId, mono: true },
                        { label: 'Check-in', value: checkIn },
                        { label: 'Check-out', value: checkOut },
                        { label: 'Noches', value: String(nights) },
                        { label: 'Habitación', value: selectedRate?.roomName },
                        { label: 'Régimen', value: selectedRate?.boardName },
                        { label: 'Viajeros', value: `${adults} adulto${adults > 1 ? 's' : ''}${children > 0 ? ` + ${children} niño${children > 1 ? 's' : ''}` : ''}` },
                      ].map(({ label, value, bold, color, mono }: { label: string; value?: string; bold?: boolean; color?: string; mono?: boolean }) => (
                        <div key={label} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                          <span className="text-gray-500">{label}</span>
                          <span className={`${bold ? 'font-bold' : ''} ${color || ''} ${mono ? 'font-mono' : ''} text-right max-w-[60%]`}>{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-500 font-semibold">Total</span>
                        <span className="font-extrabold text-lg text-green-700">{details ? fmt(details.price, details.currency) : '—'}</span>
                      </div>
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs p-2 rounded text-center">
                        ⚠️ Voucher generado en Modo Demo. No tiene validez comercial.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
