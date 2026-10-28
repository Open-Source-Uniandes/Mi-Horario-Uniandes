"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { buscarCurso } from "@/services/fetcher"
import {
  cursoTieneSeccionGuardada,
  obtenerCursosGuardados,
  eliminarCursoGuardado,
  guardarSeccionDeCurso,
  añadirVariasSeccionesDeCurso,
} from "@/services/almacenamiento/almacenamientoCursos"
import {
  guardarGrupos,
  obtenerGruposGuardados,
  type GrupoCurso,
} from "@/services/almacenamiento/almacenamientoGrupos"
import { limpiarGruposSinCursos } from "@/services/operacionesGrupos"
import type { EstadosCursos } from "@/types/contexto"
import type Curso from "@/models/Curso"
import type Seccion from "@/models/Seccion"
import Tooltip from "@/components/tooltip"
import CasillasDias from "@/components/casillasDias"

/*  Contexto que comparte los estados y funciones que se comparten entre los componentes de la página de cursos*/
const CursoContext = createContext<EstadosCursos>({
  cursosGuardados: {},
  setCursosGuardados: () => { },
  cursoABuscar: "",
  setCursoABuscar: () => { },
})

/*  Página de planear cursos  Incluye la sección de planeación de cursos y la sección de cursos planeados*/
export default function Cursos() {
  const [cursosGuardados, setCursosGuardados] = useState<{ [codigo: string]: string[] }>({});
  const [cursoABuscar, setCursoABuscar] = useState("");
  const [grupos, setGrupos] = useState<GrupoCurso[]>([]);
  const [cursosParaNuevoGrupo, setCursosParaNuevoGrupo] = useState<string[]>([]);
  const [datosCargados, setDatosCargados] = useState(false);

  useEffect(() => {
    setCursosGuardados(obtenerCursosGuardados());
    setGrupos(obtenerGruposGuardados());
    setDatosCargados(true);
  }, [])

  useEffect(() => {
    if (!datosCargados) return;
    const cursosPlaneados = new Set(Object.keys(cursosGuardados));
    setCursosParaNuevoGrupo((seleccionados) => {
      const actualizados = seleccionados.filter((codigo) => cursosPlaneados.has(codigo));
      return actualizados.length === seleccionados.length ? seleccionados : actualizados;
    });
    const gruposActualizados = limpiarGruposSinCursos(grupos, cursosPlaneados);
    if (JSON.stringify(gruposActualizados) !== JSON.stringify(grupos)) {
      setGrupos(gruposActualizados);
      guardarGrupos(gruposActualizados);
    }
  }, [cursosGuardados, cursosParaNuevoGrupo, datosCargados, grupos]);

  const actualizarGrupos = (nuevosGrupos: GrupoCurso[]) => {
    setGrupos(nuevosGrupos);
    guardarGrupos(nuevosGrupos);
  };

  const crearGrupo = () => {
    if (cursosParaNuevoGrupo.length < 1) return;
    const baseNombre = `Grupo ${grupos.length + 1}`;
    const nombre = obtenerNombreUnico(baseNombre, grupos);
    actualizarGrupos([...grupos, { nombre, cursos: cursosParaNuevoGrupo }]);
    setCursosParaNuevoGrupo([]);
  };

  return (
    <CursoContext.Provider value={{ cursosGuardados, setCursosGuardados, cursoABuscar, setCursoABuscar }}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Planeacion />
        <CursosPlaneados
          grupos={grupos}
          actualizarGrupos={actualizarGrupos}
          cursosParaNuevoGrupo={cursosParaNuevoGrupo}
          setCursosParaNuevoGrupo={setCursosParaNuevoGrupo}
          crearGrupo={crearGrupo}
        />
      </div>
    </CursoContext.Provider>
  )
}

function obtenerNombreUnico(nombreBase: string, grupos: GrupoCurso[]): string {
  const nombres = new Set(grupos.map((grupo) => grupo.nombre.trim().toLocaleLowerCase()));
  let nombre = nombreBase;
  let sufijo = 2;
  while (nombres.has(nombre.toLocaleLowerCase())) {
    nombre = `${nombreBase} (${sufijo})`;
    sufijo++;
  }
  return nombre;
}

