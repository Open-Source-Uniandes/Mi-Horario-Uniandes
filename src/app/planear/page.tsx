import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  GraduationCap,
  ListChecks,
  SlidersHorizontal,
} from "lucide-react";

const seccionesPlaneacion = [
  {
    ruta: "/planear/cursos",
    nombre: "Cursos",
    descripcion: "Busca materias y elige las secciones que quieres considerar.",
    icono: GraduationCap,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-200",
  },
  {
    ruta: "/planear/bloques",
    nombre: "Bloques de tiempo",
    descripcion: "Reserva espacios para almorzar, descansar o hacer otras actividades.",
    icono: Clock3,
    color: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
  },
  {
    ruta: "/planear/planes",
    nombre: "Planes guardados",
    descripcion: "Consulta, importa y edita los horarios que guardaste.",
    icono: ListChecks,
    color: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200",
  },
  {
    ruta: "/planear/criterios",
    nombre: "Criterios",
    descripcion: "Ordena los horarios según tus prioridades para el semestre.",
    icono: SlidersHorizontal,
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  },
];

/**
 * Presenta las herramientas disponibles para planear el horario.
 * @returns La introducción y los accesos a cada sección de planeación.
 */
export default function Planear() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <EncabezadoPlaneacion />
      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {seccionesPlaneacion.map((seccion, indice) => (
          <TarjetaPlaneacion
            key={seccion.ruta}
            {...seccion}
            numero={indice + 1}
          />
        ))}
      </div>
      <AccesoHorarios />
    </div>
  );
}

/**
 * Introduce el espacio de planeación y resume su propósito.
 * @returns El título y la descripción de la página.
 */
function EncabezadoPlaneacion() {
  return (
    <header className="relative overflow-hidden rounded-[30px] bg-amber-300 px-7 py-9 text-slate-950 sm:px-10 sm:py-12">
      <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[34px] border-white/25" />
      <div className="relative max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
          Tu semestre empieza aquí
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
          Planea tu horario
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-800 sm:text-lg">
          Elige tus cursos, reserva tiempo para ti y descubre combinaciones que
          se adapten a tu semana.
        </p>
      </div>
    </header>
  );
}

/**
 * Enlaza a una herramienta de planeación y explica para qué sirve.
 * @param propiedades Ruta, contenido, icono, color y posición de la tarjeta.
 * @returns Una tarjeta interactiva que abre una sección de planeación.
 */
function TarjetaPlaneacion({
  ruta,
  nombre,
  descripcion,
  icono: Icono,
  color,
  numero,
}: {
  ruta: string;
  nombre: string;
  descripcion: string;
  icono: typeof GraduationCap;
  color: string;
  numero: number;
}) {
  return (
    <Link
      href={ruta}
      className="group rounded-[26px] border border-slate-200/80 bg-white/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/5 dark:border-white/10 dark:bg-neutral-900"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
          <Icono size={22} />
        </span>
        <span className="text-xs font-bold tracking-widest text-slate-400">
          0{numero}
        </span>
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-tight">{nombre}</h2>
      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-300">
        {descripcion}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:gap-3 dark:text-amber-200">
        Abrir <ArrowRight size={16} />
      </span>
    </Link>
  );
}

/**
 * Facilita el acceso a la consulta de horarios generados.
 * @returns El llamado a la acción para ver horarios.
 */
function AccesoHorarios() {
  return (
    <Link
      href="/ver"
      className="mt-6 flex items-center justify-between gap-4 rounded-[26px] border border-slate-200/80 bg-white/80 p-5 transition hover:border-amber-300 hover:bg-white dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-800 sm:px-7"
    >
      <span className="flex items-center gap-4">
        <span className="accent-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <CalendarDays size={22} />
        </span>
        <span>
          <span className="block font-bold">Ver horarios disponibles</span>
          <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
            Compara las combinaciones encontradas con tus criterios.
          </span>
        </span>
      </span>
      <ArrowRight className="shrink-0 transition group-hover:translate-x-1" size={19} />
    </Link>
  );
}
