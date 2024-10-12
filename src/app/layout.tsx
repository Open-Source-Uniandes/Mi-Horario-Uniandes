/*
  Layout principal de la aplicación
*/

import type { GetStaticPaths, Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import DarkMode from '@/app/darkMode';
import "./globals.css";

/*
  Metadatos de la aplicación
*/
export const metadata: Metadata = {
  title: "Mi Horario Uniandes",
  description: "Una aplicación web que se nutre de la API de cursos de la Universidad de los Andes para ayudarte a encontrar tu horario ideal.",
  openGraph: {
    title: "Mi Horario Uniandes",
    description: "Crea tu horario uniandino perfecto.",
    url: "https://open-source-uniandes.github.io/Mi-Horario-Uniandes/",
    siteName: "Mi Horario Uniandes",
    images: [
      {
        url: "https://registroapps.uniandes.edu.co/SisAdmisiones/Pregrado/img/Seneca-01.png",
        alt: "Mi Horario Uniandes",
      },
    ],
    locale: "es_CO",
    type: 'website',
  },
};


export default function LayoutPrincipal({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body className="h-full w-full">
        <DarkMode>{children}</DarkMode>
      </body>
      <GoogleAnalytics gaId="G-73PZCQ3GKB" />
    </html>
  )
}
