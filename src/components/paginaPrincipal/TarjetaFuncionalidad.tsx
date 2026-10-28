import type { LucideIcon } from "lucide-react";

/** Contiene la información necesaria para describir una funcionalidad. */
export type DatosFuncionalidad = {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  color: string;
};

/**
 * Muestra una funcionalidad y su posición en la lista.
 * @param funcionalidad Contenido e icono de la tarjeta.
 * @param numero Posición de la tarjeta en la sección.
 * @returns La tarjeta descriptiva de una funcionalidad.
 */
export default function TarjetaFuncionalidad({
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
