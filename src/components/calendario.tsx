"use client";
import { tiempoAMinutos } from '@/services/formateadorTiempo';
import Horario from '@/models/Horario';
import Seccion from '@/models/Seccion';
import BloqueTiempo from '@/models/BloqueTiempo';
import { obtenerBloquesGuardados } from '@/services/almacenamiento/almacenamientoBloques';

/*
  Componente que muestra el horario de las secciones en una tabla

  @param horario El horario a mostrar
*/
export function Calendario({horario}: {horario: Horario}) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = ObtenerSeccionesPorDia(horario);

  console.log(seccionesPorDia);
  return (
    <div className='flex justify-center items-center w-full pt-4'>
      <div className='grid grid-cols-1 md:grid-cols-6 w-screen sm:w-11/12'>
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
export function CalendarioConBloques({horario, bloquesUsuario}: {horario: Horario, bloquesUsuario: {[titulo: string]: BloqueTiempo[]}}) {
  const seccionesPorDia: {[dia: string]: [Seccion, BloqueTiempo][]} = ObtenerSeccionesPorDia(horario);
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = ObtenerBloquesPorDia(Object.values(bloquesUsuario).flat());

  return (
    <div className='flex justify-center items-center w-full pt-4'>
      <div className='grid grid-cols-1 md:grid-cols-6 w-screen sm:w-11/12'>
        <ColumnaDia dia="Lunes" secciones={seccionesPorDia["l"]} bloques={bloquesPorDia["l"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Martes" secciones={seccionesPorDia["m"]} bloques={bloquesPorDia["m"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Miércoles" secciones={seccionesPorDia["i"]} bloques={bloquesPorDia["i"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Jueves" secciones={seccionesPorDia["j"]} bloques={bloquesPorDia["j"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Viernes" secciones={seccionesPorDia["v"]} bloques={bloquesPorDia["v"]} className="border-l border-t border-b border-gray-400"/>
        <ColumnaDia dia="Sábado" secciones={seccionesPorDia["s"]}  bloques={bloquesPorDia["s"]} className="border border-gray-400"/>
      </div>
    </div>
  );
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
function ColumnaDia({ dia, className, secciones, bloques } : { dia: string, className: string, secciones: [Seccion, BloqueTiempo][], bloques?: BloqueTiempo[] }) {
  return (
    <div className={`flex flex-col relative ${className} h-[700px]`}>
      <h2 className='text-center border-b border-gray-400 text-lg'>{dia}</h2>
      <div className='relative h-full flex flex-col justify-center items-center'>
        {secciones?.map(([seccion, bloque],idx) => <BloqueSeccion seccion={seccion} bloque={bloque} key={idx}/>)}
        {bloques?.map((bloque,idx) => <Bloque bloque={bloque} key={idx}/>)}
      </div>
    </div>
  );
}

/*
  Componente que muestra una sección en el horario

  @param seccion La sección a mostrar
  @param bloque El bloque de tiempo a mostrar
*/
function BloqueSeccion({seccion, bloque} : {seccion: Seccion, bloque: BloqueTiempo}) {
  const tiempoInicialAPixeles = Math.floor((tiempoAMinutos(bloque.horaInicio) - tiempoAMinutos(600)) * 0.75);
  const tiempoFinalAPixeles = Math.floor((tiempoAMinutos(bloque.horaFin) - tiempoAMinutos(600)) * 0.75);
  const alturaBloqueEnPixeles = tiempoFinalAPixeles - tiempoInicialAPixeles;
  return (
    <div className='absolute  w-11/12 rounded border-2 border-yellow-400 bg-yellow-200 flex items-center justify-center' style={{ top: `${(tiempoInicialAPixeles)}px` , height: `${alturaBloqueEnPixeles}px` }}>
      <div>
        <p className="text-center text-sm">{seccion.curso.programa + seccion.curso.curso}</p>
        <p className="text-center text-sm">{seccion.seccion}</p>
      </div>
      <p className="text-center text-sm">{seccion.profesores[0].nombre}</p>
      <p className="text-center text-sm" >{bloque.horaInicio} - {bloque.horaFin}</p>
    </div>
  );
}

/*
  Componente que muestra un bloque de tiempo en el horario

  @param bloque El bloque de tiempo a mostrar
*/
function Bloque({bloque} : {bloque: BloqueTiempo}) {
  const tiempoInicialAPixeles = Math.floor((tiempoAMinutos(bloque.horaInicio) - tiempoAMinutos(600)) * 0.75);
  const tiempoFinalAPixeles = Math.floor((tiempoAMinutos(bloque.horaFin) - tiempoAMinutos(600)) * 0.75);
  const alturaBloqueEnPixeles = tiempoFinalAPixeles - tiempoInicialAPixeles;
  return (
    <div className='absolute w-11/12 rounded border-2 border-gray-400 bg-gray-200 flex items-center justify-center' style={{ top: `${(tiempoInicialAPixeles)}px` , height: `${alturaBloqueEnPixeles}px` }}>
      <div>
        <p className="text-center text-sm">{bloque.titulo}</p>
        <p className="text-center text-sm">{bloque.horaInicio} - {bloque.horaFin}</p>
      </div>
    </div>
  );
}