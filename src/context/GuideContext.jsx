import React, { createContext, useContext, useState, useEffect } from 'react';

const GuideContext = createContext();

export const GuideProvider = ({ children }) => {
  const [guideEnabled, setGuideEnabled] = useState(() => {
    const saved = localStorage.getItem('guideEnabled');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('guideEnabled', guideEnabled);
  }, [guideEnabled]);

  return (
    <GuideContext.Provider value={{ guideEnabled, setGuideEnabled }}>
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => useContext(GuideContext);
