import MensajePortada from "./MensajePortada";
import VistaPreviaHorario from "./VistaPreviaHorario";

/**
 * Presenta el mensaje principal y una muestra visual de un horario.
 * @returns La sección de portada con el mensaje y la vista previa.
 */
export default function Portada() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pt-28">
      <div className="pointer-events-none absolute -left-48 top-16 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
      <MensajePortada />
      <VistaPreviaHorario />
      <a
        href="#funcionalidades"
        aria-label="Descubre las funcionalidades"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-slate-700 dark:hover:text-white lg:flex"
      >
        DESCUBRE MÁS
      </a>
    </section>
  );
}
