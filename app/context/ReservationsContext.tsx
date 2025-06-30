import React, { createContext, useState } from 'react';

<<<<<<< HEAD
export const ReservationsContext = createContext({
  reservas: [],
  favoritos: [],
  addReserva: () => {},
  cancelarReserva: () => {},
  toggleFavorito: () => {},
});

const mockCanchas = [
  {
    id: 1,
    nombre: 'Las Cortadas Padel Club',
    direccion: 'San Lorenzo 555, Resistencia Chaco',
    rating: 4.5,
    precio: 10000,
    imagen: require('../../assets/padel1.png'),
  },
  {
    id: 2,
    nombre: 'HD Padel',
    direccion: 'Jose Hernandez 567, Resistencia Chaco',
    rating: 9.8,
    precio: 10000,
    imagen: require('../../assets/padel2.png'),
  },
  {
    id: 3,
    nombre: 'Central Norte Padel Club',
    direccion: 'Av Hernandarias, Resistencia Chaco',
    rating: 8.2,
    precio: 10000,
    imagen: require('../../assets/padel3.png'),
  },
];

export function ReservationsProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [favoritos, setFavoritos] = useState([1, 2]);
=======
export type Reservation = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: any; // Puedes usar ImageSourcePropType si prefieres
};
>>>>>>> origin/main

  const addReserva = (reserva) => {
    setReservas((prev) => [
      ...prev,
      { ...reserva, id: Date.now(), cancha: mockCanchas[0] },
    ]);
  };

<<<<<<< HEAD
  const cancelarReserva = (reserva) => {
    setReservas((prev) => prev.filter((r) => r.id !== reserva.id));
  };

  const toggleFavorito = (canchaId) => {
    setFavoritos((prev) =>
      prev.includes(canchaId)
        ? prev.filter((id) => id !== canchaId)
        : [...prev, canchaId]
    );
  };

=======
const ReservationsContext = createContext<ReservationsContextType | undefined>(
  undefined,
);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
>>>>>>> origin/main
  return (
    <ReservationsContext.Provider
      value={{ reservas, favoritos, addReserva, cancelarReserva, toggleFavorito, mockCanchas }}
    >
      {children}
    </ReservationsContext.Provider>
  );
<<<<<<< HEAD
}
=======
};

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context)
    throw new Error('useReservations must be used within ReservationsProvider');
  return context;
};

// Default export para evitar el warning de Expo Router
export default ReservationsProvider;
>>>>>>> origin/main
