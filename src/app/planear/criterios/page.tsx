"use client";
import { useEffect, useState } from "react";
import {
  obtenerCriteriosOrdenamientoGuardados,
  obtenerOrdenamientosDisponibles,
  guardarCriteriosOrdenamiento,
} from "@/services/almacenamiento/almacenamientoCriterio";

/*
  Página para seleccionar el algoritmo de ordenamiento de los horarios
  Muestra las opciones de algoritmos y un botón para ver los horarios
*/
export default function Horarios() {
  const opciones = obtenerOrdenamientosDisponibles();
  const [criterios, setCriterios] = useState(["sin huecos"]);
  useEffect(() => {
    setCriterios(obtenerCriteriosOrdenamientoGuardados());
  }, []);
  const cambiarCriterio = (indice: number, valor: string) => {
    const nuevosCriterios = [...criterios];
    if (valor === "") {
      nuevosCriterios.splice(indice, 1);
    } else {
      nuevosCriterios[indice] = valor;
    }
    const unicos = nuevosCriterios.filter(
      (criterio, posicion) => nuevosCriterios.indexOf(criterio) === posicion,
    );
    setCriterios(unicos);
    guardarCriteriosOrdenamiento(unicos);
  };
  return (
    <div className="flex flex-col items-center mt-7">
      <h2 className='text-2xl font-semibold mb-6'>¿Cómo quieres tu horario?</h2>
      <label className="mb-4 flex flex-col gap-2 text-lg">
        Criterio principal
        <select
          className="rounded border border-gray-500 bg-white p-2 text-black"
          value={criterios[0] ?? ""}
          onChange={(event) => cambiarCriterio(0, event.target.value)}
        >
          {opciones.map((opcion) => (
            <option key={opcion} value={opcion}>{formatearOpcion(opcion)}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-lg">
        Criterio secundario (opcional)
        <select
          className="rounded border border-gray-500 bg-white p-2 text-black"
          value={criterios[1] ?? ""}
          onChange={(event) => cambiarCriterio(1, event.target.value)}
        >
          <option value="">Sin criterio secundario</option>
          {opciones
            .filter((opcion) => opcion !== criterios[0])
            .map((opcion) => (
              <option key={opcion} value={opcion}>{formatearOpcion(opcion)}</option>
            ))}
        </select>
      </label>
    </div>
  );
}

function formatearOpcion(opcion: string): string {
  return opcion.charAt(0).toUpperCase() + opcion.slice(1);
}