/*  Sección de planeación de cursos  Incluye la búsqueda de cursos y la visualización de los cursos encontrados y seleccionados*/
function Planeacion() {
  const { cursoABuscar, setCursoABuscar } = useContext(CursoContext)
  const [cursosEncontrados, setCursosEncontrados] = useState<{ [codigo: string]: Curso }>({})
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const consultarCurso = async () => {
      if (cursoABuscar) {
        setCargando(true)
        setCursosEncontrados({})
        setCursosEncontrados(await buscarCurso(cursoABuscar))
        setCargando(false)
      }
    }
    consultarCurso()
  }, [cursoABuscar])

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") setCursoABuscar((event.target as HTMLInputElement).value.trim().replaceAll(" ", "_"))
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mx-auto w-[80%] min-w-44 pt-8">
      <h2 className="text-2xl font-semibold">Busca cursos</h2>
      <div className="my-4">
        <label className="w-full text-lg" htmlFor="searchCourses">
          Empieza por ingresar uno de tus cursos. Luego, haz click sobre las secciones que te interesa tener en tu
          horario ideal.
        </label>
        <br />
        <input
          ref={inputRef}
          className="w-full text-lg bg-gray-100 dark:bg-neutral-600 focus:outline-none border border-1 border-gray-300 focus:border-gray-400 text-center"
          id="searchCourses"
          type="search"
          placeholder="DECA1101, NRC o nombre"
          onKeyDown={handleEnter}
        />
        <div className="flex items-center mt-2 mb-4">
          <button
            className="my-4 w-40 h-12 mx-auto block bg-yellow-300 rounded border-2 border-black hover:bg-yellow-400 transition-colors duration-300 ease-in-out dark:text-black"
            onClick={() => {
              if (inputRef.current) setCursoABuscar(inputRef.current.value)
            }}
          >
            Buscar
          </button>
        </div>
      </div>

      {cargando && <p className="text-lg font-semibold">Buscando cursos...</p>}
      {cursoABuscar && !cargando && Object.keys(cursosEncontrados).length === 0 && (
        <p className="text-lg font-semibold">No se encontraron cursos</p>
      )}

      <DetallesCursosEncontrados cursos={Object.values(cursosEncontrados)} />
    </div>
  )
}

/*  Detalles de los cursos encontrados en la búsqueda del usuario con dropdown de secciones*/
function DetallesCursosEncontrados({ cursos }: { readonly cursos: Curso[] }) {
  const [cursoExpandido, setCursoExpandido] = useState<string | null>(null)

  const toggleCurso = (codigoCurso: string) => {
    setCursoExpandido(cursoExpandido === codigoCurso ? null : codigoCurso)
  }

  return (
    <div>
      {cursos.length > 0 && <p className="text-lg font-semibold">Cursos encontrados:</p>}
      {cursos.map((curso) => {
        const codigoCurso = curso.programa + curso.curso
        const estaExpandido = cursoExpandido === codigoCurso

        return (
          <div key={codigoCurso} className="my-3">
            <DetalleCurso
              curso={curso}
              estaExpandido={estaExpandido}
              toggleCurso={toggleCurso}
            />
            {estaExpandido && <SeccionesDeCurso curso={curso} />}
          </div>
        )
      })}
    </div>
  )
}

/*
  Curso encontrado en la búsqueda del usuario

  @param curso curso encontrado
  @param estaExpandido indica si el curso está expandido o no (para mostrar las secciones)
  @param toggleCurso función para alternar el estado de expansión del curso
*/
function DetalleCurso({ curso, estaExpandido, toggleCurso }: Readonly<{ curso: Curso, estaExpandido: boolean, toggleCurso: (codigoCurso: string) => void }>) {
  return (
    <div className="bg-gray-100 dark:bg-neutral-600 text-center border border-3 border-black flex">
      <div className='mx-auto py-3 w-full'>
        <h3 className="text-lg font-semibold">{curso.descripcion}</h3>
        <p>{curso.programa}</p>
        <p>{curso.curso}</p>
        <p>{curso.creditos}</p>
      </div>

      <button
        className="bg-yellow-400 flex items-center justify-center w-12 min-w-12 text-2xl font-bold text-black hover:bg-yellow-500 transition-colors"
        onClick={() => toggleCurso(curso.programa + curso.curso)}
        title={estaExpandido ? "Ocultar secciones" : "Ver secciones"}
      >
        {estaExpandido ? "-" : "+"}
      </button>
    </div>
  )
}

function SeccionesDeCurso({ curso }: Readonly<{ curso: Curso }>) {
  return (
    <>
      <BotonesSeleccion curso={curso} />
      {curso.secciones.map((seccion) => (
        <SeccionDeCurso
          key={seccion.nrc}
          seccion={seccion}
        />
      ))}
    </>
  )
}


