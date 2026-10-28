import Link from "next/link";
import { ArrowRight, ArrowUpRight, BellRing, Github } from "lucide-react";

/**
 * Agrupa las opciones de notificaciones y colaboración comunitaria.
 * @returns Las tarjetas de notificaciones y participación comunitaria.
 */
export default function SeccionComunidad() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
      <TarjetaNotificaciones />
      <TarjetaComunidad />
    </section>
  );
}

/**
 * Invita a conocer el servicio de avisos de cupos disponibles.
 * @returns La tarjeta informativa del servicio de notificaciones.
 */
function TarjetaNotificaciones() {
  return (
    <article className="relative overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white sm:p-11">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.06]" />
      <div className="relative">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
          <BellRing size={22} />
        </span>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-amber-300">
          No pierdas tu cupo de vista
        </p>
        <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Que no se te escape ese curso.
        </h2>
        <p className="mt-4 max-w-lg leading-7 text-slate-300">
          Conoce el servicio de notificaciones y recibe avisos cuando tus cursos
          se queden sin cupos.
        </p>
        <Link
          href="https://open-source-uniandes.github.io/notifications/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
        >
          Conocer notificaciones <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

/**
 * Invita a contribuir y compartir ideas en el repositorio del proyecto.
 * @returns La tarjeta con información de la comunidad open source.
 */
function TarjetaComunidad() {
  return (
    <article
      id="comunidad"
      className="flex flex-col justify-between rounded-[30px] border border-slate-200 bg-amber-100/70 p-8 dark:border-white/10 dark:bg-amber-300/[0.08] sm:p-10"
    >
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 dark:bg-white/10 dark:text-amber-200">
          <Github size={22} />
        </span>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-amber-900 dark:text-amber-200">
          Código abierto, campus abierto
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
          Hecho por y para Uniandes.
        </h2>
        <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
          Esta herramienta es de la comunidad. Comparte tus ideas, reporta un
          problema o contribuye a mejorarla.
        </p>
      </div>
      <Link
        href="https://github.com/Open-Source-Uniandes/Mi-Horario-Uniandes"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex w-fit items-center gap-2 border-b border-slate-900 pb-1 text-sm font-bold transition hover:gap-3 dark:border-white"
      >
        Visita nuestro GitHub <ArrowRight size={16} />
      </Link>
    </article>
  );
}
