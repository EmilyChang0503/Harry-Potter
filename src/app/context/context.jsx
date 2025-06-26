'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CharacterContext = createContext();

export function CharacterProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch('https://hp-api.onrender.com/api/characters');
        if (!res.ok) throw new Error('Failed to fetch characters');
        const data = await res.json();
        setCharacters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  return (
    <CharacterContext.Provider value={{ characters, loading, error }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters() {
  return useContext(CharacterContext);
}