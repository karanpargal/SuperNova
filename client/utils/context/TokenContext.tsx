"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface TokenContextType {
  hasToken: boolean;
  setHasToken: (token: boolean) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    }
  }, []);

  return (
    <TokenContext.Provider value={{ hasToken, setHasToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
