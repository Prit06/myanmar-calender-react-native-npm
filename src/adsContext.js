import React, { useState, createContext, useContext } from 'react';

export const AdContext = createContext();

export const AdProvider = ({ children }) => {
  const [adCount, setAdCount] = useState(0);

  const incrementAdCount = () => setAdCount(adCount + 1);
  const resetAdCount = () => setAdCount(0);

  return (
    <AdContext.Provider value={{ adCount, incrementAdCount, resetAdCount }}>
      {children}
    </AdContext.Provider>
  );
};






