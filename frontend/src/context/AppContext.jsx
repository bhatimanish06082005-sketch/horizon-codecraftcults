import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const AppContext = createContext(null);

export const calcStressScore = (mode, alerts, activeIntegration) => {
  let alertSeverity, kpiVolatility, externalSignalRisk, anomalyFrequency;

  if (mode === 'crisis') {
    alertSeverity      = 88 + Math.random() * 10;
    externalSignalRisk = 80 + Math.random() * 15;
    anomalyFrequency   = 75 + Math.random() * 15;
    kpiVolatility      = 70 + Math.random() * 15;
  } else if (mode === 'opportunity') {
    alertSeverity      = 5  + Math.random() * 8;
    externalSignalRisk = 8  + Math.random() * 10;
    anomalyFrequency   = 5  + Math.random() * 8;
    kpiVolatility      = 12 + Math.random() * 10;
  } else {
    const crisisAlerts = (alerts || []).filter(a => a.type === 'crisis').length;
    alertSeverity      = Math.min(60, crisisAlerts * 12 + 12 + Math.random() * 10);
    kpiVolatility      = activeIntegration ? 22 + Math.random() * 18 : 5 + Math.random() * 8;
    externalSignalRisk = activeIntegration ? 18 + Math.random() * 18 : 4 + Math.random() * 6;
    anomalyFrequency   = activeIntegration ? 12 + Math.random() * 12 : 3 + Math.random() * 5;
  }

  const score = Math.round(
    0.40 * alertSeverity +
    0.30 * kpiVolatility +
    0.20 * externalSignalRisk +
    0.10 * anomalyFrequency
  );

  return {
    score:              Math.min(100, Math.max(0, score)),
    alertSeverity:      Math.round(alertSeverity),
    kpiVolatility:      Math.round(kpiVolatility),
    externalSignalRisk: Math.round(externalSignalRisk),
    anomalyFrequency:   Math.round(anomalyFrequency),
  };
};

export const AppProvider = ({ children }) => {
  const [apiKeys, setApiKeys]           = useState({ newsapi: '', openweather: '', alphavantage: '', city: 'Mumbai' });
  const [activeIntegration, setActiveIntegration] = useState(null);
  const [mode, setMode]                 = useState('normal');
  const [liveData, setLiveData]         = useState({ news: [], weather: null, stocks: [] });
  const [liveFeed, setLiveFeed]         = useState([]);
  const [alerts, setAlerts]             = useState([]);
  const [warRoomOpen, setWarRoomOpen]   = useState(false);
  const [stressData, setStressData]     = useState({ score: 0, alertSeverity: 0, kpiVolatility: 0, externalSignalRisk: 0, anomalyFrequency: 0 });

  // Use a ref for dismissed so the interval closure always reads the latest value
  const dismissedRef    = useRef(false);
  const prevAbove70Ref  = useRef(false);
  const scoreTickRef    = useRef(null);

  // Keep a ref mirror of warRoomOpen so dismissWarRoom can read it inside closure
  const warRoomOpenRef  = useRef(false);
  useEffect(() => { warRoomOpenRef.current = warRoomOpen; }, [warRoomOpen]);

  useEffect(() => {
    if (scoreTickRef.current) clearInterval(scoreTickRef.current);

    const recalc = () => {
      const result = calcStressScore(mode, alerts, activeIntegration);
      setStressData(result);

      const isAbove70 = result.score > 70;

      // Score just crossed UP through 70 → reset dismiss and open War Room
      if (isAbove70 && !prevAbove70Ref.current) {
        dismissedRef.current = false;
        setWarRoomOpen(true);
      }

      // Score dropped BELOW 70 → close War Room and reset dismiss
      if (!isAbove70 && prevAbove70Ref.current) {
        dismissedRef.current = false;
        setWarRoomOpen(false);
      }

      // Score still above 70 and user hasn't dismissed → keep open
      if (isAbove70 && !dismissedRef.current) {
        setWarRoomOpen(true);
      }

      prevAbove70Ref.current = isAbove70;
    };

    recalc();
    scoreTickRef.current = setInterval(recalc, 4000);
    return () => clearInterval(scoreTickRef.current);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, activeIntegration]);
  // NOTE: alerts intentionally omitted from deps to avoid restart loop;
  // calcStressScore reads alerts via closure snapshot which is fine for this simulation.

  const dismissWarRoom = useCallback(() => {
    dismissedRef.current = true;
    setWarRoomOpen(false);
  }, []);

  // Allow any page to re-open War Room (e.g. the banner button)
  const reopenWarRoom = useCallback(() => {
    dismissedRef.current = false;
    setWarRoomOpen(true);
  }, []);

  const addFeedEvent = useCallback((event) => {
    setLiveFeed(prev => [{
      ...event,
      id:   Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 50));
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [{
      ...alert,
      id:   Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 20));
  }, []);

  const clearSession = useCallback(() => {
    setApiKeys({ newsapi: '', openweather: '', alphavantage: '', city: 'Mumbai' });
    setActiveIntegration(null);
    setLiveData({ news: [], weather: null, stocks: [] });
    setLiveFeed([]);
    setAlerts([]);
    setStressData({ score: 0, alertSeverity: 0, kpiVolatility: 0, externalSignalRisk: 0, anomalyFrequency: 0 });
    setWarRoomOpen(false);
    dismissedRef.current  = false;
    prevAbove70Ref.current = false;
    setMode('normal');
  }, []);

  return (
    <AppContext.Provider value={{
      apiKeys, setApiKeys,
      activeIntegration, setActiveIntegration,
      mode, setMode,
      liveData, setLiveData,
      liveFeed, setLiveFeed, addFeedEvent,
      alerts, setAlerts, addAlert,
      stressData, setStressData,
      warRoomOpen, setWarRoomOpen,
      dismissWarRoom, reopenWarRoom,
      clearSession,
      calcStressScore,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);