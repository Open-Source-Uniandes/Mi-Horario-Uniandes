import { ChevronFirst, ChevronLast, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export function SidebarCursosConAtributos({children}: {children: React.ReactNode}) {
  const [expandido, setExpandido] = useState<boolean>(false);
  return (
      <aside
        className={`sticky top-16 z-20 h-[calc(100vh-4rem)] shrink-0 self-start transition-[width] duration-300 ${
          expandido ? "w-72 max-w-[85vw]" : "w-12"
        }`}
      >
        <nav
          aria-label="Filtros de horario"
          className="flex h-full flex-col overflow-hidden border-r border-slate-200/80 bg-page shadow-sm dark:border-white/10 dark:bg-page-dark"
        >
          <div className={`flex h-14 shrink-0 items-center ${expandido ? "justify-between px-4" : "justify-center"}`}>
            {expandido && (
              <span className="flex items-center gap-2 text-sm font-bold">
                <SlidersHorizontal size={17} className="text-amber-700 dark:text-amber-300" />
                Herramientas del horario
              </span>
            )}
            <button
              type="button"
              onClick={() => setExpandido((estadoActual) => !estadoActual)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200/80 text-slate-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-amber-300/15 dark:text-amber-200 dark:hover:bg-amber-300/25"
              aria-label={expandido ? "Contraer barra lateral" : "Expandir barra lateral"}
              aria-expanded={expandido}
              aria-controls="contenido-barra-lateral-horario"
            >
              {expandido ? <ChevronFirst size={19} /> : <ChevronLast size={19} />}
            </button>
          </div>
          <div
            id="contenido-barra-lateral-horario"
            className={`min-h-0 flex-1 overflow-y-auto border-t border-slate-200/80 p-4 dark:border-white/10 ${
              expandido ? "block" : "hidden"
            }`}
          >
            {expandido ? children : null}
          </div>
        </nav>
      </aside>
  );
}
