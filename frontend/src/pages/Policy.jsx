import { useState, useEffect } from "react";

const MULTIPLIERS = {
  Mumbai: 2.0,
  Delhi: 2.0,
  Bangalore: 2.0,
  Pune: 1.5,
  Hyderabad: 1.5,
  Chennai: 1.5,
  Lucknow: 1.0,
  Jaipur: 1.0,
  Nagpur: 1.0,
};

export default function Policy() {
  const [rider, setRider] = useState(null);

  useEffect(() => {
    const r = localStorage.getItem("dash_rider");
    if (r) setRider(JSON.parse(r));
  }, []);

  if (!rider)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#5F5E5A" }}>
        No policy found.
      </div>
    );

  const multiplier = MULTIPLIERS[rider.city] || 1.0;
  const zoneScore = rider.weekly_premium / (70 * multiplier);
  const riskTier =
    zoneScore >= 0.7 ? "High" : zoneScore >= 0.4 ? "Medium" : "Low";
  const riskBadge =
    riskTier === "High" ? "red" : riskTier === "Medium" ? "amber" : "green";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
        Insurance policy
      </div>
      <div style={{ fontSize: 13, color: "#5F5E5A", marginBottom: 24 }}>
        Your current coverage details
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              Coverage summary
            </div>
            <span className="badge green">Active</span>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              { label: "Policyholder", value: rider.name },
              { label: "Platform", value: rider.platform },
              { label: "City", value: rider.city },
              { label: "Operative zone", value: rider.pincode },
              { label: "UPI account", value: rider.upi_id || "—" },
              { label: "Coverage type", value: "Parametric income" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: "#5F5E5A" }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            Premium breakdown
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Base rate", value: "₹70 / week" },
              { label: "Zone risk score", value: zoneScore.toFixed(2) },
              {
                label: "City economic multiplier",
                value: `${multiplier}x (${rider.city})`,
              },
              { label: "Premium cap", value: "₹200 max" },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  paddingBottom: 10,
                  borderBottom: "0.5px solid rgba(0,0,0,0.06)",
                }}
              >
                <span style={{ color: "#5F5E5A" }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                fontWeight: 500,
                paddingTop: 4,
              }}
            >
              <span>Weekly premium</span>
              <span style={{ color: "#7F77DD" }}>
                ₹{rider.weekly_premium?.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            Zone risk profile
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#5F5E5A" }}>Risk tier</div>
              <div style={{ fontSize: 22, fontWeight: 500, marginTop: 2 }}>
                {riskTier}
              </div>
            </div>
            <span className={`badge ${riskBadge}`}>{riskTier} risk zone</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#5F5E5A",
              background: "#F1EFE8",
              padding: "10px 14px",
              borderRadius: 8,
              lineHeight: 1.6,
            }}
          >
            Premiums are recalculated weekly using live disruption data from
            your operative pincode. If your zone risk changes, your next week's
            premium adjusts automatically.
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>
            What's covered
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🌧", text: "Heavy rain (>50mm/hr) halting deliveries" },
              {
                icon: "🌡",
                text: "Extreme heat (>42°C) making outdoor work unsafe",
              },
              {
                icon: "😷",
                text: "Severe AQI (>300) forcing riders off roads",
              },
              {
                icon: "🚫",
                text: "Curfews, bandhs, and strikes blocking your zone",
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{ display: "flex", gap: 10, fontSize: 13 }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ color: "#5F5E5A" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
