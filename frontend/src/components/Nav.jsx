import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "0.5px solid rgba(0,0,0,0.1)",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <span style={{ fontWeight: 500, fontSize: 16, color: "#7F77DD" }}>
        D.A.S.H
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {[
          { to: "/dashboard", label: "Dashboard" },
          { to: "/policy", label: "Policy" },
          { to: "/claims", label: "Claims" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              fontSize: 14,
              padding: "6px 14px",
              borderRadius: 8,
              color: isActive ? "#7F77DD" : "#5F5E5A",
              background: isActive ? "#EEEDFE" : "transparent",
              fontWeight: isActive ? 500 : 400,
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
