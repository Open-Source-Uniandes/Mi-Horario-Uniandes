import Link from "next/link";
import { ArrowRight, ArrowUpRight, GraduationCap } from "lucide-react";

/**
 * Muestra la identidad del sitio y sus enlaces de navegación.
 * @returns La barra superior con enlaces a secciones y planeación.
 */
export default function BarraNavegacion() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#faf9f6]/90 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/85">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Mi Horario Uniandes, inicio"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
            <GraduationCap size={23} strokeWidth={2.2} />
          </span>
          <span className="text-sm font-bold leading-tight tracking-tight sm:text-base">
            Mi Horario
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Uniandes
            </span>
          </span>
        </Link>
        <EnlacesNavegacion />
        <AccesoPlaneacion />
      </nav>
    </header>
  );
}

/**
 * Presenta los enlaces a las secciones informativas de la página.
 * @returns Los enlaces de funcionalidades, comunidad y video.
 */
function EnlacesNavegacion() {
  return (
    <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
      <a
        className="transition hover:text-slate-950 dark:hover:text-white"
        href="#funcionalidades"
      >
        Qué puedes hacer
      </a>
      <a
        className="transition hover:text-slate-950 dark:hover:text-white"
        href="#comunidad"
      >
        Comunidad
      </a>
      <Link
        href="https://www.youtube.com/watch?v=WNirDylLHS8"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 transition hover:text-slate-950 dark:hover:text-white"
      >
        Cómo funciona <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}

/**
 * Enlaza directamente con el flujo para planear un horario.
 * @returns El botón de acceso a la planeación.
 */
function AccesoPlaneacion() {
  return (
    <Link
      href="/planear"
      className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200 sm:inline-flex"
    >
      Crear horario <ArrowRight size={16} />
    </Link>
  );
}
