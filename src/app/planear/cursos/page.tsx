"use client";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { buscarCurso } from '@/services/fetcher';
import { cursoTieneSeccionGuardada, obtenerCursosGuardados, eliminarCursoGuardado, guardarSeccionDeCurso, añadirVariasSeccionesDeCurso } from '@/services/almacenamiento/almacenamientoCursos';
import { EstadosCursos } from '@/types/contexto'
import Curso from '@/models/Curso';
import Seccion from '@/models/Seccion';
import Tooltip from '@/components/tooltip';

/*
  Contexto que comparte los estados y funciones que se comparten entre los componentes de la página de cursos
*/
const CursoContext = createContext<EstadosCursos>({ cursosGuardados: {}, setCursosGuardados: () => {}, cursoABuscar: "", setCursoABuscar: () => {} });

/*
  Página de planear cursos
  Incluye la sección de planeación de cursos y la sección de cursos planeados
*/
export default function Cursos() {
  const [cursosGuardados, setCursosGuardados] = useState<{ [codigo: string]: number[] }>({});
  const [cursoABuscar, setCursoABuscar] = useState("");
  useEffect(() => {
    setCursosGuardados(obtenerCursosGuardados());
  }, []);
  return (
    <CursoContext.Provider value={{ cursosGuardados, setCursosGuardados, cursoABuscar, setCursoABuscar }}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Planeacion />
        <CursosPlaneados />
      </div>
    </CursoContext.Provider>
  )
}

/*
  Sección de planeación de cursos
  Incluye la búsqueda de cursos y la visualización de los cursos encontrados y seleccionados
*/
function Planeacion() {
  const { cursoABuscar, setCursoABuscar } = useContext(CursoContext);
  const [ cursosEncontrados, setCursosEncontrados] = useState<{ [codigo: string]: Curso }>({});
  const [ cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [ cargando, setCargando ] = useState(false);
  useEffect(() => {
    const consultarCurso = async () => {
      if (cursoABuscar) {
        setCargando(true);
        setCursosEncontrados({});
        setCursoSeleccionado(null);
        setCursosEncontrados(await buscarCurso(cursoABuscar));
        setCargando(false);
      }
    };
    consultarCurso();
  }, [cursoABuscar]);
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') setCursoABuscar((event.target as HTMLInputElement).value);
  }
  const handleSeleccionDeCurso = (curso: Curso) => {
    setCursoABuscar("");
    setCursoSeleccionado(curso);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className='mx-auto w-[80%] min-w-44 pt-8'>
      <h2 className='text-2xl font-semibold'>Busca cursos</h2>
      <div className=' my-4 '>
        <label className='w-full text-lg' htmlFor="searchCourses" >Empieza por ingresar uno de tus cursos. Luego, haz click sobre las secciones que te interesa tener en tu horario ideal.</label>
        <br />
        <input ref={inputRef} className='w-full text-lg bg-gray-100 dark:bg-neutral-600 focus:outline-none border border-1 border-gray-300 focus:border-gray-400 text-center'  id="searchCourses" type="search" placeholder="DECA1101, NRC o nombre" onKeyDown={handleEnter} />
        <div className='flex items-center mt-2 mb-4'>
          <button className="my-4 w-40 h-12 mx-auto block bg-yellow-300 rounded border-2 border-black hover:bg-yellow-400 transition-colors duration-300 ease-in-out dark:text-black" onClick={() => { if (inputRef.current) setCursoABuscar(inputRef.current.value); }}>Buscar</button>
        </div>
      </div>
      {cargando && <p className='text-lg font-semibold'>Buscando cursos...</p>}
      {cursoABuscar && !cargando && Object.keys(cursosEncontrados).length === 0 && <p className='text-lg font-semibold'>No se encontraron cursos</p>}
      {cursoSeleccionado ? <DetallesCursoSeleccionado curso={cursoSeleccionado} /> : <DetallesCursosEncontrados cursos={Object.values(cursosEncontrados)} funcionSeleccionDeCurso={handleSeleccionDeCurso} />}
    </div>
  )
}

/*
  Detalles de los cursos encontrados en la búsqueda del usuario

  @param cursos cursos encontrados
  @param funcionSeleccionDeCurso función que se ejecuta cuando se selecciona un curso
*/
function DetallesCursosEncontrados({ cursos, funcionSeleccionDeCurso }: { cursos: Curso[], funcionSeleccionDeCurso: (curso: Curso) => void }) {
  return (
    <div>
      {cursos.length > 0 && <p className='text-lg font-semibold'>Cursos encontrados:</p>}
      {cursos.map((curso) => <CursoEncontrado curso={curso} key={curso.programa + curso.curso} funcionSeleccionDeCurso={() => funcionSeleccionDeCurso(curso)} />)}
    </div>
  )
}