/*  Botones para seleccionar todas las secciones, seleccionar solo las secciones con cupo y eliminar todas las secciones*/
function BotonesSeleccion({ curso }: Readonly<{ curso: Curso }>) {
  return (
    <div className="flex place-content-center bg-gray-200 dark:bg-neutral-700 border-l border-r border-b border-black">
      <BotonSeleccionarTodas curso={curso} />
      <BotonSeleccionarValidas curso={curso} />
      <BotonEliminarTodas curso={curso} />
    </div>
  )
}

/*  Botón para seleccionar todas las secciones de un curso*/
function BotonSeleccionarTodas({ curso }: Readonly<{ curso: Curso }>) {
  const { setCursosGuardados } = useContext(CursoContext)

  const handleClic = () => {
    añadirVariasSeccionesDeCurso(
      curso.programa + curso.curso,
      curso.secciones.map((seccion) => seccion.idUnico),
    )
    setCursosGuardados(obtenerCursosGuardados())
  }

  return (
    <Tooltip mensaje="Seleccionar todas">
      <button className="icon-svg p-2" onClick={handleClic}>
        <Image src="/Mi-Horario-Uniandes/static/seleccionarTodas.svg" alt="Seleccionar todas" width={35} height={35} />
      </button>
    </Tooltip>
  )
}

/*  Botón para seleccionar solo las secciones con cupo de un curso*/
function BotonSeleccionarValidas({ curso }: Readonly<{ curso: Curso }>) {
  const { setCursosGuardados } = useContext(CursoContext)
  const handleClic = () => {
    añadirVariasSeccionesDeCurso(
      curso.programa + curso.curso,
      curso.secciones
        .filter((seccion) => seccion.cuposTomados < seccion.cuposMaximos)
        .map((seccion) => seccion.idUnico),
    )
    setCursosGuardados(obtenerCursosGuardados())
  }

  return (
    <Tooltip mensaje="Seleccionar con cupo">
      <button className="icon-svg p-2" onClick={handleClic}>
        <Image
          src="/Mi-Horario-Uniandes/static/seleccionarValidas.svg"
          alt="Seleccionar validas"
          width={35}
          height={35}
        />
      </button>
    </Tooltip>
  )
}

/*  Botón para eliminar todas las secciones de un curso*/
function BotonEliminarTodas({ curso }: Readonly<{ curso: Curso }>) {
  const { setCursosGuardados } = useContext(CursoContext)

  const handleClic = () => {
    eliminarCursoGuardado(curso.programa + curso.curso)
    setCursosGuardados(obtenerCursosGuardados())
  }

  return (
    <Tooltip mensaje="Eliminar todas">
      <button className="icon-svg p-2" onClick={handleClic}>
        <Image src="/Mi-Horario-Uniandes/static/eliminarTodas.svg" alt="Eliminar todas" width={35} height={35} />
      </button>
    </Tooltip>
  )
}

