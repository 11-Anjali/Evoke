import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getZoneScore, registerRider } from "../api";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Lucknow",
  "Jaipur",
  "Nagpur",
];
const PLATFORMS = ["Zomato", "Swiggy"];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "Mumbai",
    pincode: "",
    platform: "Zomato",
    rider_platform_id: "",
    upi_id: "",
  });

  const [premium, setPremium] = useState(null);
  const [zoneData, setZoneData] = useState(null);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function sendOtp() {
    if (phone.length < 10) return setError("Enter a valid 10-digit number");
    setError("");
    setOtpSent(true);
  }

  async function verifyOtp() {
    if (otp.length !== 6) return setError("Enter the 6-digit OTP");
    setError("");
    setStep(2);
  }

  async function calculatePremium() {
    if (!form.pincode || form.pincode.length < 6)
      return setError("Enter valid pincode");
    setLoading(true);
    setError("");
    try {
      const data = await getZoneScore(form.pincode);
      setZoneData(data);
      const multipliers = {
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
      const m = multipliers[form.city] || 1.0;
      const raw = 70 * data.zone_score * m;
      setPremium(Math.min(Math.max(raw, 70), 200).toFixed(0));
      setStep(3);
    } catch {
      setError("Could not fetch zone data. Check pincode.");
    }
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const data = await registerRider({ ...form, phone });
      localStorage.setItem("dash_rider_id", data.rider.id);
      localStorage.setItem("dash_rider", JSON.stringify(data.rider));
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F1EFE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "#7F77DD",
              marginBottom: 4,
            }}
          >
            D.A.S.H
          </div>
          <div style={{ fontSize: 14, color: "#5F5E5A" }}>
            Disruption Aware Safety Harbour
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: step >= n ? "#7F77DD" : "#B4B2A9",
              }}
            />
          ))}
        </div>

        <div className="card">
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>
                  Verify your number
                </div>
                <div style={{ fontSize: 13, color: "#5F5E5A" }}>
                  We'll send a one-time password
                </div>
              </div>

              <div>
                <label>Mobile number</label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>

              {!otpSent ? (
                <button className="primary" onClick={sendOtp}>
                  Send OTP
                </button>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#1D9E75",
                      background: "#E1F5EE",
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    OTP sent to +91 {phone} — use any 6 digits for demo
                  </div>
                  <div>
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <button className="primary" onClick={verifyOtp}>
                    Verify & Continue
                  </button>
                </>
              )}
              {error && (
                <div style={{ fontSize: 13, color: "#E24B4A" }}>{error}</div>
              )}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>
                  Your profile
                </div>
                <div style={{ fontSize: 13, color: "#5F5E5A" }}>
                  Tell us about yourself and your zone
                </div>
              </div>

              <div>
                <label>Full name</label>
                <input
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={set("name")}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label>City</label>
                  <select value={form.city} onChange={set("city")}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Pincode</label>
                  <input
                    placeholder="400051"
                    value={form.pincode}
                    onChange={set("pincode")}
                    maxLength={6}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label>Platform</label>
                  <select value={form.platform} onChange={set("platform")}>
                    {PLATFORMS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Partner ID</label>
                  <input
                    placeholder="ZOM-4521"
                    value={form.rider_platform_id}
                    onChange={set("rider_platform_id")}
                  />
                </div>
              </div>

              <div>
                <label>UPI ID</label>
                <input
                  placeholder="rahul@upi"
                  value={form.upi_id}
                  onChange={set("upi_id")}
                />
              </div>

              <button
                className="primary"
                onClick={calculatePremium}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate my premium →"}
              </button>
              {error && (
                <div style={{ fontSize: 13, color: "#E24B4A" }}>{error}</div>
              )}
            </div>
          )}

          {step === 3 && zoneData && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>
                  Your coverage plan
                </div>
                <div style={{ fontSize: 13, color: "#5F5E5A" }}>
                  Based on your zone and city
                </div>
              </div>

              <div
                style={{
                  background: "#EEEDFE",
                  borderRadius: 12,
                  padding: 20,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 13, color: "#534AB7", marginBottom: 4 }}
                >
                  Weekly premium
                </div>
                <div
                  style={{ fontSize: 40, fontWeight: 500, color: "#3C3489" }}
                >
                  ₹{premium}
                </div>
                <div style={{ fontSize: 12, color: "#534AB7", marginTop: 4 }}>
                  Auto-deducted every Monday
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  { label: "Zone score", value: zoneData.zone_score },
                  {
                    label: "Status",
                    value: zoneData.flagged ? "🔴 Flagged" : "✅ Safe",
                  },
                  { label: "Driver", value: zoneData.dominant_factor },
                ].map(({ label, value }) => (
                  <div key={label} className="metric-card">
                    <div className="label">{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#5F5E5A",
                  background: "#F1EFE8",
                  padding: "10px 14px",
                  borderRadius: 8,
                }}
              >
                If your zone is disrupted, compensation is auto-transferred to{" "}
                {form.upi_id || "your UPI"} — no claims needed.
              </div>

              <button className="primary" onClick={submit} disabled={loading}>
                {loading ? "Activating..." : "Activate coverage"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
