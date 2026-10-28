"use client";
import { obtenerPlanesGuardados, eliminarPlanGuardado, esPosibleCrearPlan, guardarPlan } from "@/services/almacenamiento/almacenamientoPlanes";
import { cargarComoTxt } from "@/services/descargadorDeHorarios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, FileUp, FolderOpen, Trash2 } from "lucide-react";

/*
  Página que muestra los planes que el usuario ha guardado
*/
export default function Planes() {
  const [planes, setPlanes] = useState<{ [planId: string]: { [codigoCurso: string]: number } }>({});
  useEffect(() => {
    setPlanes(obtenerPlanesGuardados());
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
            Tus horarios guardados
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Planes
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Consulta y organiza las opciones que guardaste.
          </p>
        </div>
        <BotonImportarTxt />
      </header>
      {Object.keys(planes).length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.03]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-200">
            <FolderOpen size={25} />
          </span>
          <h2 className="mt-5 text-lg font-bold">Todavía no tienes planes</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Guarda un horario que te guste o importa uno desde un archivo .txt.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {Object.entries(planes).map(([planId, cursos]) => (
            <Plan
              key={planId}
              planId={Number(planId)}
              cursos={cursos}
              setPlanes={setPlanes}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/*
  Componente que muestra un plan guardado por el usuario

  @param planId id del plan
  @param cursos cursos del plan
  @param setPlanes función para actualizar los planes
*/
function Plan({ planId, cursos, setPlanes }: { planId: number, cursos: { [codigoCurso: string]: number }, setPlanes: (planes: { [planId: string]: { [codigoCurso: string]: number } }) => void }) {
  const handleEliminar = () => {
    eliminarPlanGuardado(planId);
    setPlanes(obtenerPlanesGuardados());
  }
  return (
    <article className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/80 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-amber-100/70 px-5 py-4 dark:border-white/10 dark:bg-amber-300/10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-200">Horario guardado</p>
          <h2 className="mt-1 text-xl font-bold">Plan {planId}</h2>
        </div>
        <FolderOpen className="text-amber-800 dark:text-amber-200" size={21} />
      </header>
      <div className="flex flex-col gap-3 p-4 sm:flex-row">
        <CursosDelPlan cursos={cursos} />
        <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
          <BotonVerPlan planId={planId} />
          <BotonEliminarPlan planId={planId} funcionEliminar={handleEliminar} />
        </div>
      </div>
    </article>
  )
}

/*
  Botón para ver un plan guardado

  @param planId id del plan
*/
function BotonVerPlan({ planId }: { planId: number }) {
  return (
    <Link href={`/editar/${planId}`} className="primary-action flex-1 px-4 sm:flex-none">
      Ver plan <ArrowUpRight size={15} />
    </Link>
  )
}

/*
  Botón para eliminar un plan guardado

  @param planId id del plan
  @param funcionEliminar función para eliminar el plan
*/
function BotonEliminarPlan({ planId, funcionEliminar }: { planId: number, funcionEliminar: (planId: number) => void }) {
  return (
    <button className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-white/15 dark:hover:border-rose-400/40 dark:hover:bg-rose-400/10 dark:hover:text-rose-200 sm:flex-none" onClick={() => funcionEliminar(planId)}>
      <Trash2 size={15} /> Eliminar
    </button>
  )
}

/*
  Componente que muestra los cursos de un plan

  @param cursos cursos del plan
*/
function CursosDelPlan({ cursos }: { cursos: { [codigoCurso: string]: number } }) {
  return (
    <div className="grid w-full flex-1 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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
function CursoDePlan({ codigoCurso, nrc }: { codigoCurso: string, nrc: number }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-page px-3 py-2 dark:border-white/10 dark:bg-neutral-800">
      <p className="truncate text-sm font-bold text-slate-800 dark:text-amber-200">{codigoCurso}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">NRC {nrc}</p>
    </div>
  )
}

/*
  Boton que permite cargar un plan en txt
*/
function BotonImportarTxt() {
  const handleCargar = () => {
    const importarArchivo = async () => {
      try {
        const contenido = await cargarComoTxt();
        const secciones: { [curso: string]: string } = {};
        for (const linea of contenido.split('\n')) {
          const [curso, nrc] = linea.split(":");
          secciones[curso.trim()] = nrc.trim();
        }
        if (esPosibleCrearPlan()) {
          guardarPlan({ secciones: secciones });
          alert("Plan importado exitosamente");
          window.location.reload();
        } else {
          alert("Ya tienes 5 planes guardados, elimina uno para poder guardar otro");
        }
      } catch (error) {
        console.error("Error al importar archivo:", error);
        alert("Ocurrió un error al importar el archivo.");
      }
    }
    importarArchivo();
  }
  return (
    <button onClick={handleCargar} className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 text-sm font-semibold transition hover:border-amber-400 hover:bg-amber-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
      <FileUp size={17} /> Importar .txt
    </button>
  )
}