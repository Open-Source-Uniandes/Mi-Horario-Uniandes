"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const opcionesNavegacion = [
  {
    ruta: "/planear/cursos",
    nombre: "Cursos",
    icono: "/Mi-Horario-Uniandes/static/universidad.svg",
  },
  {
    ruta: "/planear/bloques",
    nombre: "Bloques",
    icono: "/Mi-Horario-Uniandes/static/reloj.svg",
  },
  {
    ruta: "/planear/planes",
    nombre: "Planes",
    icono: "/Mi-Horario-Uniandes/static/lista.svg",
  },
  {
    ruta: "/planear/criterios",
    nombre: "Criterios",
    icono: "/Mi-Horario-Uniandes/static/engranaje.svg",
  },
  {
    ruta: "/ver",
    nombre: "Horarios",
    icono: "/Mi-Horario-Uniandes/static/calendario.svg",
  },
];

/**
 * Muestra las rutas de planeación con selección activa y diseño adaptable.
 * @returns La navegación lateral para escritorio y compacta para móvil.
 */
export default function SidebarPlanear() {
  const rutaActual = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-page/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-page-dark/95 lg:inset-y-16 lg:left-0 lg:right-auto lg:w-24 lg:border-r lg:border-t-0 lg:px-3 lg:py-5">
      <nav
        aria-label="Secciones de planeación"
        className="flex items-center justify-around gap-1 py-2 lg:h-full lg:flex-col lg:justify-center lg:gap-3 lg:py-0"
      >
        {opcionesNavegacion.map((opcion) => {
          const estaActiva = rutaActual === opcion.ruta;

          return (
            <Link
              key={opcion.ruta}
              href={opcion.ruta}
              aria-current={estaActiva ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition lg:w-full lg:flex-none lg:gap-1.5 lg:py-3 lg:text-xs ${
                estaActiva
                  ? "bg-amber-200/80 text-slate-950 dark:bg-amber-300/15 dark:text-amber-200"
                  : "text-slate-500 hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition lg:h-10 lg:w-10 ${
                  estaActiva
                    ? "bg-amber-300 text-slate-950"
                    : "bg-white/80 dark:bg-white/[0.06]"
                }`}
              >
                <Image
                  className={estaActiva ? "" : "icon-svg"}
                  src={opcion.icono}
                  alt=""
                  width={21}
                  height={21}
                />
              </span>
              <span className="truncate">{opcion.nombre}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
