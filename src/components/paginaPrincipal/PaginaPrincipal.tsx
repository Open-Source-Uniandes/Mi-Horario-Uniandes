import BarraNavegacion from "./BarraNavegacion";
import LlamadoAccion from "./LlamadoAccion";
import PiePagina from "./PiePagina";
import Portada from "./Portada";
import SeccionComunidad from "./SeccionComunidad";
import SeccionFuncionalidades from "./SeccionFuncionalidades";

/**
 * Compone las secciones de la página principal.
 * @returns El contenedor con navegación, contenido y pie de página.
 */
export default function PaginaPrincipal() {
  return (
    <div className="min-h-screen overflow-hidden bg-page text-slate-900 dark:bg-page-dark dark:text-white">
      <BarraNavegacion />
      <main>
        <Portada />
        <SeccionFuncionalidades />
        <SeccionComunidad />
        <LlamadoAccion />
      </main>
      <PiePagina />
    </div>
  );
}
