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
import BotonPrimario from "@/components/BotonPrimario"

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
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 px-4 py-6 sm:px-6 sm:py-8 xl:grid-cols-2">
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
    <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
        Explora la oferta
      </p>
      <h1 className="mt-1 text-xl font-bold tracking-tight">Busca cursos</h1>
      <div className="my-4">
        <label className="w-full text-sm leading-5 text-slate-600 dark:text-slate-300" htmlFor="searchCourses">
          Empieza por ingresar uno de tus cursos. Luego, haz click sobre las secciones que te interesa tener en tu
          horario ideal.
        </label>
        <br />
        <input
          ref={inputRef}
          className="field-theme mt-2 h-11 w-full rounded-xl px-4 text-sm"
          id="searchCourses"
          type="search"
          placeholder="DECA1101, NRC o nombre"
          onKeyDown={handleEnter}
        />
        <div className="mt-2 flex justify-center">
          <BotonPrimario
            onClick={() => {
              if (inputRef.current) setCursoABuscar(inputRef.current.value)
            }}
          >
            Buscar
          </BotonPrimario>
        </div>
      </div>

      {cargando && <p className="rounded-xl bg-amber-50 p-4 text-sm font-semibold dark:bg-amber-300/10">Buscando cursos...</p>}
      {cursoABuscar && !cargando && Object.keys(cursosEncontrados).length === 0 && (
        <p className="rounded-xl bg-slate-100 p-4 text-sm font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">No se encontraron cursos</p>
      )}

      <DetallesCursosEncontrados cursos={Object.values(cursosEncontrados)} />
    </section>
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
      {cursos.length > 0 && <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Cursos encontrados</p>}
      {cursos.map((curso) => {
        const codigoCurso = curso.programa + curso.curso
        const estaExpandido = cursoExpandido === codigoCurso

        return (
          <div key={codigoCurso} className="my-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
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
    <div className="flex items-stretch bg-page text-center dark:bg-neutral-800">
      <div className='mx-auto py-3 w-full'>
        <h3 className="text-base font-bold">{curso.descripcion}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{curso.programa} {curso.curso} · {curso.creditos} créditos</p>
      </div>

      <button
        className="accent-control flex w-12 min-w-12 items-center justify-center text-2xl font-semibold"
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
    <div className="flex flex-wrap items-center justify-center gap-1 border-t border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-neutral-900">
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
      <button className="rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-white/10" onClick={handleClic}>
        <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/seleccionarTodas.svg" alt="Seleccionar todas" width={24} height={24} />
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
      <button className="rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-white/10" onClick={handleClic}>
        <Image
          className="icon-svg"
          src="/Mi-Horario-Uniandes/static/seleccionarValidas.svg"
          alt="Seleccionar validas"
          width={24}
          height={24}
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
      <button className="rounded-lg p-1.5 transition hover:bg-rose-50 dark:hover:bg-rose-400/10" onClick={handleClic}>
        <Image className="icon-svg" src="/Mi-Horario-Uniandes/static/eliminarTodas.svg" alt="Eliminar todas" width={24} height={24} />
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
    <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-3 py-2.5 text-left dark:border-white/10 dark:bg-neutral-900 sm:px-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-bold">{seccion.titulo}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">NRC {seccion.nrc} · Sección {seccion.seccion}</p>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{seccion.periodo}</span>
          <span>{descripcionPorDuracion.get(seccion.duracion.toUpperCase()) || "Duración no especificada"}</span>
          {seccion.profesores.length > 0 && (
            <span className="max-w-full truncate">{seccion.profesores.map((profesor) => profesor.nombre).join(", ")}</span>
          )}
        </div>
        <div className="mt-1.5">
          <div className="mb-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Cupos ocupados</span>
            <span>{seccion.cuposTomados}/{seccion.cuposMaximos}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
            {seccion.cuposMaximos > 0 && (
              <div
                className="h-full rounded-full bg-amber-700 dark:bg-amber-300"
                style={{ width: `${(Math.min(seccion.cuposTomados, seccion.cuposMaximos) / seccion.cuposMaximos) * 100}%` }}
              />
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-2">
            {seccion.horarios.map((bloque) => (
              <CasillasDias
                bloque={bloque}
                key={bloque.titulo + bloque.horaInicio + bloque.horaFin + bloque.dias.join("")}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="accent-control flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-semibold"
        onClick={handleAñadir}
        aria-label={cursoTieneSeccionGuardada(seccion.curso.programa + seccion.curso.curso, seccion.idUnico) ? "Quitar sección" : "Añadir sección"}
        title={cursoTieneSeccionGuardada(seccion.curso.programa + seccion.curso.curso, seccion.idUnico) ? "Quitar sección" : "Añadir sección"}
      >
        {cursoTieneSeccionGuardada(seccion.curso.programa + seccion.curso.curso, seccion.idUnico) ? "−" : "+"}
      </button>
    </div>
  )
}

type PropiedadesCursosPlaneados = {
  grupos: GrupoCurso[];
  actualizarGrupos: (grupos: GrupoCurso[]) => void;
  cursosParaNuevoGrupo: string[];
  setCursosParaNuevoGrupo: (cursos: string[]) => void;
  crearGrupo: () => void;
};

/**
 * Muestra los cursos elegidos y permite administrarlos en grupos.
 * @param propiedades Datos y acciones para administrar cursos y grupos.
 * @returns La sección de cursos planeados y sus grupos.
 */
function CursosPlaneados({
  grupos,
  actualizarGrupos,
  cursosParaNuevoGrupo,
  setCursosParaNuevoGrupo,
  crearGrupo,
}: PropiedadesCursosPlaneados) {
  const { cursosGuardados } = useContext(CursoContext);
  const cursos = Object.keys(cursosGuardados).sort();

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
        Tu semestre
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight">Tus cursos planeados</h2>
      <p className="my-2 text-sm leading-5 text-slate-600 dark:text-slate-300">Aquí puedes revisar y organizar los cursos que has elegido.</p>
      {cursos.length === 0 && (
        <p className="my-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
          Aún no has agregado cursos a tu horario.
        </p>
      )}
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
      <SeccionCrearGrupo
        cantidadCursos={cursos.length}
        cantidadSeleccionados={cursosParaNuevoGrupo.length}
        crearGrupo={crearGrupo}
      />
      <ListaGrupos
        grupos={grupos}
        cursos={cursos}
        actualizarGrupos={actualizarGrupos}
      />
    </section>
  );
}

/**
 * Ofrece la acción para crear un grupo con los cursos seleccionados.
 * @param cantidadCursos Cantidad de cursos disponibles para agrupar.
 * @param cantidadSeleccionados Cantidad de cursos elegidos para el grupo.
 * @param crearGrupo Función que crea el grupo.
 * @returns La sección para iniciar la creación de un grupo.
 */
function SeccionCrearGrupo({
  cantidadCursos,
  cantidadSeleccionados,
  crearGrupo,
}: {
  cantidadCursos: number;
  cantidadSeleccionados: number;
  crearGrupo: () => void;
}) {
  return (
    <section className="my-4 rounded-2xl border border-slate-200 bg-page p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="text-base font-bold">Crear un grupo</h3>
      <p className="my-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
        Selecciona uno o más cursos. De cada grupo se incluirá como máximo un
        curso en cada horario (útil para electivas).
      </p>
      {cantidadCursos === 0 && <p className="text-sm text-slate-500">Planea cursos para poder agruparlos.</p>}
      <div className="flex justify-center">
        <BotonPrimario
          type="button"
          disabled={cantidadSeleccionados < 1}
          onClick={crearGrupo}
          className="mt-2"
        >
          Crear grupo con seleccionados ({cantidadSeleccionados})
        </BotonPrimario>
      </div>
    </section>
  );
}

/**
 * Lista los grupos existentes y distribuye sus acciones de actualización.
 * @param grupos Grupos guardados.
 * @param cursos Cursos disponibles para agregar a un grupo.
 * @param actualizarGrupos Función que persiste los grupos modificados.
 * @returns La sección con las tarjetas de grupo.
 */
function ListaGrupos({
  grupos,
  cursos,
  actualizarGrupos,
}: {
  grupos: GrupoCurso[];
  cursos: string[];
  actualizarGrupos: (grupos: GrupoCurso[]) => void;
}) {
  const actualizarGrupo = (indiceGrupo: number, grupoActualizado: GrupoCurso) => {
    actualizarGrupos(
      grupos.map((grupo, indice) =>
        indice === indiceGrupo ? grupoActualizado : grupo,
      ),
    );
  };

  const eliminarGrupo = (indiceGrupo: number) => {
    actualizarGrupos(grupos.filter((_, indice) => indice !== indiceGrupo));
  };

  return (
    <section className="my-6">
      <h3 className="text-lg font-bold">Grupos</h3>
      {grupos.length === 0 && <p className="my-2 text-sm text-slate-500 dark:text-slate-400">Aún no has creado grupos.</p>}
      {grupos.map((grupo, indiceGrupo) => (
        <TarjetaGrupo
          key={indiceGrupo}
          grupo={grupo}
          indice={indiceGrupo}
          grupos={grupos}
          cursosDisponibles={cursos}
          actualizarGrupo={(grupoActualizado) =>
            actualizarGrupo(indiceGrupo, grupoActualizado)
          }
          eliminarGrupo={() => eliminarGrupo(indiceGrupo)}
        />
      ))}
    </section>
  );
}

/**
 * Administra el nombre, los cursos y el estado de edición de un grupo.
 * @param propiedades Datos del grupo y funciones para actualizarlo o borrarlo.
 * @returns La tarjeta de un grupo con su resumen o editor.
 */
function TarjetaGrupo({
  grupo,
  indice,
  grupos,
  cursosDisponibles,
  actualizarGrupo,
  eliminarGrupo,
}: {
  grupo: GrupoCurso;
  indice: number;
  grupos: GrupoCurso[];
  cursosDisponibles: string[];
  actualizarGrupo: (grupo: GrupoCurso) => void;
  eliminarGrupo: () => void;
}) {
  const [editando, setEditando] = useState(false);
  const [nombreInvalido, setNombreInvalido] = useState(false);

  const actualizarNombre = (nombre: string) => {
    const nombreNormalizado = nombre.trim().toLocaleLowerCase();
    const duplicado = grupos.some(
      (otroGrupo, indiceOtro) =>
        indiceOtro !== indice &&
        otroGrupo.nombre.trim().toLocaleLowerCase() === nombreNormalizado,
    );
    if (!nombreNormalizado || duplicado) {
      setNombreInvalido(true);
      return;
    }
    setNombreInvalido(false);
    actualizarGrupo({ ...grupo, nombre });
  };

  const actualizarCursos = (cursos: string[]) => {
    actualizarGrupo({ ...grupo, cursos });
  };

  return (
    <div className="my-3 rounded border border-gray-400 p-4">
      <CabeceraGrupo
        grupo={grupo}
        indice={indice}
        editando={editando}
        nombreInvalido={nombreInvalido}
        actualizarNombre={actualizarNombre}
        cambiarEdicion={() => setEditando(!editando)}
        eliminarGrupo={eliminarGrupo}
      />
      {editando ? (
        <EditorCursosGrupo
          grupo={grupo}
          cursosDisponibles={cursosDisponibles}
          actualizarCursos={actualizarCursos}
        />
      ) : (
        <ResumenCursosGrupo grupo={grupo} />
      )}
    </div>
  );
}

/**
 * Presenta el nombre del grupo y sus acciones principales.
 * @param propiedades Nombre, estado de edición y acciones del grupo.
 * @returns La cabecera editable con los botones del grupo.
 */
function CabeceraGrupo({
  grupo,
  indice,
  editando,
  nombreInvalido,
  actualizarNombre,
  cambiarEdicion,
  eliminarGrupo,
}: {
  grupo: GrupoCurso;
  indice: number;
  editando: boolean;
  nombreInvalido: boolean;
  actualizarNombre: (nombre: string) => void;
  cambiarEdicion: () => void;
  eliminarGrupo: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor={`nombre-grupo-${indice}`}>
          Nombre del grupo {indice + 1}
        </label>
        <input
          id={`nombre-grupo-${indice}`}
          value={grupo.nombre}
          onChange={(evento) => actualizarNombre(evento.target.value)}
          className="w-full rounded border border-gray-400 bg-transparent px-2 py-1 font-semibold"
          aria-invalid={nombreInvalido}
        />
        {nombreInvalido && (
          <span className="text-sm text-red-600" role="alert">
            Escribe un nombre no vacío y distinto al de los demás grupos.
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <BotonPrimario
          type="button"
          onClick={cambiarEdicion}
          className="min-h-9 px-3 text-xs"
          aria-expanded={editando}
        >
          {editando ? "Listo" : "Editar"}
        </BotonPrimario>
        <BotonPrimario
          type="button"
          onClick={eliminarGrupo}
          className="min-h-9 px-3 text-xs"
          aria-label={`Eliminar grupo ${indice + 1}`}
        >
          Eliminar
        </BotonPrimario>
      </div>
    </div>
  );
}

/**
 * Permite agregar cursos al grupo o quitar los que ya contiene.
 * @param grupo Grupo cuyos cursos se modifican.
 * @param cursosDisponibles Cursos planeados disponibles para agregar.
 * @param actualizarCursos Función que guarda la lista nueva de cursos.
 * @returns Los controles para editar los cursos del grupo.
 */
function EditorCursosGrupo({
  grupo,
  cursosDisponibles,
  actualizarCursos,
}: {
  grupo: GrupoCurso;
  cursosDisponibles: string[];
  actualizarCursos: (cursos: string[]) => void;
}) {
  const quitarCurso = (cursoAQuitar: string) => {
    actualizarCursos(grupo.cursos.filter((curso) => curso !== cursoAQuitar));
  };

  const agregarCurso = (cursoAAgregar: string) => {
    if (!cursoAAgregar) return;
    actualizarCursos([...grupo.cursos, cursoAAgregar]);
  };

  return (
    <div>
      <p className="mb-2 text-sm">Cursos del grupo:</p>
      <div className="flex flex-wrap gap-2">
        {grupo.cursos
          .slice()
          .sort((cursoA, cursoB) => cursoA.localeCompare(cursoB))
          .map((curso) => (
            <span
              key={curso}
              className="inline-flex items-center gap-2 rounded bg-gray-200 px-2 py-1 text-black dark:bg-neutral-600 dark:text-white"
            >
              {curso}
              <button
                type="button"
                onClick={() => quitarCurso(curso)}
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
          className="field-theme rounded-xl p-2 dark:[color-scheme:dark]"
          value=""
          onChange={(evento) => agregarCurso(evento.target.value)}
        >
          <option value="">Selecciona un curso...</option>
          {cursosDisponibles
            .filter((curso) => !grupo.cursos.includes(curso))
            .map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
}

/**
 * Resume los cursos asociados a un grupo cuando no se está editando.
 * @param grupo Grupo que se presenta.
 * @returns El listado compacto de cursos del grupo.
 */
function ResumenCursosGrupo({ grupo }: { grupo: GrupoCurso }) {
  const cursosOrdenados = grupo.cursos
    .slice()
    .sort((cursoA, cursoB) => cursoA.localeCompare(cursoB));

  return (
    <p>
      {cursosOrdenados.length > 0
        ? cursosOrdenados.join(" · ")
        : "Sin cursos"}
    </p>
  );
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
    <div className="my-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-white/10 dark:bg-neutral-800">
      <div className="col-start-2 row-span-2 row-start-1 flex items-center gap-2">
        <Image
          src="/Mi-Horario-Uniandes/static/lupa.svg"
          alt="Buscar curso"
          width="0"
          height="0"
          className="icon-svg h-auto w-4 cursor-pointer opacity-70 transition hover:opacity-100"
          onClick={handleBusqueda}
          title="Buscar curso"
        />
        <Image
          src="/Mi-Horario-Uniandes/static/cruz.svg"
          alt="Eliminar curso"
          width="0"
          height="0"
          className="icon-svg h-auto w-4 cursor-pointer opacity-70 transition hover:opacity-100"
          onClick={handleEliminacion}
          title="Eliminar curso"
        />
      </div>
      <h3 className="col-start-1 row-start-1 text-sm font-bold">{codigo}</h3>
      <p className="col-start-1 row-start-2 text-xs text-slate-500 dark:text-slate-400">Secciones: {seccionesMostradas}</p>
      <div className="col-span-2 mt-1 flex flex-wrap gap-1">
      {grupos.map((grupo, indice) =>
        grupo.cursos.includes(codigo) ? (
          <span key={indice} className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-950 dark:bg-amber-300/15 dark:text-amber-200">
            {grupo.nombre}
          </span>
        ) : null,
      )}
      </div>
      <label className="col-span-2 mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
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
