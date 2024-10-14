"use client";
import { obtenerPlanesGuardados, eliminarPlanGuardado } from "@/services/almacenamiento/almacenamientoPlanes";
import Link from "next/link";
import { useEffect, useState } from "react";

/*
  Página que muestra los planes que el usuario ha guardado
*/
export default function Planes() {
  const [planes, setPlanes] = useState<{[planId: string]: {[codigoCurso: string]: number}}>({});
  useEffect(() => {
    setPlanes(obtenerPlanesGuardados());
  }, []);

  return (
    <div className="mx-auto w-[80%] min-w-44 pt-8">
      <h1 className="text-2xl font-semibold">Planes</h1>
      <p className="text-xl mt-3 mb-9">Aquí se muestran los planes que has guardado</p>
      {
        Object.entries(planes).map(([planId, cursos]) => (
          <Plan key={planId} planId={Number(planId)} cursos={cursos} setPlanes={setPlanes} />
        ))
      }
    </div>
  )
}

/*
  Componente que muestra un plan guardado por el usuario

  @param planId id del plan
  @param cursos cursos del plan
  @param setPlanes función para actualizar los planes
*/
function Plan({planId, cursos, setPlanes}: {planId : number, cursos: {[codigoCurso: string]: number}, setPlanes: (planes: {[planId: string]: {[codigoCurso: string]: number}}) => void }) {
  const handleEliminar = () => {
    eliminarPlanGuardado(planId);
    setPlanes(obtenerPlanesGuardados());
  }
  return (
    <div className="bg-gray-200 dark:bg-neutral-600 border-2 border-black my-4">
      <p className="text-2xl font-semibold bg-yellow-200 dark:bg-yellow-300 border-b-2 border-black text-center dark:text-black">Plan {planId}</p>
        <div className="flex flex-col sm:flex-row">
          <CursosDelPlan cursos={cursos} />
          <div className="p-2 space-y-2">
            <BotonVerPlan planId={planId} />
            <BotonEliminarPlan planId={planId} funcionEliminar={handleEliminar} />
          </div>
        </div>
    </div>
  )
}

/*
  Botón para ver un plan guardado

  @param planId id del plan
*/
function BotonVerPlan({planId}: {planId: number}) {
  return (
    <Link href={`/editar/${planId}`} className="w-40 h-12 mx-auto bg-yellow-300 dark:bg-yellow-400 border-2 border-black hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-colors duration-300 ease-in-out flex items-center justify-center dark:text-black">
      Ver
    </Link>
  )
}

/*
  Botón para eliminar un plan guardado

  @param planId id del plan
  @param funcionEliminar función para eliminar el plan
*/
function BotonEliminarPlan({planId, funcionEliminar}: {planId: number, funcionEliminar: (planId: number) => void}) {
  return (
    <button className="w-40 h-12 mx-auto block bg-yellow-300 dark:bg-yellow-400 border-2 border-black hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-colors duration-300 ease-in-out dark:text-black" onClick={() => funcionEliminar(planId)}>
      Eliminar
    </button>
  )
}

/*
  Componente que muestra los cursos de un plan

  @param cursos cursos del plan
*/
function CursosDelPlan({cursos}: {cursos: {[codigoCurso: string]: number}}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full p-2">
      {
        Object.entries(cursos).map(([codigoCurso, nrc]) => (
          <CursoDePlan key={codigoCurso} codigoCurso={codigoCurso} nrc={nrc} />
        ))
      }
    </div>
  )
}

/*
  Componente que muestra un curso de un plan

  @param codigoCurso código del curso
  @param nrc nrc del curso
*/
function CursoDePlan({codigoCurso, nrc}: {codigoCurso: string, nrc: number}) {
  return (
    <div className="border border-yellow-900 dark:border-orange-400 h-16 mx-auto min-w-24 bg-yellow-50 dark:bg-neutral-700">
      <p className="text-lg font-semibold text-center text-yellow-900 dark:text-orange-400" >{codigoCurso}</p>
      <p className="text-lg text-center" >{nrc}</p>
    </div>
  )
}