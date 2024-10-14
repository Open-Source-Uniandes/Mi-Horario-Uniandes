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
      <div className="pt-16 flex  min-h-screen dark:text-white">
        <SidebarPlanear/>
        <main className="pl-24 w-full dark:bg-neutral-800">
            {children}
        </main>
      </div>
    </div>
  )
}
