"use client";
import { tiempoAPixeles, tiempoNumeroATexto } from '@/services/formateadorTiempo';
import Horario from '@/models/Horario';
import Seccion from '@/models/Seccion';
import BloqueTiempo from '@/models/BloqueTiempo';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from 'react';


/*
  Componente que muestra el horario de las secciones en una tabla

  @param horario El horario a mostrar
*/
export function Calendario({horario}: {horario: Horario}) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = ObtenerSeccionesPorDia(horario);
  return (
    <div className='flex justify-center items-center w-full pt-4'>
      <HorasCalendario/>
      <div className='grid grid-cols-1 lg:grid-cols-6 w-screen sm:w-11/12'>
        <ColumnaDia dia="Lunes" secciones={seccionesPorDia["l"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Martes" secciones={seccionesPorDia["m"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Miércoles" secciones={seccionesPorDia["i"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Jueves" secciones={seccionesPorDia["j"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Viernes" secciones={seccionesPorDia["v"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Sábado" secciones={seccionesPorDia["s"]} className="border border-gray-400"/>
      </div>
    </div>
  );
}

/*
  Componente que muestra el horario de las secciones en una tabla con bloques de tiempo

  @param horario El horario a mostrar
*/
export function CalendarioConBloques({horario, bloquesUsuario, verNombreCurso}: {horario: Horario, bloquesUsuario: {[titulo: string]: BloqueTiempo[]}, verNombreCurso: boolean}) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = ObtenerSeccionesPorDia(horario);
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = ObtenerBloquesPorDia(Object.values(bloquesUsuario).flat());

  return (
    <div className='flex justify-center items-center w-full pt-4'>
      <HorasCalendario/>
      <div className='grid grid-cols-1 lg:grid-cols-6 w-full sm:w-11/12'>
        <ColumnaDia dia="Lunes" secciones={seccionesPorDia["l"]} bloques={bloquesPorDia["l"]} verNombreCurso={verNombreCurso} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Martes" secciones={seccionesPorDia["m"]} bloques={bloquesPorDia["m"]} verNombreCurso={verNombreCurso}  className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Miércoles" secciones={seccionesPorDia["i"]} bloques={bloquesPorDia["i"]} verNombreCurso={verNombreCurso}  className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Jueves" secciones={seccionesPorDia["j"]} bloques={bloquesPorDia["j"]} verNombreCurso={verNombreCurso}  className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Viernes" secciones={seccionesPorDia["v"]} bloques={bloquesPorDia["v"]} verNombreCurso={verNombreCurso}  className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Sábado" secciones={seccionesPorDia["s"]}  bloques={bloquesPorDia["s"]} verNombreCurso={verNombreCurso}  className="border border-gray-400"/>
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
        {horas.map(hora => (<p className="absolute text-gray-400 text-center w-full" style={{ top: `${tiempoAPixeles(hora) + 18}px` }} key={hora}>{tiempoNumeroATexto(hora)}</p>))}
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
function ColumnaDia({ dia, className, secciones, bloques, verNombreCurso } : { dia: string, className: string, secciones: [Seccion, BloqueTiempo][], bloques?: BloqueTiempo[], verNombreCurso?: boolean }) {
  const horas = ObtenerRangoHoras();
  return (
    <div className={`flex flex-col relative ${className} h-[750px]`}>
      <h2 className='text-center text-lg'>{dia}</h2>
      <div className="relative h-full">
        {horas.map(hora => (<hr className="border-gray-300 absolute border-1 w-full" style={{ top: `${tiempoAPixeles(hora)}px` }} key={hora}></hr>))}
        <div className='relative h-full flex flex-col justify-center items-center'>
          {secciones?.map(([seccion, bloque],idx) => <BloqueSeccion seccion={seccion} bloque={bloque} key={idx} verNombreCurso={verNombreCurso ?? false}/>)}
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
  if (seccion.periodo === "16") {
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
  if (seccion.periodo === "8A") {
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
  if (seccion.periodo === "8B") {
    return "2.5%";
  }
  return "auto";
}

/*
  Función que asigna un color de fondo a una sección dependiendo de su disponibilidad

  @param seccion La sección a mostrar
*/
function obtenerColorFondoSeccion(seccion: Seccion) {
  const disponibilidad = 1 - (Math.min(seccion.cuposTomados,seccion.cuposMaximos) / Math.max(seccion.cuposMaximos,1));
  if (disponibilidad >= 0.8) return "#86efac";
  if (disponibilidad >= 0.6) return "#bef264";
  if (disponibilidad >= 0.4) return "#fde047";
  if (disponibilidad >= 0.2) return "#fdba74";
  if (disponibilidad > 0.0) return "#fca5a5";
  return "#cbd5e1";
}

/*
  Función que asigna un color de borde a una sección dependiendo de su disponibilidad

  @param seccion La sección a mostrar
*/
function obtenerColorBordeSeccion(seccion: Seccion) {
  const disponibilidad = 1 - (Math.min(seccion.cuposTomados,seccion.cuposMaximos) / Math.max(seccion.cuposMaximos,1));
  if (disponibilidad >= 0.8) return "#22c55e";
  if (disponibilidad >= 0.6) return "#84cc16";
  if (disponibilidad >= 0.4) return "#eab308";
  if (disponibilidad >= 0.2) return "#f97316";
  if (disponibilidad > 0.0) return "#ef4444";
  return "#6b7280";
}
/*
  Componente que muestra una sección en el horario

  @param seccion La sección a mostrar
  @param bloque El bloque de tiempo a mostrar
*/
function BloqueSeccion({seccion, bloque, verNombreCurso} : {seccion: Seccion, bloque: BloqueTiempo, verNombreCurso: boolean}) {
  const tiempoInicialAPixeles = tiempoAPixeles(bloque.horaInicio);
  const tiempoFinalAPixeles = tiempoAPixeles(bloque.horaFin);
  const alturaBloqueEnPixeles = tiempoFinalAPixeles - tiempoInicialAPixeles;
  const anchobloqueEnPorcentaje = obtenerAnchoSeccionPorcentaje(seccion);
  const distanciaBordeDerecho =  obtenerDistanciaBordeDerecho(seccion)
  const distanciaBordeIzquierdo = obtenerDistanciaBordeIzquierdo(seccion)
  const [popoverOpen, setPopoverOpen] = useState(false);

  function openPopover() {
    setPopoverOpen(!popoverOpen);
  }

  return (

    <div className='absolute rounded border-2 flex items-center justify-center cursor-pointer'
      onClick={openPopover} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}
      style={{height: `${alturaBloqueEnPixeles}px`, width: `${anchobloqueEnPorcentaje}%` , 
        backgroundColor: `${obtenerColorFondoSeccion(seccion)}`, borderColor: `${obtenerColorBordeSeccion(seccion)}`,
        top: `${(tiempoInicialAPixeles)}px` ,  left: `${distanciaBordeIzquierdo}`, right: `${distanciaBordeDerecho}`}}>
      <div className="text-center truncate text-[10px] md:text-xs dark:text-black">
        <p className="whitespace-nowrap  overflow-hidden text-ellipsis">{`${seccion.curso.programa} ${seccion.curso.curso} ${seccion.seccion}`}</p>
        <p className="whitespace-nowrap  overflow-hidden text-ellipsis md:hidden">{tiempoNumeroATexto(bloque.horaInicio)} - {tiempoNumeroATexto(bloque.horaFin)}</p>
        <p className="whitespace-nowrap  overflow-hidden text-ellipsis">{verNombreCurso ? seccion.titulo : seccion.profesores[0]?.nombre}</p>
        <Popover open={popoverOpen}>
          <PopoverTrigger></PopoverTrigger>
          <PopoverContent side='top'>
            <Card>
              <CardHeader>
                <CardTitle>{seccion.titulo}</CardTitle>
                <CardDescription>
                  <p>{`${seccion.curso.programa} ${seccion.curso.curso} Sección ${seccion.seccion}`}</p>
                  <p>NRC: {seccion.nrc}</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Profesores:</p>
                <ul>
                  {seccion.profesores.map((profesor, idx) => <li key={idx}>{profesor.nombre}</li>)}
                </ul>
              </CardContent>
              <CardFooter>
                {
                  seccion.cuposMaximos === seccion.cuposTomados ?
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span className='w-1'></span>
                    Sin Cupos
                  </span>
                  :
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span className='w-1'></span>
                    {`${seccion.cuposMaximos-seccion.cuposTomados}/${seccion.cuposMaximos} Cupos`}
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
    <div className='absolute rounded border-2 border-gray-400 bg-gray-200 flex items-center justify-center dark:bg-neutral-600 text-center' style={{ top: `${(tiempoInicialAPixeles)}px` , height: `${alturaBloqueEnPixeles}px`, width:"95%"}}>
      <div>
        <p className="text-center text-sm">{bloque.titulo} <span className='md:hidden'>{tiempoNumeroATexto(bloque.horaInicio)} - {tiempoNumeroATexto(bloque.horaFin)}</span></p>
      </div>
    </div>
  );
}