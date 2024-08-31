/*
  Este archivo contiene el layout de la vista planear
*/
"use client"
import SidebarPlanear from "./sidebarPlanear";
import { NavbarSimple } from "@/components/navbars";

/*
  Contiene la barra de navegación y la barra lateral de la vista planear y el contenido de la vista en sí
*/
export default function LayoutPlan({children}: {children: React.ReactNode}) {
  return (
    <div>
      <NavbarSimple />
      <div className="pt-16 flex h-screen">
        <SidebarPlanear/>
        <main className="pl-24 w-full">
            {children}
        </main>
      </div>
    </div>
  )
}
