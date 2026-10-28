"use client";
import { tiempoAPixeles, tiempoNumeroATexto } from '@/services/formateadorTiempo';
import Horario from '@/models/Horario';
import Seccion from '@/models/Seccion';
import BloqueTiempo from '@/models/BloqueTiempo';
import { createContext, useContext, useState, type ReactNode } from "react";
import type { GrupoCurso } from "@/services/almacenamiento/almacenamientoGrupos";

const EstadoPopover = createContext(false);

const PALETA_DISPONIBILIDAD = {
  virtual: [
    { minimo: 0.8, fondo: "#96a7f4ff", borde: "#3b82f6" },
    { minimo: 0.6, fondo: "#86ccefff", borde: "#2563eb" },
    { minimo: 0.4, fondo: "#fde047", borde: "#eab308" },
    { minimo: 0.2, fondo: "#fdba74", borde: "#f97316" },
    { minimo: 0, fondo: "#fca5a5", borde: "#ef4444" },
  ],
  presencial: [
    { minimo: 0.8, fondo: "#86efac", borde: "#22c55e" },
    { minimo: 0.6, fondo: "#bef264", borde: "#84cc16" },
    { minimo: 0.4, fondo: "#fde047", borde: "#eab308" },
    { minimo: 0.2, fondo: "#fdba74", borde: "#f97316" },
    { minimo: 0, fondo: "#fca5a5", borde: "#ef4444" },
  ],
} as const;
const COLORES_SIN_CUPOS = { fondo: "#cbd5e1", borde: "#6b7280" };
const DIAS_SEMANA = [
  { nombre: "Lunes", codigo: "l" },
  { nombre: "Martes", codigo: "m" },
  { nombre: "Miércoles", codigo: "i" },
  { nombre: "Jueves", codigo: "j" },
  { nombre: "Viernes", codigo: "v" },
  { nombre: "Sábado", codigo: "s" },
] as const;

function Popover({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <EstadoPopover.Provider value={open}>
      <div className="contents">{children}</div>
    </EstadoPopover.Provider>
  );
}

function PopoverContent({
  children,
  side,
}: {
  side: "top" | "bottom";
  children: ReactNode;
}) {
  const estaAbierto = useContext(EstadoPopover);
  return (
    <div
      role="tooltip"
      className={`absolute left-1/2 z-50 w-72 max-w-[calc(100vw-1rem)] -translate-x-1/2 whitespace-normal rounded-2xl border border-slate-200 bg-white text-left text-slate-900 shadow-xl dark:border-white/15 dark:bg-neutral-900 dark:text-white ${
        side === "top" ? "bottom-full mb-2" : "top-full mt-2"
      } ${
        estaAbierto ? "block" : "hidden"
      } group-hover:block group-focus-within:block`}
    >
      {children}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-neutral-900">{children}</article>;
}

function CardHeader({ children }: { children: ReactNode }) {
  return <header className="space-y-1.5">{children}</header>;
}

function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="break-words text-sm font-bold leading-5 [overflow-wrap:anywhere]">{children}</h3>;
}

function CardDescription({ children }: { children: ReactNode }) {
  return <div className="text-xs leading-5 text-slate-600 dark:text-slate-300">{children}</div>;
}

function CardContent({ children }: { children: ReactNode }) {
  return <div className="mt-3 border-t border-slate-200 pt-2 text-xs dark:border-white/10">{children}</div>;
}

function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <footer className={`mt-3 flex flex-wrap gap-2 ${className}`}>{children}</footer>;
}


/*
  Componente que muestra el horario de las secciones en una tabla

  @param horario El horario a mostrar
*/
export function Calendario({horario}: {horario: Horario}) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = ObtenerSeccionesPorDia(horario);
  return (
    <div className='flex justify-center items-center w-full pt-4 font-sans text-slate-900 dark:text-slate-100'>
      <HorasCalendario/>
      <div className='grid grid-cols-1 lg:grid-cols-6 w-screen sm:w-11/12'>
        {DIAS_SEMANA.map(({ nombre, codigo }, indice) => (
          <ColumnaDia
            key={codigo}
            dia={nombre}
            secciones={seccionesPorDia[codigo] ?? []}
            className={indice === DIAS_SEMANA.length - 1
              ? "border border-slate-300 dark:border-white/15"
              : "border-l border-t border-b border-slate-300 dark:border-white/15"}
          />
        ))}
      </div>
    </div>
  );
}

