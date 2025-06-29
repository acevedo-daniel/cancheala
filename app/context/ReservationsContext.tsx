import React, { createContext, useContext, useState } from 'react';

export type Reservation = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: any; // Puedes usar ImageSourcePropType si prefieres
};

type ReservationsContextType = {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

const ReservationsContext = createContext<ReservationsContextType | undefined>(
  undefined,
);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  return (
    <ReservationsContext.Provider value={{ reservations, setReservations }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context)
    throw new Error('useReservations must be used within ReservationsProvider');
  return context;
};
