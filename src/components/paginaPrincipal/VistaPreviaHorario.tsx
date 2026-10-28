import { CalendarDays, Check, Coffee } from "lucide-react";
import CuadriculaHorario from "./CuadriculaHorario";

/**
 * Dibuja una vista ilustrativa de un horario semanal.
 * @returns La tarjeta con el horario, una nota y una insignia.
 */
export default function VistaPreviaHorario() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
      <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full border-[18px] border-amber-200/70 dark:border-amber-300/10" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sky-200/60 blur-2xl dark:bg-sky-400/10" />
      <div className="relative rounded-[30px] border border-white bg-white/90 p-4 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-neutral-900/90 sm:p-6">
        <EncabezadoHorario />
        <CuadriculaHorario />
        <NotaTiempoPersonal />
      </div>
      <InsigniaHorario />
    </div>
  );
}

/**
 * Muestra el título y el icono de la vista previa.
 * @returns El encabezado de la tarjeta del horario.
 */
function EncabezadoHorario() {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          VISTA PREVIA
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight">Tu semana ideal</h2>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-300">
        <CalendarDays size={20} />
      </span>
    </div>
  );
}

/**
 * Recuerda que el horario también puede reservar tiempo personal.
 * @returns La nota sobre los bloques de tiempo personal.
 */
function NotaTiempoPersonal() {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
      <Coffee size={15} className="text-emerald-600 dark:text-emerald-400" />
      También hay espacio para lo que te hace bien.
    </div>
  );
}

/**
 * Destaca que el horario evita cruces y ofrece varias posibilidades.
 * @returns La insignia informativa junto a la vista previa.
 */
function InsigniaHorario() {
  return (
    <div className="absolute -bottom-5 -right-3 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-neutral-800 sm:-right-8">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
        <Check size={18} />
      </span>
      <span className="text-xs font-semibold leading-tight">
        Menos cruces,
        <br />
        más posibilidades
      </span>
    </div>
  );
}