/*
  Componente que muestra el horario de las secciones en una tabla con bloques de tiempo

  @param horario El horario a mostrar
*/
export function CalendarioConBloques({horario, bloquesUsuario, grupos, verNombreCurso}: {horario: Horario, bloquesUsuario: {[titulo: string]: BloqueTiempo[]}, grupos: GrupoCurso[], verNombreCurso: boolean}) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = ObtenerSeccionesPorDia(horario);
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = ObtenerBloquesPorDia(Object.values(bloquesUsuario).flat());

  return (
    <div className='flex justify-center items-center w-full pt-4 font-sans text-slate-900 dark:text-slate-100'>
      <HorasCalendario/>
      <div className='grid grid-cols-1 lg:grid-cols-6 w-full sm:w-11/12'>
        {DIAS_SEMANA.map(({ nombre, codigo }, indice) => (
          <ColumnaDia
            key={codigo}
            dia={nombre}
            secciones={seccionesPorDia[codigo] ?? []}
            bloques={bloquesPorDia[codigo] ?? []}
            grupos={grupos}
            verNombreCurso={verNombreCurso}
            className={indice === DIAS_SEMANA.length - 1
              ? "border border-slate-300 dark:border-white/15"
              : "border-l border-t border-b border-slate-300 dark:border-white/15"}
          />
        ))}
      </div>
    </div>
  );
}

/*
  Componente que muestra las horas en el calendario
  Se suma 18px para compensar el texto falta de alineación con las líneas del calendario que tiene text-lg (18px) de tamaño de fuente
*/
function HorasCalendario() {
  const horas = ObtenerRangoHoras();
  return (
    <div className="relative h-[750px] hidden md:block w-12">
      <div className="relative h-full">
        {horas.map(hora => (<p className="absolute w-full text-center text-xs font-medium text-slate-500 dark:text-slate-400" style={{ top: `${tiempoAPixeles(hora) + 18}px` }} key={hora}>{tiempoNumeroATexto(hora)}</p>))}
      </div>
    </div>
  );
}

/*
  Función que obtiene los rangos de horas a mostrar en el horario
*/
function ObtenerRangoHoras(){
  return [600,700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];
}

/*
  Función que obtiene las secciones por cada día de la semana

  @param horario El horario a mostrar
*/
function ObtenerSeccionesPorDia(horario: Horario) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = {};
  horario?.secciones.forEach(seccion => {
    seccion.horarios.forEach(horario => {
      horario.dias.forEach(dia => {
        if (seccionesPorDia[dia] === undefined) seccionesPorDia[dia] = [];
        seccionesPorDia[dia].push([seccion, horario]);
      });
    });
  });
  return seccionesPorDia;
}

/*
  Función que obtiene los bloques de tiempo por cada día de la semana

  @param bloques Los bloques de tiempo a mostrar
*/
function ObtenerBloquesPorDia(bloques: BloqueTiempo[]) {
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = {};
  bloques.forEach(bloque => {
    bloque.dias.forEach(dia => {
      if (bloquesPorDia[dia] === undefined) bloquesPorDia[dia] = [];
      bloquesPorDia[dia].push(bloque);
    });
  });
  return bloquesPorDia;
}

/*
  Componente que muestra las secciones de un día en una columna

  @param dia El nombre del día
  @param secciones Las secciones a mostrar
  @param className La clase css adicional
*/
function ColumnaDia({ dia, className, secciones, bloques, grupos = [], verNombreCurso } : { dia: string, className: string, secciones: [Seccion, BloqueTiempo][], bloques?: BloqueTiempo[], grupos?: GrupoCurso[], verNombreCurso?: boolean }) {
  const horas = ObtenerRangoHoras();
  return (
    <div className={`relative flex h-[750px] flex-col bg-slate-50/70 dark:bg-white/[0.025] ${className}`}>
      <h2 className='text-center text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100'>{dia}</h2>
      <div className="relative h-full">
        {horas.map(hora => (<hr className="absolute w-full border-slate-200 dark:border-white/10" style={{ top: `${tiempoAPixeles(hora)}px` }} key={hora}></hr>))}
        <div className='relative h-full flex flex-col justify-center items-center'>
          {secciones?.map(([seccion, bloque],idx) => <BloqueSeccion seccion={seccion} bloque={bloque} grupos={grupos} key={idx} verNombreCurso={verNombreCurso ?? false}/>)}
          {bloques?.map((bloque,idx) => <Bloque bloque={bloque} key={idx}/>)}
        </div>
      </div>
    </div>
  );
}

