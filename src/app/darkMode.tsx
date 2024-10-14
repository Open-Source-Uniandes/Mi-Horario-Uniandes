'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Image from "next/image";

/*
  Estados para los modos de tema
*/
const state = {
  darkMode: "dark",
  lightMode: "light",
};


/*
  Contexto que comparte el estado del modo oscuro
*/
const DarkModeContext = createContext({
  mode: state.lightMode,
  cambiarTema: () => {},
});


/*
  Componente principal que maneja el modo oscuro
*/
export default function DarkMode({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState(state.lightMode);
  const [isLoaded, setIsLoaded] = useState(false);

  // Evita el acceso al localStorage durante la renderización inicial
  useEffect(() => {
    if (typeof window != 'undefined') {
      const savedMode = localStorage.getItem('mode');
      setMode(savedMode ? savedMode : state.lightMode);
      setIsLoaded(true);
    }
  }, []);

  // Cambia el estado del modo entre oscuro u oscuro y lo almacena en el localStorage
  const cambiarTema = () => {
    setMode((prevMode) => {
      const newMode = prevMode == state.lightMode ? state.darkMode : state.lightMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mode', newMode);
      }
      return newMode;
    });
  };

  // No muestra la pagina hasta que se hayan cargado todos los elementos
  if (!isLoaded) {
    return null;
  }

  return (
    <DarkModeContext.Provider value={{ mode, cambiarTema }}>
      <div className={`${mode}`}>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}

/*
  Botón que cambia el tema de claro a oscuro o de oscuro a claro 
*/
export function BotonTematico() {
  const { mode, cambiarTema } = useContext(DarkModeContext);

  return (
    <button className="fixed w-9 h-9 bottom-9 rounded-full" onClick={cambiarTema}>
      <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/modoOscuro.svg" alt="Modo Oscuro" width={100} height={100}/>
    </button>
  );
}
