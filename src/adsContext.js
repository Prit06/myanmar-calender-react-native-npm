import React, { useState, createContext, useContext } from 'react';

export const AdContext = createContext();


export const AdProvider = ({ children, isConnected }) => {
  const [adCount, setAdCount] = useState(0);
  const [apiData, setApiData] = useState(null);

  const incrementAdCount = () => setAdCount(adCount + 1);
  const resetAdCount = () => setAdCount(0);
  const setApiDataFun = (e) => {
    console.log("e", e);
    setApiData(e)
  };

  return (
    <AdContext.Provider value={{ adCount, incrementAdCount, resetAdCount, isConnected, setApiDataFun, apiData }}>
      {children}
    </AdContext.Provider>
  );
};






