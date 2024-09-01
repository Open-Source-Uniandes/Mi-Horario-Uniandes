"use client";
import { useState, ChangeEvent } from "react";
import Link from "next/link";
import {obtenerOrdenamientosDisponibles, guardarAlgoritmoOrdenamiento} from "@/services/almacenamiento/almacenamientoCriterio";

/*
  Página para seleccionar el algoritmo de ordenamiento de los horarios
  Muestra las opciones de algoritmos y un botón para ver los horarios
*/
export default function Horarios() {
  const handleSeleccionDeCriterio = (event: ChangeEvent<HTMLInputElement>) => {
    guardarAlgoritmoOrdenamiento(event.target.value);
  };
  return (
    <div className="flex flex-col items-center mt-7">
      <h2 className='text-2xl font-semibold mb-6'>¿Cómo quieres tu horario?</h2>
      {
        obtenerOrdenamientosDisponibles().map((algoritmo, index) => (
          <InputRadio key={index} opcion={algoritmo} handleSeleccionDeCriterio={handleSeleccionDeCriterio} />
        ))
      }
    </div>
  );
}

/*
  Componente para mostrar una opción de algoritmo de ordenamiento

  @param opcion nombre del algoritmo
  @param handleSeleccionDeCriterio función que se ejecuta cuando se selecciona la opción
*/
function InputRadio({ opcion, handleSeleccionDeCriterio } : { opcion:string , handleSeleccionDeCriterio: (event: ChangeEvent<HTMLInputElement> ) => void }) {
  return (
    <div className="mb-4">
      <input
        className="w-4 h-4 appearance-none rounded-full border-2 border-gray-700 bg-gray-300 checked:bg-yellow-300 hover:border-yellow-600"
        type="radio"
        id={opcion}
        name="horario"
        value={opcion}
        onChange={handleSeleccionDeCriterio}
      />
      <label className="text-lg ml-2" htmlFor={opcion}>{opcion.charAt(0).toUpperCase() + opcion.slice(1)}</label>
    </div>
  );
}
