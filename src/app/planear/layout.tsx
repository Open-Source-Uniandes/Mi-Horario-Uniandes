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
    <div className="min-h-screen bg-page text-slate-900 dark:bg-page-dark dark:text-white">
      <NavbarSimple />
      <div className="flex min-h-screen pt-16">
        <SidebarPlanear />
        <main className="w-full pb-24 lg:pb-8 lg:pl-24">
          {children}
        </main>
      </div>
    </div>
  )
}
