import { useState, useEffect, useCallback } from "react";
import { getZoneScore } from "../api";

export default function Dashboard() {
  const [rider, setRider] = useState(null);
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const r = localStorage.getItem("dash_rider");
    if (r) setRider(JSON.parse(r));
  }, []);

  const refresh = useCallback(async () => {
    const r = JSON.parse(localStorage.getItem("dash_rider") || "{}");
    if (!r.pincode) return;
    setLoading(true);
    try {
      const data = await getZoneScore(r.pincode);
      setZone(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const scoreColor =
    zone?.zone_score >= 0.7
      ? "#E24B4A"
      : zone?.zone_score >= 0.4
        ? "#BA7517"
        : "#1D9E75";

  const scoreBg =
    zone?.zone_score >= 0.7
      ? "#FCEBEB"
      : zone?.zone_score >= 0.4
        ? "#FAEEDA"
        : "#E1F5EE";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 500 }}>
          {rider ? `Hey, ${rider.name.split(" ")[0]}` : "Dashboard"}
        </div>
        <div style={{ fontSize: 13, color: "#5F5E5A", marginTop: 2 }}>
          {rider?.city} · Pincode {rider?.pincode} · {rider?.platform}
        </div>
      </div>

      {loading && !zone ? (
        <div style={{ textAlign: "center", padding: 40, color: "#5F5E5A" }}>
          Loading zone data...
        </div>
      ) : zone ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            className="card"
            style={{
              background: scoreBg,
              border: `0.5px solid ${scoreColor}30`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: scoreColor,
                    fontWeight: 500,
                    marginBottom: 4,
                  }}
                >
                  {zone.flagged
                    ? "🔴 Zone flagged — disruption active"
                    : "✅ Zone clear — no disruption"}
                </div>
                <div
                  style={{ fontSize: 36, fontWeight: 500, color: scoreColor }}
                >
                  {zone.zone_score.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: scoreColor, marginTop: 2 }}>
                  disruption score · driven by {zone.dominant_factor}
                </div>
              </div>
              <button
                onClick={refresh}
                style={{ fontSize: 12, padding: "6px 12px" }}
              >
                Refresh
              </button>
            </div>
            {lastUpdated && (
              <div
                style={{
                  fontSize: 11,
                  color: scoreColor,
                  marginTop: 12,
                  opacity: 0.7,
                }}
              >
                Last updated {lastUpdated} · auto-refreshes every 15 min
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {[
              {
                label: "Weather score",
                value: zone.breakdown.weather.toFixed(2),
              },
              {
                label: "Traffic score",
                value: zone.breakdown.traffic.toFixed(2),
              },
              {
                label: "Social score",
                value: zone.breakdown.social.toFixed(2),
              },
            ].map(({ label, value }) => (
              <div key={label} className="metric-card">
                <div className="label">{label}</div>
                <div className="value" style={{ fontSize: 20 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {zone.social_keywords?.length > 0 && (
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
                Live news triggers
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {zone.social_keywords.map((kw) => (
                  <span key={kw} className="badge amber">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {zone.weather_raw?.temp && (
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
                Live conditions — {zone.weather_raw.city}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { label: "Temperature", value: `${zone.weather_raw.temp}°C` },
                  {
                    label: "Rain (1h)",
                    value: `${zone.weather_raw.rain || 0} mm`,
                  },
                  {
                    label: "Wind",
                    value: `${zone.weather_raw.wind?.toFixed(0)} km/h`,
                  },
                  {
                    label: "Condition",
                    value: zone.weather_raw.weatherMain || "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label} style={{ fontSize: 13 }}>
                    <span style={{ color: "#5F5E5A" }}>{label}: </span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#5F5E5A" }}>
                Weekly premium
              </div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>
                ₹{rider?.weekly_premium?.toFixed(0) || "—"}
              </div>
            </div>
            <span className="badge green">Coverage active</span>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 40, color: "#5F5E5A" }}>
          Could not load zone data.
        </div>
      )}
    </div>
  );
}
