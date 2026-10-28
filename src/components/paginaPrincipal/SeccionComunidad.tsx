import TarjetaComunidad from "./TarjetaComunidad";
import TarjetaNotificaciones from "./TarjetaNotificaciones";

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
