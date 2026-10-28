import Link from "next/link";
import { ArrowUpRight, BellRing } from "lucide-react";

/**
 * Invita a conocer el servicio de avisos de cupos disponibles.
 * @returns La tarjeta informativa del servicio de notificaciones.
 */
export default function TarjetaNotificaciones() {
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
