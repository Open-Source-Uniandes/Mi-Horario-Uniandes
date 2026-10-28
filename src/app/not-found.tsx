import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

/**
 * Muestra una página de error cuando la ruta solicitada no existe.
 * @returns La página 404 con enlaces para continuar navegando.
 */
export default function NoEncontrado() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-5 py-12 text-slate-950 dark:bg-page-dark dark:text-white">
      <section className="w-full max-w-2xl text-center">
        <Image
          src="/Mi-Horario-Uniandes/static/seneca.svg"
          alt="Séneca"
          width={150}
          height={150}
          className="mx-auto h-36 w-36 object-contain"
        />
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
          Te has salido de la ruta
        </p>
        <p className="mt-2 text-8xl font-black tracking-[-0.08em] text-amber-700 dark:text-amber-300 sm:text-9xl">
          404
        </p>
        <h1 className="-mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          No encontramos esta página
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
          Puede que el enlace haya cambiado o que la dirección esté escrita
          incorrectamente. Puedes volver al inicio o continuar planeando tu
          horario.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold transition hover:border-amber-400 hover:bg-white dark:border-white/15 dark:hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            Ir al inicio
          </Link>
          <Link
            href="/planear"
            className="primary-action"
          >
            <CalendarDays size={17} />
            Planear mi horario
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