/*  Sección individual en formato dropdown*/
function SeccionDeCurso({ seccion }: Readonly<{ seccion: Seccion }>) {
  const { setCursosGuardados } = useContext(CursoContext);
  const handleAñadir = () => {
    guardarSeccionDeCurso(seccion.curso.programa + seccion.curso.curso, seccion.idUnico);
    setCursosGuardados(obtenerCursosGuardados());
  }
  const descripcionPorDuracion = new Map<string, string>([
    ["16", "16 semanas"],
    ["8A", "Primer ciclo"],
    ["8B", "Segundo ciclo"],
  ]);
  return (
    <div className="bg-gray-100 dark:bg-neutral-600 text-center border-black flex border-l border-r border-b">
      <div className='mx-auto flex flex-col justify-center'>
        <h3 className="text-lg font-semibold">{seccion.titulo}</h3>
        <p>NRC: {seccion.nrc} SECCIÓN: {seccion.seccion}</p>
        <p>Período: {seccion.periodo}</p>
        <p>Duración: {descripcionPorDuracion.get(seccion.duracion.toUpperCase()) || ""}</p>
        <p>Se han inscrito {seccion.cuposTomados} de {seccion.cuposMaximos} estudiantes</p>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
          {seccion.cuposMaximos > 0 && <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${(Math.min(seccion.cuposTomados, seccion.cuposMaximos) / seccion.cuposMaximos) * 100}%` }}></div>}
        </div>
        <p>{seccion.profesores.map((profesor) => profesor.nombre).join(", ")}</p>
        <p>{seccion.horarios.map((bloque) => <CasillasDias bloque={bloque} key={bloque.titulo + bloque.horaInicio + bloque.horaFin + bloque.dias.join('')} />)}</p>
      </div>
      <button className='bg-yellow-400 flex items-center justify-center w-8 min-w-8 text-2xl font-semibold dark:text-black' onClick={handleAñadir} title='Añadir o quitar sección'>{cursoTieneSeccionGuardada(seccion.curso.programa + seccion.curso.curso, seccion.idUnico) ? "-" : "+"}</button>
    </div>
  )
}

/*  Cursos planificados por el usuario*/
function CursosPlaneados({
  grupos,
  actualizarGrupos,
  cursosParaNuevoGrupo,
  setCursosParaNuevoGrupo,
  crearGrupo,
}: {
  grupos: GrupoCurso[];
  actualizarGrupos: (grupos: GrupoCurso[]) => void;
  cursosParaNuevoGrupo: string[];
  setCursosParaNuevoGrupo: (cursos: string[]) => void;
  crearGrupo: () => void;
}) {
  const { cursosGuardados } = useContext(CursoContext)
  const [grupoEditando, setGrupoEditando] = useState<number | null>(null)
  const [errorNombreGrupo, setErrorNombreGrupo] = useState<number | null>(null)
  const cursos = Object.keys(cursosGuardados).sort()

  return (
    <div className="mx-auto w-[80%] min-w-44 pt-8">
      <h2 className="text-2xl font-semibold">Tus cursos planeados</h2>
      <p className="text-lg my-2">Aquí puedes ver los cursos que has elegido</p>
      {cursos.map((codigo) => (
        <CursoPlaneado
          codigo={codigo}
          secciones={cursosGuardados[codigo]}
          grupos={grupos}
          cursosSeleccionados={cursosParaNuevoGrupo}
          setCursosSeleccionados={setCursosParaNuevoGrupo}
          key={codigo}
        />
      ))}

      <section className="my-6 rounded border border-gray-400 p-4">
        <h3 className="text-xl font-semibold">Crear un grupo</h3>
        <p className="my-2">Selecciona uno o más cursos. De cada grupo se incluirá como máximo un curso en cada horario (útil para electivas).</p>
        {cursos.length === 0 && <p>Planea cursos para poder agruparlos.</p>}
        <button
          type="button"
          disabled={cursosParaNuevoGrupo.length < 1}
          onClick={crearGrupo}
          className="mt-2 rounded border-2 border-black bg-yellow-300 px-4 py-2 text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Crear grupo con seleccionados ({cursosParaNuevoGrupo.length})
        </button>
      </section>

      <section className="my-6">
        <h3 className="text-xl font-semibold">Grupos</h3>
        {grupos.length === 0 && <p className="my-2">Aún no has creado grupos.</p>}
        {grupos.map((grupo, indiceGrupo) => (
          <div key={indiceGrupo} className="my-3 rounded border border-gray-400 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <label className="sr-only" htmlFor={`nombre-grupo-${indiceGrupo}`}>
                  Nombre del grupo {indiceGrupo + 1}
                </label>
                <input
                  id={`nombre-grupo-${indiceGrupo}`}
                  value={grupo.nombre}
                  onChange={(event) => {
                    const nombre = event.target.value;
                    const nombreNormalizado = nombre.trim().toLocaleLowerCase();
                    const duplicado = grupos.some(
                      (otro, indice) =>
                        indice !== indiceGrupo &&
                        otro.nombre.trim().toLocaleLowerCase() === nombreNormalizado,
                    );
                    if (!nombreNormalizado || duplicado) {
                      setErrorNombreGrupo(indiceGrupo);
                      return;
                    }
                    setErrorNombreGrupo(null);
                    actualizarGrupos(
                      grupos.map((actual, indice) =>
                        indice === indiceGrupo ? { ...actual, nombre } : actual,
                      ),
                    );
                  }}
                  className="w-full rounded border border-gray-400 bg-transparent px-2 py-1 font-semibold"
                  aria-invalid={errorNombreGrupo === indiceGrupo}
                />
                {errorNombreGrupo === indiceGrupo && (
                  <span className="text-sm text-red-600" role="alert">
                    Escribe un nombre no vacío y distinto al de los demás grupos.
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setGrupoEditando(grupoEditando === indiceGrupo ? null : indiceGrupo)
                  }
                  className="rounded border border-black bg-yellow-300 px-3 py-1 text-black hover:bg-yellow-400"
                  aria-expanded={grupoEditando === indiceGrupo}
                >
                  {grupoEditando === indiceGrupo ? "Listo" : "Editar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    actualizarGrupos(grupos.filter((_, indice) => indice !== indiceGrupo));
                    setGrupoEditando(null);
                    setErrorNombreGrupo(null);
                  }}
                  className="rounded border border-black bg-yellow-300 px-3 py-1 text-black hover:bg-yellow-400"
                  aria-label={`Eliminar grupo ${indiceGrupo + 1}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
            {grupoEditando === indiceGrupo ? (
              <div>
                <p className="mb-2 text-sm">Cursos del grupo:</p>
                <div className="flex flex-wrap gap-2">
                  {grupo.cursos.slice().sort((a, b) => a.localeCompare(b)).map((curso) => (
                    <span key={curso} className="inline-flex items-center gap-2 rounded bg-gray-200 px-2 py-1 text-black dark:bg-neutral-600 dark:text-white">
                      {curso}
                      <button
                        type="button"
                        onClick={() =>
                          actualizarGrupos(
                            grupos.map((actual, indice) =>
                              indice === indiceGrupo
                                ? { ...actual, cursos: actual.cursos.filter((codigo) => codigo !== curso) }
                                : actual,
                            ),
                          )
                        }
                        aria-label={`Quitar ${curso} de ${grupo.nombre}`}
                        className="font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <label className="mt-3 flex flex-col gap-1">
                  Agregar curso
                  <select
                    className="rounded border border-gray-500 bg-white p-2 text-black"
                    value=""
                    onChange={(event) => {
                      const curso = event.target.value;
                      if (!curso) return;
                      actualizarGrupos(
                        grupos.map((actual, indice) =>
                          indice === indiceGrupo
                            ? { ...actual, cursos: [...actual.cursos, curso] }
                            : actual,
                        ),
                      );
                    }}
                  >
                    <option value="">Selecciona un curso...</option>
                    {cursos
                      .filter((curso) => !grupo.cursos.includes(curso))
                      .map((curso) => <option key={curso} value={curso}>{curso}</option>)}
                  </select>
                </label>
              </div>
            ) : (
              <p>
                {grupo.cursos.length > 0
                  ? grupo.cursos.slice().sort((a, b) => a.localeCompare(b)).join(" · ")
                  : "Sin cursos"}
              </p>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

/*  Curso planificado por el usuario*/
function CursoPlaneado({
  codigo,
  secciones,
  grupos,
  cursosSeleccionados,
  setCursosSeleccionados,
}: Readonly<{
  codigo: string;
  secciones: string[];
  grupos: GrupoCurso[];
  cursosSeleccionados: string[];
  setCursosSeleccionados: (cursos: string[]) => void;
}>) {
  const { setCursosGuardados, setCursoABuscar } = useContext(CursoContext)

  const handleBusqueda = () => {
    setCursoABuscar(codigo)
  }

  const handleEliminacion = () => {
    eliminarCursoGuardado(codigo)
    setCursosGuardados(obtenerCursosGuardados())
  }

  const seccionesMostradas = secciones.map(idUnico => {
      return idUnico.split('_')[2] || idUnico;
  }).join(", ");

  return (
    <div className="bg-gray-100 dark:bg-neutral-600 text-center flex flex-col border border-3 border-black min-h-24 my-3">
      <div className="bg-yellow-400 flex h-8 place-content-end">
        <Image
          src="/Mi-Horario-Uniandes/static/lupa.svg"
          alt="Buscar curso"
          width="0"
          height="0"
          className="cursor-pointer mr-3 w-6 h-auto"
          onClick={handleBusqueda}
          title="Buscar curso"
        />
        <Image
          src="/Mi-Horario-Uniandes/static/cruz.svg"
          alt="Eliminar curso"
          width="0"
          height="0"
          className="cursor-pointer mr-3 w-6 h-auto"
          onClick={handleEliminacion}
          title="Eliminar curso"
        />
      </div>
      <h3 className="text-lg font-semibold">{codigo}</h3>
      <p className="text-muted-foreground dark:text-neutral-300">Secciones: {seccionesMostradas}</p>
      <div className="flex flex-wrap justify-center gap-1">
      {grupos.map((grupo, indice) =>
        grupo.cursos.includes(codigo) ? (
          <span key={indice} className="rounded bg-yellow-200 px-2 py-1 text-sm text-black">
            {grupo.nombre}
          </span>
        ) : null,
      )}
      </div>
      <label className="mx-auto mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={cursosSeleccionados.includes(codigo)}
          onChange={() =>
            setCursosSeleccionados(
              cursosSeleccionados.includes(codigo)
                ? cursosSeleccionados.filter((curso) => curso !== codigo)
                : [...cursosSeleccionados, codigo],
            )
          }
          aria-label={`Seleccionar ${codigo} para crear un grupo`}
        />
        Seleccionar para agrupar
      </label>
    </div>
  )
}
