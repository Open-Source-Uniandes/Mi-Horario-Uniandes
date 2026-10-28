import Image from "next/image";
import Link from "next/link";

/**
 * Presenta la identidad del proyecto y enlaces de contacto.
 * @returns El pie de página con la marca y los enlaces de la comunidad.
 */
export default function PiePagina() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
        <MarcaProyecto />
        <EnlacesPiePagina />
      </div>
    </footer>
  );
}

/**
 * Muestra el sello de Séneca y el mensaje de la comunidad.
 * @returns La marca gráfica y el mensaje del proyecto.
 */
function MarcaProyecto() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/Mi-Horario-Uniandes/static/seneca-icon.svg"
        alt="Ícono de Séneca"
        width={42}
        height={42}
      />
      <div>
        <p className="font-semibold">Hecho con 💛 en Uniandes</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Planea mejor. Vive más tu semestre.
        </p>
      </div>
    </div>
  );
}

/**
 * Enlaza con el repositorio y el espacio para reportar sugerencias.
 * @returns Los enlaces del pie de página.
 */
function EnlacesPiePagina() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
      <Link
        href="https://github.com/Open-Source-Uniandes/Mi-Horario-Uniandes"
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:text-slate-950 dark:hover:text-white"
      >
        Sé parte del proyecto
      </Link>
      <Link
        href="https://github.com/Open-Source-Uniandes/Mi-Horario-Uniandes/issues"
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:text-slate-950 dark:hover:text-white"
      >
        Contacto y sugerencias
      </Link>
    </div>
  );
}
