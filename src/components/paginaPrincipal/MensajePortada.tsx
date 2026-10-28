import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";

/**
 * Presenta el mensaje de bienvenida y los accesos principales.
 * @returns El título, la descripción y los enlaces de inicio.
 */
export default function MensajePortada() {
  return (
    <div className="relative z-10">
      <EtiquetaComunidad />
      <h1 className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
        Tu semestre,
        <br />
        <span className="relative inline-block">
          a tu manera.
          <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-1 rounded-full bg-amber-300/80 sm:h-4" />
        </span>
      </h1>
      <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
        Arma el horario que se adapta a tu vida. Combina tus cursos, reserva
        tiempo para ti y descubre nuevas posibilidades en unos pocos pasos.
      </p>
      <EnlacesPortada />
      <p className="mt-7 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
        Gratis, de código abierto y creado por estudiantes.
      </p>
    </div>
  );
}

/**
 * Identifica a quién está dirigida la herramienta.
 * @returns La etiqueta de la comunidad Uniandina.
 */
function EtiquetaComunidad() {
  return (
    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-amber-900 shadow-sm dark:border-amber-300/20 dark:bg-white/5 dark:text-amber-200">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      HECHO PARA LA COMUNIDAD UNIANDINA
    </div>
  );
}

/**
 * Ofrece accesos para empezar a planear o ver el video introductorio.
 * @returns Los botones de planeación y del video introductorio.
 */
function EnlacesPortada() {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/planear"
        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
      >
        Arma tu horario <ArrowRight size={18} />
      </Link>
      <Link
        href="https://www.youtube.com/watch?v=WNirDylLHS8"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 text-base font-semibold transition hover:border-slate-400 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
      >
        <Play size={16} fill="currentColor" /> Ver cómo funciona
      </Link>
    </div>
  );
}