/*
  Función que obtiene el ancho de una sección en porcentaje

  @param seccion La sección a mostrar
*/
function obtenerAnchoSeccionPorcentaje(seccion: Seccion) {
  if (seccion.duracion === "16") {
    return 95;
  }
  return 45;
}

/*
  Componente que muestra una sección en el horario

  @param seccion La sección a mostrar
  @param bloque El bloque de tiempo a mostrar
*/
function obtenerDistanciaBordeIzquierdo(seccion: Seccion) {
  if (seccion.duracion === "8A") {
    return "2.5%";
  }
  return "auto";
}

/*
  Componente que muestra una sección en el horario

  @param seccion La sección a mostrar
  @param bloque El bloque de tiempo a mostrar
*/
function obtenerDistanciaBordeDerecho(seccion: Seccion) {
  if (seccion.duracion === "8B") {
    return "2.5%";
  }
  return "auto";
}

/*
  Función que asigna un color de fondo a una sección dependiendo de su disponibilidad

  @param seccion La sección a mostrar
*/
function obtenerColoresSeccion(seccion: Seccion) {
  const esVirtual = seccion.modalidad.toString() === "VIRTUAL";
  const disponibilidad = 1 - (Math.min(seccion.cuposTomados,seccion.cuposMaximos) / Math.max(seccion.cuposMaximos,1));
  if (disponibilidad <= 0) return COLORES_SIN_CUPOS;

  const paleta = esVirtual
    ? PALETA_DISPONIBILIDAD.virtual
    : PALETA_DISPONIBILIDAD.presencial;
  return paleta.find(({ minimo }) => disponibilidad >= minimo) ?? COLORES_SIN_CUPOS;
}
/*
  Componente que muestra una sección en el horario

  @param seccion La sección a mostrar
  @param bloque El bloque de tiempo a mostrar
*/
function BloqueSeccion({seccion, bloque, grupos, verNombreCurso} : {seccion: Seccion, bloque: BloqueTiempo, grupos: GrupoCurso[], verNombreCurso: boolean}) {
  const tiempoInicialAPixeles = tiempoAPixeles(bloque.horaInicio);
  const tiempoFinalAPixeles = tiempoAPixeles(bloque.horaFin);
  const alturaBloqueEnPixeles = tiempoFinalAPixeles - tiempoInicialAPixeles;
  const anchobloqueEnPorcentaje = obtenerAnchoSeccionPorcentaje(seccion);
  const distanciaBordeDerecho =  obtenerDistanciaBordeDerecho(seccion)
  const distanciaBordeIzquierdo = obtenerDistanciaBordeIzquierdo(seccion)
  const [popoverOpen, setPopoverOpen] = useState(false);
  const codigoCurso = seccion.curso.programa + seccion.curso.curso;
  const gruposDeSeccion = grupos.filter((grupo) => grupo.cursos.includes(codigoCurso));
  const coloresSeccion = obtenerColoresSeccion(seccion);

  function openPopover() {
    setPopoverOpen(!popoverOpen);
  }

  return (

    <div
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={popoverOpen}
      onKeyDown={(evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          setPopoverOpen((estaAbierto) => !estaAbierto);
        }
      }}
      className={`group absolute flex cursor-pointer items-center justify-center rounded border-2 ${
        popoverOpen ? "z-50" : "z-10"
      }       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 dark:focus-visible:outline-amber-300`}
      onClick={openPopover} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}
      style={{height: `${alturaBloqueEnPixeles}px`, width: `${anchobloqueEnPorcentaje}%` , 
        backgroundColor: coloresSeccion.fondo, borderColor: coloresSeccion.borde,
        top: `${(tiempoInicialAPixeles)}px` ,  left: `${distanciaBordeIzquierdo}`, right: `${distanciaBordeDerecho}`}}>
      <div className="w-full min-w-0 text-center text-[10px] md:text-xs dark:text-black">
        <p className="block max-w-full truncate">{`${seccion.curso.programa} ${seccion.curso.curso} ${seccion.seccion}`}</p>
        <p className="block max-w-full truncate md:hidden">{tiempoNumeroATexto(bloque.horaInicio)} - {tiempoNumeroATexto(bloque.horaFin)}</p>
        <p className="block max-w-full truncate">{verNombreCurso ? seccion.titulo : seccion.profesores[0]?.nombre}</p>
        {gruposDeSeccion.length > 0 && (
          <p
            className="mx-auto max-w-[90%] truncate rounded bg-white/70 px-1 text-[9px] leading-tight"
            title={gruposDeSeccion.map((grupo) => grupo.nombre).join(", ")}
          >
            {gruposDeSeccion.map((grupo) => grupo.nombre).join(", ")}
          </p>
        )}
        <Popover open={popoverOpen}>
          <PopoverContent side={bloque.horaInicio < 1000 ? "bottom" : "top"}>
            <Card>
              <CardHeader>
                <CardTitle>{seccion.titulo}</CardTitle>
                <CardDescription>
                  <p>{`${seccion.curso.programa} ${seccion.curso.curso} Sección ${seccion.seccion}`}</p>
                  <p>NRC: {seccion.nrc}</p>
                  {gruposDeSeccion.length > 0 && (
                    <p>Grupo{gruposDeSeccion.length > 1 ? "s" : ""}: {gruposDeSeccion.map((grupo) => grupo.nombre).join(", ")}</p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Profesores:</p>
                <ul>
                  {seccion.profesores.map((profesor, idx) => <li key={idx}>{profesor.nombre}</li>)}
                </ul>
              </CardContent>
              <CardFooter className="flex-nowrap gap-1.5">
                {
                  seccion.cuposMaximos === seccion.cuposTomados ?
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-200 dark:ring-red-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span className='w-0.5'></span>
                    Sin Cupos
                  </span>
                  :
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-200 dark:ring-green-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span className='w-0.5'></span>
                    {`${seccion.cuposMaximos-seccion.cuposTomados}/${seccion.cuposMaximos} Cupos`}
                  </span>
                }
                {
                  seccion.modalidad.toString() === "VIRTUAL" ?
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-purple-50 px-2 py-1 text-[10px] font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10 dark:bg-purple-400/10 dark:text-purple-200 dark:ring-purple-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="size-4">
                      <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/>
                    </svg>
                    <span className='w-0.5'></span>
                    {seccion.modalidad.toString()}
                  </span>
                  :
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/10 dark:bg-green-400/10 dark:text-green-200 dark:ring-green-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="size-4">
                      <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/>
                    </svg>
                    <span className='w-0.5'></span>
                    {seccion.modalidad.toString()}
                  </span>
                }
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

/*
  Componente que muestra un bloque de tiempo en el horario

  @param bloque El bloque de tiempo a mostrar
*/
function Bloque({bloque} : {bloque: BloqueTiempo}) {
  const tiempoInicialAPixeles = tiempoAPixeles(bloque.horaInicio);
  const tiempoFinalAPixeles = tiempoAPixeles(bloque.horaFin);
  const alturaBloqueEnPixeles = tiempoFinalAPixeles - tiempoInicialAPixeles;
  return (
    <div className='absolute flex items-center justify-center rounded border-2 border-slate-400 bg-slate-100 text-center text-slate-800 dark:border-slate-500 dark:bg-neutral-700 dark:text-slate-100' style={{ top: `${(tiempoInicialAPixeles)}px` , height: `${alturaBloqueEnPixeles}px`, width:"95%"}}>
      <div>
        <p className="text-center text-sm">{bloque.titulo} <span className='md:hidden'>{tiempoNumeroATexto(bloque.horaInicio)} - {tiempoNumeroATexto(bloque.horaFin)}</span></p>
      </div>
    </div>
  );
}