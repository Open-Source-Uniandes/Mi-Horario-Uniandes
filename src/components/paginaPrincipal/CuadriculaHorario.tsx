type TipoCurso = "calculo" | "historia" | "laboratorio" | "fisica" | "tiempo";

type FilaHorario = {
  hora: string;
  cursos: (TipoCurso | null)[];
};

const dias = ["L", "M", "M", "J", "V"];

const filas: FilaHorario[] = [
  { hora: "7:00", cursos: [null, "calculo", null, null, null] },
  { hora: "9:00", cursos: ["historia", "calculo", null, "historia", null] },
  { hora: "11:00", cursos: ["historia", null, "laboratorio", "laboratorio", null] },
  { hora: "13:00", cursos: [null, "tiempo", "tiempo", null, "tiempo"] },
  { hora: "15:00", cursos: ["fisica", null, "fisica", null, "fisica"] },
];

/**
 * Organiza los días y los bloques de clase de la semana.
 * @returns La cuadrícula completa con días, horas y cursos.
 */
export default function CuadriculaHorario() {
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
        <FilaDeHorario key={fila.hora} fila={fila} />
      ))}
    </div>
  );
}

/**
 * Dibuja la hora y las clases de una fila del horario.
 * @param fila Hora y cursos que se muestran en la fila.
 * @returns La fila del horario con sus celdas correspondientes.
 */
function FilaDeHorario({ fila }: { fila: FilaHorario }) {
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
function obtenerEstiloCurso(curso: TipoCurso | null): { color: string; nombre: string } {
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
