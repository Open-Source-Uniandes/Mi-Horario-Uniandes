import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Contiene la información necesaria para describir una funcionalidad. */
type DatosFuncionalidad = {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  color: string;
};

const funcionalidades: DatosFuncionalidad[] = [
  {
    icono: CalendarDays,
    titulo: "Encuentra tu combinación",
    descripcion:
      "Explora todas las posibilidades de tus cursos y encuentra un horario que sí funcione para ti.",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    icono: Clock3,
    titulo: "Cuida tu tiempo",
    descripcion:
      "Reserva horas para almorzar, descansar o compartir. Tus bloques personales también cuentan.",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  },
  {
    icono: Sparkles,
    titulo: "A tu manera",
    descripcion:
      "Prioriza menos huecos, salidas más temprano y las secciones que mejor se ajustan a tus planes.",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  },
];

/**
 * Presenta las principales herramientas para organizar el semestre.
 * @returns La sección informativa con sus tarjetas de funcionalidades.
 */
export default function SeccionFuncionalidades() {
  return (
    <section
      id="funcionalidades"
      className="border-y border-slate-200/70 bg-white/70 py-20 dark:border-white/10 dark:bg-white/[0.02] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <EncabezadoFuncionalidades />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {funcionalidades.map((funcionalidad, indice) => (
            <TarjetaFuncionalidad
              key={funcionalidad.titulo}
              funcionalidad={funcionalidad}
              numero={indice + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Muestra una funcionalidad y su posición en la lista.
 * @param funcionalidad Contenido e icono de la tarjeta.
 * @param numero Posición de la tarjeta en la sección.
 * @returns La tarjeta descriptiva de una funcionalidad.
 */
function TarjetaFuncionalidad({
  funcionalidad,
  numero,
}: {
  funcionalidad: DatosFuncionalidad;
  numero: number;
}) {
  const Icono = funcionalidad.icono;

  return (
    <article className="group rounded-[26px] border border-slate-200/80 bg-[#faf9f6] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-white/10 dark:bg-neutral-900">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${funcionalidad.color}`}
      >
        <Icono size={22} />
      </span>
      <p className="mt-7 text-xs font-bold tracking-widest text-slate-400">
        0{numero}
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight">{funcionalidad.titulo}</h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        {funcionalidad.descripcion}
      </p>
    </article>
  );
}

/**
 * Explica el valor de las herramientas disponibles.
 * @returns El título y la descripción de la sección.
 */
function EncabezadoFuncionalidades() {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
        Menos vueltas, más tiempo
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
        Todo lo que necesitas para planear.
      </h2>
      <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
        Tú eliges cómo quieres vivir el semestre. Nosotros te ayudamos a encontrar
        el camino.
      </p>
    </div>
  );
}