/*
  Curso encontrado en la búsqueda del usuario

  @param curso curso encontrado
  @param funcionSeleccionDeCurso función que se ejecuta cuando se selecciona el curso
*/
function CursoEncontrado({ curso, funcionSeleccionDeCurso }: { curso: Curso, funcionSeleccionDeCurso: () => void }) {
  return (
    <div className="bg-gray-100 dark:bg-neutral-600 text-center  flex  border border-3 border-black  h-36   my-3" >
      <div className='mx-auto flex flex-col justify-center'>
        <h3 className="text-lg font-semibold">{curso.descripcion}</h3>
        <p>{curso.programa}</p>
        <p>{curso.curso}</p>
        <p>{curso.creditos}</p>
      </div>
      <button className='bg-yellow-400 flex items-center justify-center w-8' onClick={funcionSeleccionDeCurso} title='Seleccionar curso'>
        <Image src="/Mi-Horario-Uniandes/static/lupa.svg" alt="Seleccionar curso" width="0" height="0" className='w-6 h-auto' />
      </button>
    </div>
  )
}

/*
  Detalles del curso consultado por el usuario y sus secciones

  @param curso curso consultado por el usuario
*/
function DetallesCursoSeleccionado({ curso }: { curso: Curso}) {
  return (
    <div>
      <CursoSeleccionado curso={curso} />
      <BotonesSeleccion curso={curso}/>
      {curso.secciones.map((seccion) =>
        <SeccionCursoSeleccionado seccion={seccion} key={seccion.nrc}/>
      )}
    </div>
  )
}

/*
  Curso seleccionado por el usuario

  @param curso curso seleccionado
*/
function CursoSeleccionado({ curso }: { curso: Curso }) {
  return (
    <div className="bg-gray-300 dark:bg-neutral-600 text-center  flex border border-3 border-black  h-36  flex-col justify-center my-3">
      <h3 className="text-lg font-semibold">{curso.descripcion}</h3>
      <p>{curso.programa}{curso.curso}</p>
      <p>{curso.creditos} créditos</p>
    </div>
  )
}

/*
  Botones para seleccionar todas las secciones, seleccionar solo las secciones con cupo y eliminar todas las secciones

  @param curso curso seleccionado
*/
function BotonesSeleccion({ curso }: { curso: Curso }) {
  return (
    <div className='flex place-content-center'>
      <BotonSeleccionarTodas curso={curso} />
      <BotonSeleccionarValidas curso={curso} />
      <BotonEliminarTodas curso={curso} />
    </div>
  )
}

/*
  Botón para seleccionar todas las secciones de un curso

  @param curso curso seleccionado
*/
function BotonSeleccionarTodas({ curso }: { curso: Curso }) {
  const { setCursosGuardados } = useContext(CursoContext);
  const handleClic = () => {
    añadirVariasSeccionesDeCurso(curso.programa + curso.curso, curso.secciones.map((seccion) => seccion.seccion));
    setCursosGuardados(obtenerCursosGuardados());
  }
  return (
    <Tooltip mensaje='Seleccionar todas'>
      <button className='icon-svg' onClick={handleClic}>
        <Image src="/Mi-Horario-Uniandes/static/seleccionarTodas.svg" alt="Seleccionar todas" width={35} height={35} />
      </button>
    </Tooltip>
  )
}

/*
  Botón para seleccionar solo las secciones con cupo de un curso

  @param curso curso seleccionado
*/
function BotonSeleccionarValidas({ curso }: { curso: Curso }) {
  const { setCursosGuardados } = useContext(CursoContext);
  const handleClic = () => {
    añadirVariasSeccionesDeCurso(curso.programa + curso.curso, curso.secciones.filter((seccion) => seccion.cuposTomados < seccion.cuposMaximos).map((seccion) => seccion.seccion));
    setCursosGuardados(obtenerCursosGuardados());
  }
  return (
    <Tooltip mensaje='Seleccionar con cupo'>
      <button className='icon-svg' onClick={handleClic}>
        <Image src="/Mi-Horario-Uniandes/static/seleccionarValidas.svg" alt="Seleccionar validas" width={35} height={35} />
      </button>
    </Tooltip>
  )
}

