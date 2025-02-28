import React, { useState, createContext, useContext, useEffect } from 'react';
import { getMCalenderData } from '../calenderData/calenderData';

export const AdContext = createContext();


export const AdProvider = ({ children, isConnected }) => {
  const [adCount, setAdCount] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [emCalData, setEmCalData] = useState(null);

  const incrementAdCount = () => setAdCount(adCount + 1);
  const resetAdCount = () => setAdCount(0);
  const setApiDataFun = (e) => {
    console.log("e", e);
    setApiData(e)
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMCalenderData(null, null, 0, 0);
        setEmCalData(data)
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []);
  
  return (
    <AdContext.Provider value={{ adCount, incrementAdCount, resetAdCount, isConnected, setApiDataFun, apiData, emCalData }}>
      {children}
    </AdContext.Provider>
  );
};






