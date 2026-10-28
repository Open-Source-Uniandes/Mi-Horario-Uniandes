import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CalendarDays,
  Check,
  Clock3,
  Coffee,
  Github,
  GraduationCap,
  Play,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Encuentra tu combinación",
    description:
      "Explora todas las posibilidades de tus cursos y encuentra un horario que sí funcione para ti.",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    icon: Clock3,
    title: "Cuida tu tiempo",
    description:
      "Reserva horas para almorzar, descansar o compartir. Tus bloques personales también cuentan.",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  },
  {
    icon: Sparkles,
    title: "A tu manera",
    description:
      "Prioriza menos huecos, salidas más temprano y las secciones que mejor se ajustan a tus planes.",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  },
];

export default function PaginaPrincipal() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#faf9f6] text-slate-900 dark:bg-neutral-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#faf9f6]/90 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/85">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <Link href="/" className="flex items-center gap-3" aria-label="Mi Horario Uniandes, inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
              <GraduationCap size={23} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-bold leading-tight tracking-tight sm:text-base">
              Mi Horario
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Uniandes
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a className="transition hover:text-slate-950 dark:hover:text-white" href="#funcionalidades">
              Qué puedes hacer
            </a>
            <a className="transition hover:text-slate-950 dark:hover:text-white" href="#comunidad">
              Comunidad
            </a>
            <Link
              href="https://www.youtube.com/watch?v=WNirDylLHS8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition hover:text-slate-950 dark:hover:text-white"
            >
              Cómo funciona <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              href="/planear"
              className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200 sm:inline-flex"
            >
              Crear horario <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pt-28">
          <div className="pointer-events-none absolute -left-48 top-16 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-amber-900 shadow-sm dark:border-amber-300/20 dark:bg-white/5 dark:text-amber-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              HECHO PARA LA COMUNIDAD UNIANDINA
            </div>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Tu semestre,
              <br />
              <span className="relative inline-block">
                a tu manera.
                <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-1 rounded-full bg-amber-300/80 sm:h-4" />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              Arma el horario que se adapta a tu vida. Combina tus cursos, reserva
              tiempo para ti y descubre nuevas posibilidades en unos pocos pasos.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planear"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
              >
                Arma tu horario <ArrowRight size={18} />
              </Link>
              <Link
                href="https://www.youtube.com/watch?v=WNirDylLHS8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 text-base font-semibold transition hover:border-slate-400 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
              >
                <Play size={16} fill="currentColor" /> Ver cómo funciona
              </Link>
            </div>
            <p className="mt-7 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
              Gratis, de código abierto y creado por estudiantes.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
            <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full border-[18px] border-amber-200/70 dark:border-amber-300/10" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sky-200/60 blur-2xl dark:bg-sky-400/10" />
            <div className="relative rounded-[30px] border border-white bg-white/90 p-4 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-neutral-900/90 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">VISTA PREVIA</p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight">Tu semana ideal</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-300">
                  <CalendarDays size={20} />
                </span>
              </div>
              <div className="mt-5 grid grid-cols-[42px_repeat(5,minmax(0,1fr))] gap-1.5 sm:gap-2">
                <div />
                {["L", "M", "M", "J", "V"].map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="pb-2 text-center text-xs font-semibold text-slate-400"
                  >
                    {day}
                  </div>
                ))}
                {[
                  ["7:00", "", "calculus", "", "", ""],
                  ["9:00", "historia", "calculus", "", "historia", ""],
                  ["11:00", "historia", "", "lab", "lab", ""],
                  ["13:00", "", "almuerzo", "almuerzo", "", "almuerzo"],
                  ["15:00", "fisica", "", "fisica", "", "fisica"],
                ].map((row) => (
                  <div className="contents" key={row[0]}>
                    <span className="flex items-start pt-1 text-[10px] font-medium text-slate-400 sm:text-xs">
                      {row[0]}
                    </span>
                    {row.slice(1).map((course, index) => (
                      <div
                        key={`${row[0]}-${index}`}
                        className={`min-h-[54px] rounded-xl p-1.5 sm:min-h-[60px] sm:p-2 ${
                          course === "calculus"
                            ? "bg-violet-100 dark:bg-violet-400/15"
                            : course === "historia"
                              ? "bg-sky-100 dark:bg-sky-400/15"
                              : course === "lab"
                                ? "bg-rose-100 dark:bg-rose-400/15"
                                : course === "fisica"
                                  ? "bg-amber-100 dark:bg-amber-300/15"
                                  : course === "almuerzo"
                                    ? "border border-dashed border-emerald-300 bg-emerald-50/70 dark:border-emerald-300/30 dark:bg-emerald-300/5"
                                    : "bg-slate-50 dark:bg-white/[0.03]"
                        }`}
                      >
                        {course && (
                          <span className="block text-[9px] font-semibold leading-tight text-slate-700 dark:text-slate-200 sm:text-[10px]">
                            {course === "calculus"
                              ? "Cálculo"
                              : course === "historia"
                                ? "Historia"
                                : course === "lab"
                                  ? "Lab."
                                  : course === "fisica"
                                    ? "Física"
                                    : "Tu tiempo"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                <Coffee size={15} className="text-emerald-600 dark:text-emerald-400" />
                También hay espacio para lo que te hace bien.
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-neutral-800 sm:-right-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                <Check size={18} />
              </span>
              <span className="text-xs font-semibold leading-tight">
                Menos cruces,
                <br />
                más posibilidades
              </span>
            </div>
          </div>
          <a
            href="#funcionalidades"
            aria-label="Descubre las funcionalidades"
            className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-slate-700 dark:hover:text-white lg:flex"
          >
            DESCUBRE MÁS <ArrowDown size={14} />
          </a>
        </section>

        <section
          id="funcionalidades"
          className="border-y border-slate-200/70 bg-white/70 py-20 dark:border-white/10 dark:bg-white/[0.02] sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                Menos vueltas, más tiempo
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Todo lo que necesitas para planear.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Tú eliges cómo quieres vivir el semestre. Nosotros te ayudamos a
                encontrar el camino.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color }, index) => (
                <article
                  key={title}
                  className="group rounded-[26px] border border-slate-200/80 bg-[#faf9f6] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-white/10 dark:bg-neutral-900"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                    <Icon size={22} />
                  </span>
                  <p className="mt-7 text-xs font-bold tracking-widest text-slate-400">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="relative overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white sm:p-11">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.06]" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
                <BellRing size={22} />
              </span>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-amber-300">
                No pierdas tu cupo de vista
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Que no se te escape ese curso.
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-slate-300">
                Conoce el servicio de notificaciones y recibe avisos cuando tus
                cursos se queden sin cupos.
              </p>
              <Link
                href="https://open-source-uniandes.github.io/notifications/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Conocer notificaciones <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>

          <article
            id="comunidad"
            className="flex flex-col justify-between rounded-[30px] border border-slate-200 bg-amber-100/70 p-8 dark:border-white/10 dark:bg-amber-300/[0.08] sm:p-10"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 dark:bg-white/10 dark:text-amber-200">
                <Github size={22} />
              </span>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-amber-900 dark:text-amber-200">
                Open source, open campus
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
                Hecho por y para Uniandes.
              </h2>
              <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
                Esta herramienta es de la comunidad. Comparte tus ideas, reporta
                un problema o contribuye a mejorarla.
              </p>
            </div>
            <Link
              href="https://github.com/Open-Source-Uniandes/Mi-Horario-Uniandes"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-2 border-b border-slate-900 pb-1 text-sm font-bold transition hover:gap-3 dark:border-white"
            >
              Visita nuestro GitHub <ArrowRight size={16} />
            </Link>
          </article>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="mx-auto flex max-w-7xl flex-col items-center rounded-[30px] bg-amber-300 px-6 py-12 text-center text-slate-950 sm:px-12 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
              El próximo semestre empieza aquí
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
              Tu horario perfecto está más cerca de lo que crees.
            </h2>
            <Link
              href="/planear"
              className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-slate-950 px-7 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Empezar a planear <ArrowRight size={18} />
            </Link>
            <p className="mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-slate-950/15 bg-white/45 px-4 py-3 text-left text-sm font-medium leading-6 text-slate-900 shadow-sm sm:text-base">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-amber-300">
                !
              </span>
              <span>
                <strong className="font-bold">Importante:</strong> Mi Horario
                Uniandes te ayuda a planear, pero la inscripción de tus cursos
                debes hacerla a través de Banner.
              </span>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
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
        </div>
      </footer>
    </div>
  );
}
