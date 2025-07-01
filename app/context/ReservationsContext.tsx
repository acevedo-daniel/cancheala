import React, { createContext, useState, useContext } from 'react';

export type Reservation = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: any; // Puedes usar ImageSourcePropType si prefieres
};

const mockCanchas = [
  {
    id: 1,
    nombre: 'Las Cortadas Padel Club',
    direccion: 'San Lorenzo 555, Resistencia Chaco',
    rating: 4.5,
    precio: 10000,
    imagen: require('../../assets/images/padel1.png'),
  },
  {
    id: 2,
    nombre: 'HD Padel',
    direccion: 'Jose Hernandez 567, Resistencia Chaco',
    rating: 9.8,
    precio: 10000,
    imagen: require('../../assets/images/padel2.png'),
  },
  {
    id: 3,
    nombre: 'Central Norte Padel Club',
    direccion: 'Av Hernandarias, Resistencia Chaco',
    rating: 8.2,
    precio: 10000,
    imagen: require('../../assets/images/padel3.png'),
  },
];

export type ReservationsContextType = {
  reservas: any[];
  favoritos: number[];
  addReserva: (reserva: any) => void;
  cancelarReserva: (reserva: any) => void;
  toggleFavorito: (canchaId: number) => void;
  mockCanchas: typeof mockCanchas;
};

const ReservationsContext = createContext<ReservationsContextType | undefined>(
  undefined,
);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([1, 2]);

  const addReserva = (reserva: any) => {
    setReservas((prev) => [
      ...prev,
      { ...reserva, id: Date.now(), cancha: mockCanchas[0] },
    ]);
  };

  const cancelarReserva = (reserva: any) => {
    setReservas((prev) => prev.filter((r) => r.id !== reserva.id));
  };

  const toggleFavorito = (canchaId: number) => {
    setFavoritos((prev) =>
      prev.includes(canchaId)
        ? prev.filter((id) => id !== canchaId)
        : [...prev, canchaId],
    );
  };

  return (
    <ReservationsContext.Provider
      value={{
        reservas,
        favoritos,
        addReserva,
        cancelarReserva,
        toggleFavorito,
        mockCanchas,
      }}
    >
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

export default ReservationsProvider;
