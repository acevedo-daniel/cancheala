import React, { createContext, useState } from 'react';

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

  const addReserva = (reserva) => {
    setReservas((prev) => [
      ...prev,
      { ...reserva, id: Date.now(), cancha: mockCanchas[0] },
    ]);
  };

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

  return (
    <ReservationsContext.Provider
      value={{ reservas, favoritos, addReserva, cancelarReserva, toggleFavorito, mockCanchas }}
    >
      {children}
    </ReservationsContext.Provider>
  );
}