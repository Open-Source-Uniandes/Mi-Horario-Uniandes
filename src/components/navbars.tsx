"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { BotonTematico } from "@/app/darkMode";

/**
 * Muestra la barra de navegación del área de planeación.
 * @returns La marca del sitio y el control del tema.
 */
export function NavbarSimple() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/70 bg-page/90 backdrop-blur-xl dark:border-white/10 dark:bg-page-dark/90">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8"
      >
        <MarcaMiHorario className="gap-3" />
        <BotonTematico />
      </nav>
    </header>
  );
}

function MarcaMiHorario({
  className,
  compacto = false,
}: {
  className: string;
  compacto?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`flex items-center font-bold tracking-tight text-slate-900 dark:text-white ${className}`}
    >
      <span className={`flex items-center justify-center rounded-xl bg-amber-300 text-slate-950 ${compacto ? "h-8 w-8" : "h-9 w-9"}`}>
        <GraduationCap size={compacto ? 19 : 21} />
      </span>
      <span className={compacto ? "hidden sm:inline" : ""}>
        Mi Horario
        <span className="ml-1 font-medium text-slate-500 dark:text-slate-400">
          Uniandes
        </span>
      </span>
    </Link>
  );
}

/**
 * Muestra la navegación de las vistas para ver y editar horarios.
 */
export function NavbarHorario() {
  return <BarraHorario />;
}

/**
 * Presenta la marca, el enlace de regreso y controles opcionales de horario.
 * @param anterior Acción opcional para mostrar el horario previo.
 * @param siguiente Acción opcional para mostrar el siguiente horario.
 * @returns La barra superior de las vistas de calendario.
 */
function BarraHorario({
  anterior,
  siguiente,
}: {
  anterior?: () => void;
  siguiente?: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/70 bg-page/90 backdrop-blur-xl dark:border-white/10 dark:bg-page-dark/90">
      <nav
        aria-label="Navegación de horario"
        className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8"
      >
        <Link
          href="/planear"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-amber-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          <span className="hidden sm:inline">Seguir planeando</span>
          <span className="sm:hidden">Volver</span>
        </Link>
        <MarcaMiHorario className="absolute left-1/2 -translate-x-1/2 gap-2" compacto />
        <div className="flex items-center gap-2">
          {anterior && (
            <button
              type="button"
              onClick={anterior}
              aria-label="Horario anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-amber-400 hover:bg-amber-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <ArrowLeft size={17} />
            </button>
          )}
          {siguiente && (
            <button
              type="button"
              onClick={siguiente}
              aria-label="Siguiente horario"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-amber-400 hover:bg-amber-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <ArrowRight size={17} />
            </button>
          )}
          <BotonTematico />
        </div>
      </nav>
    </header>
  );
}
