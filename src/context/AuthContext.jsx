import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: true,
    officerId: "IND-DEL-4092",
    officerName: "Officer Vikramaditya Sharma",
    badgeNumber: "BS-092-DEL",
    role: "Senior Immigration Screening Officer",
    clearanceLevel: "TIER-3 (BORDER INTELLIGENCE & BIOMETRIC ACTION)",
    checkpoint: "Delhi Terminal 3 — International Departures / Gate 04",
    checkpointCode: "DEL-T3-G04",
    shift: "Alpha Night Shift (20:00 - 04:00 IST)",
    status: "ONLINE / ACTIVE SCANNER",
    hsmStatus: "HSM ENCRYPTED (FIPS 140-3 LEVEL 4)"
  });

  const login = (officerId, password) => {
    setUser((prev) => ({
      ...prev,
      isAuthenticated: true,
      officerId: officerId || "IND-DEL-4092",
    }));
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
