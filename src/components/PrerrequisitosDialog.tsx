"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, LoaderCircle, Network, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Seccion from "@/models/Seccion";
import {
  obtenerRequisitosDeCurso,
  obtenerRequisitosDeSeccion,
  type Requisito,
} from "@/services/prerrequisitos";
import GrafoPrerrequisitos, { type EstadoExpansion } from "./GrafoPrerrequisitos";

export default function PrerrequisitosDialog({ seccion }: { seccion: Seccion }) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [requisitos, setRequisitos] = useState<Requisito | null>(null);
  const [expansiones, setExpansiones] = useState<Record<string, EstadoExpansion>>({});
  const [intento, setIntento] = useState(0);
  const codigoRaiz = `${seccion.curso.programa} ${seccion.curso.curso}`;

  useEffect(() => {
    if (!abierto) return;
    let cancelado = false;
    setCargando(true);
    setError("");
    obtenerRequisitosDeSeccion(seccion.periodo, seccion.ptrm, seccion.nrc)
      .then((resultado) => {
        if (!cancelado) setRequisitos(resultado);
      })
      .catch((fallo: unknown) => {
        if (!cancelado) setError(fallo instanceof Error ? fallo.message : "No se pudieron cargar los prerrequisitos.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => { cancelado = true; };
  }, [abierto, intento, seccion.nrc, seccion.periodo, seccion.ptrm]);

  const expandir = useCallback(async (ruta: string, codigo: string, ancestros: string[]) => {
    if (ancestros.includes(codigo)) return;
    setExpansiones((actuales) => ({ ...actuales, [ruta]: { estado: "cargando" } }));
    try {
      const resultado = await obtenerRequisitosDeCurso(seccion.periodo, codigo);
      setExpansiones((actuales) => ({
        ...actuales,
        [ruta]: resultado
          ? { estado: "cargado", requisitos: resultado.requisitos }
          : { estado: "sin-oferta" },
      }));
    } catch (fallo) {
      setExpansiones((actuales) => ({
        ...actuales,
        [ruta]: {
          estado: "error",
          mensaje: fallo instanceof Error ? fallo.message : "Error al consultar el curso.",
        },
      }));
    }
  }, [seccion.periodo]);

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-300/10"
          aria-label={`Ver prerrequisitos de ${codigoRaiz}`}
        >
          <Network size={14} /> Ver prerrequisitos
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[92vh] w-[96vw] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl focus:outline-none dark:border-white/10 dark:bg-neutral-900 sm:h-[88vh] sm:w-[90vw] xl:w-[82vw]">
          <header className="flex items-start justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10 sm:px-6">
            <div>
              <Dialog.Title className="text-lg font-bold">Prerrequisitos de {codigoRaiz}</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                NRC {seccion.nrc} · Período {seccion.periodo}. Expande cursos para explorar sus requisitos.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Cerrar prerrequisitos"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </header>

          <div className="flex flex-wrap gap-3 border-b border-slate-200 px-4 py-2 text-xs dark:border-white/10 sm:px-6">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-sky-400" /> Y: debes cumplir todos</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-orange-400" /> O: basta con uno</span>
          </div>

          <main className="relative min-h-0 flex-1">
            {cargando && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm font-medium dark:bg-neutral-900/80">
                <LoaderCircle className="mr-2 animate-spin" size={18} /> Cargando prerrequisitos...
              </div>
            )}
            {error && (
              <div role="alert" className="m-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-400/10 dark:text-rose-200">
                <p className="flex items-center gap-2"><AlertCircle size={16} />{error}</p>
                <button type="button" className="mt-2 font-semibold underline" onClick={() => setIntento((actual) => actual + 1)}>
                  Reintentar
                </button>
              </div>
            )}
            {!cargando && !error && !requisitos && (
              <p className="p-6 text-center text-sm text-slate-600 dark:text-slate-300">La API no registra prerrequisitos para este curso.</p>
            )}
            {!cargando && requisitos && (
              <GrafoPrerrequisitos
                raiz={codigoRaiz}
                requisitos={requisitos}
                expansiones={expansiones}
                expandir={expandir}
              />
            )}
          </main>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
