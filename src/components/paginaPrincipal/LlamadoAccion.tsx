import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Anima a empezar la planeación y destaca el aviso sobre Banner.
 * @returns La sección con enlace de planeación y aviso de inscripción.
 */
export default function LlamadoAccion() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center rounded-[30px] bg-amber-300 px-6 py-12 text-center text-slate-950 sm:px-12 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
          El próximo semestre empieza aquí
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
          Tu horario perfecto está más cerca de lo que crees.
        </h2>
        <Link
          href="/planear"
          className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-slate-950 px-7 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Empezar a planear <ArrowRight size={18} />
        </Link>
        <AvisoInscripcion />
      </div>
    </section>
  );
}

/**
 * Aclara que la inscripción oficial de cursos se realiza en Banner.
 * @returns El aviso destacado sobre el proceso de inscripción.
 */
function AvisoInscripcion() {
  return (
    <p className="mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-slate-950/15 bg-white/45 px-4 py-3 text-left text-sm font-medium leading-6 text-slate-900 shadow-sm sm:text-base">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-amber-300">
        !
      </span>
      <span>
        <strong className="font-bold">Importante:</strong> Mi Horario Uniandes
        te ayuda a planear, pero la inscripción de tus cursos debes hacerla a
        través de Banner.
      </span>
    </p>
  );
}
