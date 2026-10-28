import Image from "next/image";

type PropiedadesSpinner = {
  mensajeDeCarga: string;
  mensajeAuxiliar?: string;
};

/**
 * Muestra el estado de carga con Séneca y mensajes para la tarea en curso.
 * @param mensajeDeCarga Texto principal del estado de carga.
 * @param mensajeAuxiliar Orientación opcional mientras se completa la tarea.
 * @returns Una pantalla de carga adaptable con indicador visual.
 */
export default function Spinner({
  mensajeDeCarga,
  mensajeAuxiliar,
}: PropiedadesSpinner) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center bg-page px-5 py-12 text-center text-slate-950 dark:bg-page-dark dark:text-white"
    >
      <div className="relative flex h-36 w-36 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-amber-200 border-t-amber-500 dark:border-amber-300/15 dark:border-t-amber-300" />
        <Image
          src="/Mi-Horario-Uniandes/static/seneca.svg"
          alt=""
          width={104}
          height={104}
          className="h-24 w-24 object-contain"
          priority
        />
      </div>
      <p className="mt-7 text-xl font-bold tracking-tight sm:text-2xl">
        {mensajeDeCarga}
      </p>
      {mensajeAuxiliar && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
          {mensajeAuxiliar}
        </p>
      )}
    </main>
  );
}