/*
  Botón para eliminar todas las secciones de un curso

  @param curso curso seleccionado
*/
function BotonEliminarTodas({ curso }: { curso: Curso }) {
  const { setCursosGuardados } = useContext(CursoContext);
  const handleClic = () => {
    eliminarCursoGuardado(curso.programa + curso.curso);
    setCursosGuardados(obtenerCursosGuardados());
  }
  return (
    <Tooltip mensaje='Eliminar todas'>
      <button className='icon-svg' onClick={handleClic}>
        <Image src="/Mi-Horario-Uniandes/static/eliminarTodas.svg" alt="Eliminar todas" width={35} height={35} />
      </button>
    </Tooltip>
  )
}

/*
  Sección de un curso seleccionado por el usuario

  @param seccion sección del curso
*/
function SeccionCursoSeleccionado({ seccion }: { seccion: Seccion }) {
  const { setCursosGuardados } = useContext(CursoContext);
  const handleAñadir = () => {
    guardarSeccionDeCurso(seccion.curso.programa + seccion.curso.curso, seccion.seccion);
    setCursosGuardados(obtenerCursosGuardados());
  }
  return (
    <div className="bg-gray-100 dark:bg-neutral-600 text-center  flex  border border-3 border-black  sm:h-44  my-3">
      <div className='mx-auto flex flex-col justify-center'>
        <h3 className="text-lg font-semibold">{seccion.titulo}</h3>
        <p>NRC: {seccion.nrc} SECCIÓN: {seccion.seccion}</p>
        <p>Se han inscrito {seccion.cuposTomados} de {seccion.cuposMaximos} estudiantes</p>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
          {seccion.cuposMaximos > 0 && <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${(Math.min(seccion.cuposTomados,seccion.cuposMaximos) / seccion.cuposMaximos) * 100}%` }}></div>}
        </div>
        <p>{seccion.profesores.map((profesor) => profesor.nombre).join(", ")}</p>
        <p>{seccion.horarios.map((bloque) => bloque.dias.map(dia => dia.toUpperCase()).join("") + " " + bloque.horaInicio + " " + bloque.horaFin).join(", ")}</p>
      </div>
      <button className='bg-yellow-400 flex items-center justify-center w-8 text-2xl font-semibold dark:text-black' onClick={handleAñadir} title='Añadir o quitar sección'>{cursoTieneSeccionGuardada(seccion.curso.programa + seccion.curso.curso, seccion.seccion) ? "-" : "+"}</button>
    </div>
  )
}

/*
  Cursos planificados por el usuario
*/
function CursosPlaneados() {
  const { cursosGuardados } = useContext(CursoContext);
  return (
    <div className='mx-auto w-[80%] min-w-44 pt-8'>
      <h2 className='text-2xl font-semibold'>Tus cursos planeados</h2>
      <p className='text-lg my-2'>Aquí puedes ver los cursos que has elegido</p>
      {Object.keys(cursosGuardados).map((codigo) => <CursoPlaneado codigo={codigo} secciones={cursosGuardados[codigo]} key={codigo} />)}
    </div>
  )
}

/*
  Curso planificado por el usuario

  @param codigo código del curso
  @param secciones secciones del curso
*/
function CursoPlaneado({ codigo, secciones}: { codigo: string, secciones: number[]}) {
  const { setCursosGuardados, setCursoABuscar } = useContext(CursoContext);
  const handleBusqueda = () => {
    setCursoABuscar(codigo);
  }
  const handleEliminacion = () => {
    eliminarCursoGuardado(codigo);
    setCursosGuardados(obtenerCursosGuardados());
  }
  return (
    <div className="bg-gray-100 dark:bg-neutral-600 text-center  flex flex-col  border border-3 border-black  min-h-24  my-3">
      <div className='bg-yellow-400 flex h-8 place-content-end'>
        <Image src="/Mi-Horario-Uniandes/static/lupa.svg" alt="Buscar curso" width="0" height="0"   className='cursor-pointer mr-3 w-6 h-auto' onClick={handleBusqueda} title="Buscar curso"/>
        <Image src="/Mi-Horario-Uniandes/static/cruz.svg" alt="Eliminar curso"  width="0" height="0" className='cursor-pointer mr-3 w-6 h-auto' onClick={handleEliminacion} title="Eliminar curso"/>
      </div>
      <h3 className="text-lg font-semibold">{codigo}</h3>
      <p className="text-muted-foreground dark:text-neutral-300">Secciones: {secciones.join(", ")}</p>
    </div>
  )
}