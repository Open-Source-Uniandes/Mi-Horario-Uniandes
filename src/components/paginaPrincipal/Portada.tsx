import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Coffee,
  Play,
} from "lucide-react";

type TipoCurso = "calculo" | "historia" | "laboratorio" | "fisica" | "tiempo";

type FilaHorario = {
  hora: string;
  cursos: (TipoCurso | null)[];
};

const dias = ["L", "M", "M", "J", "V"];

const filas: FilaHorario[] = [
  { hora: "7:00", cursos: [null, "calculo", null, null, null] },
  { hora: "9:00", cursos: ["historia", "calculo", null, "historia", null] },
  {
    hora: "11:00",
    cursos: ["historia", null, "laboratorio", "laboratorio", null],
  },
  { hora: "13:00", cursos: [null, "tiempo", "tiempo", null, "tiempo"] },
  { hora: "15:00", cursos: ["fisica", null, "fisica", null, "fisica"] },
];

/**
 * Presenta el mensaje principal y la vista ilustrativa de un horario.
 * @returns La sección de portada de la página principal.
 */
export default function Portada() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pt-28">
      <div className="pointer-events-none absolute -left-48 top-16 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
      <MensajeBienvenida />
      <VistaHorario />
      <a
        href="#funcionalidades"
        aria-label="Descubre las funcionalidades"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-slate-700 dark:hover:text-white lg:flex"
      >
        DESCUBRE MÁS
      </a>
    </section>
  );
}

/**
 * Muestra el mensaje de bienvenida y los accesos principales.
 * @returns El título, la descripción y los enlaces de inicio.
 */
function MensajeBienvenida() {
  return (
    <div className="relative z-10">
      <EtiquetaComunidad />
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
      <EnlacesBienvenida />
      <p className="mt-7 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
        Gratis, de código abierto y creado por estudiantes.
      </p>
    </div>
  );
}

/**
 * Identifica a quién está dirigida la herramienta.
 * @returns La etiqueta de la comunidad Uniandina.
 */
function EtiquetaComunidad() {
  return (
    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-amber-900 shadow-sm dark:border-amber-300/20 dark:bg-white/5 dark:text-amber-200">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      HECHO PARA LA COMUNIDAD UNIANDINA
    </div>
  );
}

/**
 * Enlaza con la planeación y el video introductorio.
 * @returns Los botones de acceso a planeación y al video.
 */
function EnlacesBienvenida() {
  return (
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
  );
}

/**
 * Dibuja una vista ilustrativa de un horario semanal.
 * @returns La tarjeta con el horario, una nota y una insignia.
 */
function VistaHorario() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
      <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full border-[18px] border-amber-200/70 dark:border-amber-300/10" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sky-200/60 blur-2xl dark:bg-sky-400/10" />
      <div className="relative rounded-[30px] border border-white bg-white/90 p-4 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-neutral-900/90 sm:p-6">
        <EncabezadoHorario />
        <CuadriculaHorario />
        <NotaTiempoPersonal />
      </div>
      <InsigniaHorario />
    </div>
  );
}

/**
 * Muestra el título y el icono de la vista previa.
 * @returns El encabezado de la tarjeta del horario.
 */
function EncabezadoHorario() {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          VISTA PREVIA
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight">Tu semana ideal</h2>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-300">
        <CalendarDays size={20} />
      </span>
    </div>
  );
}

/**
 * Organiza los días y los bloques de clase de la semana.
 * @returns La cuadrícula completa con días, horas y cursos.
 */
function CuadriculaHorario() {
  return (
    <div className="mt-5 grid grid-cols-[42px_repeat(5,minmax(0,1fr))] gap-1.5 sm:gap-2">
      <div />
      {dias.map((dia, indice) => (
        <div
          key={`${dia}-${indice}`}
          className="pb-2 text-center text-xs font-semibold text-slate-400"
        >
          {dia}
        </div>
      ))}
      {filas.map((fila) => (
        <FilaHorarioVista key={fila.hora} fila={fila} />
      ))}
    </div>
  );
}

/**
 * Dibuja la hora y las clases de una fila del horario.
 * @param fila Hora y cursos que se muestran en la fila.
 * @returns La fila del horario con sus celdas correspondientes.
 */
function FilaHorarioVista({ fila }: { fila: FilaHorario }) {
  return (
    <div className="contents">
      <span className="flex items-start pt-1 text-[10px] font-medium text-slate-400 sm:text-xs">
        {fila.hora}
      </span>
      {fila.cursos.map((curso, indice) => (
        <CeldaHorario key={`${fila.hora}-${indice}`} curso={curso} />
      ))}
    </div>
  );
}

/**
 * Dibuja un bloque con el color y nombre correspondientes al curso.
 * @param curso Tipo de clase que se representa; puede estar vacío.
 * @returns La celda coloreada del curso o un espacio libre.
 */
function CeldaHorario({ curso }: { curso: TipoCurso | null }) {
  const estilos = obtenerEstiloCurso(curso);

  return (
    <div className={`min-h-[54px] rounded-xl p-1.5 sm:min-h-[60px] sm:p-2 ${estilos.color}`}>
      {curso && (
        <span className="block text-[9px] font-semibold leading-tight text-slate-700 dark:text-slate-200 sm:text-[10px]">
          {estilos.nombre}
        </span>
      )}
    </div>
  );
}

/**
 * Obtiene el color y el nombre visibles para cada tipo de curso.
 * @param curso Tipo de clase que se representa.
 * @returns Clases de estilo y nombre del curso.
 */
function obtenerEstiloCurso(
  curso: TipoCurso | null,
): { color: string; nombre: string } {
  switch (curso) {
    case "calculo":
      return { color: "bg-violet-100 dark:bg-violet-400/15", nombre: "Cálculo" };
    case "historia":
      return { color: "bg-sky-100 dark:bg-sky-400/15", nombre: "Historia" };
    case "laboratorio":
      return { color: "bg-rose-100 dark:bg-rose-400/15", nombre: "Lab." };
    case "fisica":
      return { color: "bg-amber-100 dark:bg-amber-300/15", nombre: "Física" };
    case "tiempo":
      return {
        color:
          "border border-dashed border-emerald-300 bg-emerald-50/70 dark:border-emerald-300/30 dark:bg-emerald-300/5",
        nombre: "Tu tiempo",
      };
    default:
      return { color: "bg-slate-50 dark:bg-white/[0.03]", nombre: "" };
  }
}

/**
 * Recuerda que el horario también puede reservar tiempo personal.
 * @returns La nota sobre los bloques de tiempo personal.
 */
function NotaTiempoPersonal() {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
      <Coffee size={15} className="text-emerald-600 dark:text-emerald-400" />
      También hay espacio para lo que te hace bien.
    </div>
  );
}

/**
 * Destaca que el horario evita cruces y ofrece varias posibilidades.
 * @returns La insignia informativa junto a la vista previa.
 */
function InsigniaHorario() {
  return (
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
  );
}
