import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

/**
 * Invita a contribuir y compartir ideas en el repositorio del proyecto.
 * @returns La tarjeta con información de la comunidad open source.
 */
export default function TarjetaComunidad() {
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
          Open source, open campus
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
