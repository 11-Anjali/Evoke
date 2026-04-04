import { useState, useEffect } from "react";
import { getPayouts, runCompensationEngine } from "../api";

export default function Claims() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [engineResult, setEngineResult] = useState(null);

  useEffect(() => {
    const riderId = localStorage.getItem("dash_rider_id");
    if (!riderId) return setLoading(false);
    getPayouts(riderId)
      .then((data) => setPayouts(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function triggerEngine() {
    setRunning(true);
    setEngineResult(null);
    try {
      const result = await runCompensationEngine();
      setEngineResult(result);
      const riderId = localStorage.getItem("dash_rider_id");
      const data = await getPayouts(riderId);
      setPayouts(data || []);
    } catch {
      setEngineResult({ message: "Engine failed. Check backend." });
    }
    setRunning(false);
  }

  const totalEarned = payouts.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
        Claims
      </div>
      <div style={{ fontSize: 13, color: "#5F5E5A", marginBottom: 24 }}>
        Zero-touch payouts — automatically triggered, no forms needed
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div className="metric-card">
          <div className="label">Total payouts</div>
          <div className="value">₹{totalEarned.toFixed(0)}</div>
        </div>
        <div className="metric-card">
          <div className="label">Events covered</div>
          <div className="value">{payouts.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Compensation engine
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#5F5E5A",
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          Runs automatically at midnight. Scans flagged zones, matches active
          riders, calculates payouts. Trigger manually below for demo.
        </div>
        <button
          onClick={triggerEngine}
          disabled={running}
          style={{
            width: "100%",
            padding: "10px",
            background: running ? "#F1EFE8" : "#EEEDFE",
            color: "#3C3489",
            borderColor: "#AFA9EC",
          }}
        >
          {running ? "Running engine..." : "Trigger compensation engine"}
        </button>

        {engineResult && (
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              background: "#E1F5EE",
              padding: "10px 14px",
              borderRadius: 8,
              color: "#085041",
            }}
          >
            {engineResult.message}
            {engineResult.payouts?.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {engineResult.payouts.length} payout(s) processed
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#5F5E5A" }}>
          Loading payouts...
        </div>
      ) : payouts.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🟢</div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
            No disruptions yet
          </div>
          <div style={{ fontSize: 13, color: "#5F5E5A" }}>
            When your zone is flagged and you're active, payouts appear here
            automatically
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {payouts.map((p) => (
            <div key={p.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    ₹{p.total?.toFixed(0)}
                  </div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginTop: 2 }}>
                    {p.date}
                  </div>
                </div>
                <span className="badge green">{p.status}</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  { label: "Valid flags", value: p.valid_flags },
                  {
                    label: "Compensation",
                    value: `₹${p.compensation?.toFixed(0)}`,
                  },
                  {
                    label: "Conditions bonus",
                    value: `₹${p.bonus?.toFixed(0)}`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="metric-card">
                    <div className="label">{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "#5F5E5A",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#1D9E75",
                    display: "inline-block",
                  }}
                ></span>
                Auto-triggered · No claim filed · Credited to UPI
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
