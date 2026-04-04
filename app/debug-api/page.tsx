"use client";
import { useState, useEffect } from "react";

export default function PowerConsole() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<any>(null);
  const [serviceStatus, setServiceStatus] = useState<any>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch("http://localhost:3005/");
      const data = await res.json();
      setServiceStatus(data);
    } catch (e) {
      setServiceStatus({ status: "OFFLINE", error: "Cannot reach REST-Bridge" });
    }
  };

  const executeRequest = async (path: string, method: string, body?: any) => {
    setLoading(true);
    const url = `http://localhost:3005${path}`;
    setLastRequest({ url, method, body });
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ status: "FATAL_ERROR", message: err.message });
    } finally {
      setLoading(false);
      checkStatus();
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#020617", color: "#f8fafc", minHeight: "100vh", fontFamily: "monospace" }}>
      
      {/* HEADER & STATUS BAR */}
      <header style={{ marginBottom: "40px", borderBottom: "1px solid #1e293b", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0, color: "#38bdf8", fontSize: "28px", letterSpacing: "-1px" }}>GDS POWER CONSOLE v3.0</h1>
          <p style={{ color: "#64748b", margin: "5px 0" }}>Auditoría Profunda: Adaptador → GDS → CSV</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: serviceStatus?.status === "ONLINE" ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
             ● SERVICE: {serviceStatus?.status || "CHECKING..."}
          </div>
          <div style={{ fontSize: "10px", color: "#475569" }}>UPTIME: {serviceStatus?.uptime?.toFixed(1) || 0}s</div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "40px" }}>
        
        {/* PANEL DE CONTROL (IZQUIERDA) */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <div style={cardStyle}>
            <h4 style={labelStyle}>LIVE SEARCH (GDS + CSV)</h4>
            <div style={{ display: "grid", gap: "10px" }}>
              <select style={inputStyle} id="hId">
                <option value="9553">9553 - Hotel Estándar</option>
                <option value="1001">1001 - Ritz Centro Europa</option>
                <option value="3088">3088 - Hostal Sol (CSV Test)</option>
              </select>
              <input style={inputStyle} type="date" id="cin" defaultValue="2026-06-01" />
              <button 
                onClick={() => executeRequest("/search", "POST", { 
                  hotelId: (document.getElementById('hId') as HTMLSelectElement).value,
                  checkIn: (document.getElementById('cin') as HTMLInputElement).value,
                  checkOut: "2026-06-05",
                  occupancies: [{
                    adults: 2, children: 0
                  }]
                })}
                style={btnStyle("#8b5cf6")}
              > EJECUTAR SEARCH (XML RQ) </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h4 style={labelStyle}>TRANSACTIONAL FLOW</h4>
            <div style={{ display: "grid", gap: "10px" }}>
              <input style={inputStyle} placeholder="Booking Token (Base64)" id="token" />
              <button 
                onClick={() => executeRequest("/book", "POST", { 
                  bookingToken: (document.getElementById('token') as HTMLInputElement).value,
                  passengers: [{ name: "John Debugger", age: 30 }]
                })}
                style={btnStyle("#10b981")}
              > CONFIRMAR RESERVA (XML) </button>
              <hr style={{ border: "0.5px solid #334155", margin: "5px 0" }} />
              <input style={inputStyle} placeholder="Locator (ej: VET-123)" id="loc" />
              <button 
                onClick={() => executeRequest("/cancel", "POST", { 
                  locator: (document.getElementById('loc') as HTMLInputElement).value 
                })}
                style={btnStyle("#ef4444")}
              > CANCELAR EN GDS </button>
            </div>
          </div>

          <div style={{ ...cardStyle, background: "transparent", border: "1px dashed #334155" }}>
             <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
               Nota: Esta consola ahora muestra **ERRORES REALES**. Si el GDS rechaza la IP o las credenciales, lo verás reflejado abajo en tiempo real.
             </p>
          </div>

        </aside>

        {/* MONITOR DE TRAFICO (DERECHA) */}
        <main>
          <div style={{ background: "#000", borderRadius: "12px", border: "1px solid #1e293b", padding: "25px", height: "700px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "12px" }}>RAW ADAPTER OUTPUT</span>
              {loading && <span style={{ color: "#fbbf24", fontSize: "12px" }}>⚡ TRAFFIC IN PROGRESS...</span>}
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", border: "1px solid #0f172a", borderRadius: "8px", padding: "15px", backgroundColor: "#050505" }}>
              <pre style={{ margin: 0, fontSize: "13px", color: response?.status === "ERROR" || response?.error ? "#ef4444" : "#22c55e", whiteSpace: "pre-wrap" }}>
                {response ? JSON.stringify(response, null, 2) : "// Await interaction..."}
              </pre>
            </div>

            {lastRequest && (
              <div style={{ marginTop: "20px", borderTop: "1px solid #1e293b", paddingTop: "15px", fontSize: "11px" }}>
                <span style={{ color: "#64748b" }}>URL:</span> <code style={{ color: "#94a3b8" }}>{lastRequest.url}</code>
                <br />
                <span style={{ color: "#64748b" }}>METODO:</span> <code style={{ color: "#f8fafc" }}>{lastRequest.method}</code>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#111827",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #1e293b"
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "bold",
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "1px",
  margin: "0 0 15px 0"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "13px"
};

const btnStyle = (color: string): React.CSSProperties => ({
  padding: "12px",
  backgroundColor: color,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "12px",
  transition: "opacity 0.2s"
});
