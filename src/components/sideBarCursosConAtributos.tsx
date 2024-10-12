import { ChevronLast, ChevronFirst } from "lucide-react"; // Son iconos de flechas hacia la izquierda y derecha
import { createContext, useState} from "react";

interface SidebarContextProps {
  estaExpandido: boolean;
}
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function SidebarCursosConAtributos({children}: {children: React.ReactNode}) {
  const [expandido, setExpandido] = useState<boolean>(false);
  return (
    <SidebarContext.Provider value={{ estaExpandido: expandido }}>
      <aside>
        <nav className="h-full  flex flex-col bg-gray-300 dark:bg-neutral-900 border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <button onClick={() => setExpandido((estadoActual) => !estadoActual)} className="p-1.5 rounded-lg bg-yellow-200 dark:bg-yellow-300 hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-colors duration-300">
              {expandido ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <div className="border-t flex p-3">
            <div className={` flex justify-between items-center overflow-hidden transition-all ${expandido ? "w-52 ml-3" : "w-0"} `}>
              {children}
            </div>
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

