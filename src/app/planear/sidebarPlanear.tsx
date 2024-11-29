/*
  En este archivo contiene las barras laterales de navegación del proyecto
*/

import Link from "next/link"
import Image from "next/image"
import { BotonTematico } from "@/app/darkMode";

/*
  Sidebar de la vista planear
  Contiene las cinco opciones o funcionalidades basicas
*/
export default function SidebarPlanear() {
  return (
    <div className="flex flex-col justify-between items-center bg-zinc-200 pb-24 py-6 border-r w-24 fixed h-screen dark:bg-neutral-900">
      <BotonCursos />
      <BotonBloques />
      <BotonGrupos />
      <BotonPlanes />
      <BotonCriterios />
      <BotonVerHorarios />
      <BotonTematico />
    </div>
  );
}
/*
  Define una estructura generica para cualquier botón
  La estructura consiste en un Link que redirecciona a la opcion o funcionalidad en especifico
  El Link interno contiene la imagen del botón y la ruta a la que se debe direccionar

  @param children La imagen svg que tendra el botón
  @param ruta La ruta a la que se debe redirigir
*/
function BotonLateral({ children, ruta }: { children: React.ReactNode, ruta: string }) {
  const partesRuta = ruta.split("/")
  const nombreOpcion = partesRuta[partesRuta.length - 1]
  return (
    <div className="flex-1">
      <Link className="text-sm font-medium flex flex-col items-center" href={ ruta }>
        <div className="flex items-center justify-center w-10 h-10 rounded-md border border-black dark:border-white">
          {children}
        </div>
        <p>{nombreOpcion[0]?.toUpperCase() + nombreOpcion.slice(1)}</p>
      </Link>
    </div>

  )
}

/*
  Botón que redirige a la opción de ver y escoger cursos
*/
function BotonCursos() {
    return (
      <BotonLateral ruta={"/planear/cursos"}>
        <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/universidad.svg" alt="Cursos" width={24} height={24}/>
      </BotonLateral>
    )
}

/*
  Botón que redirige a la opción de ver y crear bloques
*/
function BotonBloques() {
  return (
    <BotonLateral ruta={"/planear/bloques"}>
      <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/reloj.svg" alt="Bloques" width={24} height={24}/>
    </BotonLateral>
  )
}

/*
  Botón que redirige a la opción de ver y crear grupos
*/
function BotonGrupos() {
    return (
      <BotonLateral ruta={"/planear/grupos"}>
        <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/canasta.svg" alt="Grupos" width={24} height={24}/>
      </BotonLateral>
    )
}

/*
  Botón que redirige a la opción de ver y editar planes
*/
function BotonPlanes() {
  return (
    <BotonLateral ruta={"/planear/planes"}>
      <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/lista.svg" alt="Planes" width={24} height={24}/>
    </BotonLateral>
  )
}

/*
  Botón que redirige a la opción de seleccionar criterio de ordenamiento
*/
function BotonCriterios() {
  return (
    <BotonLateral ruta={"/planear/criterios"}>
      <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/engranaje.svg" alt="Ordenamientos" width={24} height={24}/>
    </BotonLateral>
  )
}

/*
  Botón que redirige a la opción de ver horarios
*/
function BotonVerHorarios() {
  return (
    <BotonLateral ruta={"/ver"}>
      <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/calendario.svg" alt="Ver Horarios" width={24} height={24}/>
    </BotonLateral>
  )
}