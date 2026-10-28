"use client";
import { useEffect, useState } from "react";
import {
  obtenerCriteriosOrdenamientoGuardados,
  obtenerOrdenamientosDisponibles,
  guardarCriteriosOrdenamiento,
} from "@/services/almacenamiento/almacenamientoCriterio";
import { ArrowDownUp, SlidersHorizontal, Sparkles } from "lucide-react";
import { sonCriteriosIncompatibles } from "@/services/criteriosOrdenamiento";

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
    if (
      indice === 0 &&
      nuevosCriterios[1] &&
      sonCriteriosIncompatibles(nuevosCriterios[0], nuevosCriterios[1])
    ) {
      nuevosCriterios.splice(1, 1);
    }
    const unicos = nuevosCriterios.filter(
      (criterio, posicion) => nuevosCriterios.indexOf(criterio) === posicion,
    );
    setCriterios(unicos);
    guardarCriteriosOrdenamiento(unicos);
  };
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
          Personaliza la búsqueda
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          ¿Cómo quieres tu horario?
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
          Define qué características son más importantes. Puedes combinar un
          criterio principal con uno secundario.
        </p>
      </header>
      <section className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-8">
        <div className="flex items-start gap-4 border-b border-slate-200/80 pb-6 dark:border-white/10">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-200">
            <SlidersHorizontal size={22} />
          </span>
          <div>
            <h2 className="text-lg font-bold">Orden de preferencias</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Los horarios se ordenan primero por tu criterio principal y, en
              caso de empate, por el secundario.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span className="accent-mark flex h-6 w-6 items-center justify-center rounded-full text-xs">
                1
              </span>
              Criterio principal
            </span>
            <select
              className="field-theme h-12 rounded-xl px-3 text-base font-medium"
              value={criterios[0] ?? ""}
              onChange={(event) => cambiarCriterio(0, event.target.value)}
            >
              {opciones.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {formatearOpcion(opcion)}
                </option>
              ))}
            </select>
          </label>
          <ArrowDownUp
            className="hidden text-slate-400 md:mb-3 md:block"
            size={20}
          />
          <label className="flex flex-col gap-2 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-500 dark:border-white/20 dark:text-slate-300">
                2
              </span>
              Criterio secundario
              <span className="font-normal text-slate-600 dark:text-slate-400">(opcional)</span>
            </span>
            <select
              className="field-theme h-12 rounded-xl px-3 text-base font-medium"
              value={criterios[1] ?? ""}
              onChange={(event) => cambiarCriterio(1, event.target.value)}
            >
              <option value="">Sin criterio secundario</option>
              {opciones
                .filter(
                  (opcion) =>
                    opcion !== criterios[0] &&
                    !sonCriteriosIncompatibles(criterios[0] ?? "", opcion),
                )
                .map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {formatearOpcion(opcion)}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </section>
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-100/70 p-4 text-sm leading-6 text-amber-950 dark:bg-amber-300/10 dark:text-amber-100">
        <Sparkles className="mt-0.5 shrink-0" size={18} />
        <p>
          Tus preferencias se guardan automáticamente y se usan al generar tus
          horarios.
        </p>
      </div>
    </div>
  );
}

function formatearOpcion(opcion: string): string {
  return opcion.charAt(0).toUpperCase() + opcion.slice(1);
}
