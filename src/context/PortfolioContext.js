import React, { createContext, useState, useEffect } from 'react';

export const PortfolioContext = createContext([]);

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addPosition = (position) => {
    console.log('Nueva posición agregada al contexto:', position);
    setPortfolio((prev) => [...prev, position]);
  };

  const removePosition = (symbol) => {
    setPortfolio((prev) => prev.filter((p) => p.symbol !== symbol));
  };

  return (
    <PortfolioContext.Provider
      value={{ portfolio, addPosition, removePosition }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
