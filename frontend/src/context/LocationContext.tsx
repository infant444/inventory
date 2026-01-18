/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Location {
  locationId: string;
  locationCode: string;
  locationName: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface LocationContextType {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<Location | null>(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : null;
  });

  const setSelectedLocation = (location: Location | null) => {
    setSelectedLocationState(location);
    if (location) {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
    } else {
      localStorage.removeItem('selectedLocation');
    }
  };

  const clearLocation = () => {
    setSelectedLocationState(null);
    localStorage.removeItem('selectedLocation');
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
