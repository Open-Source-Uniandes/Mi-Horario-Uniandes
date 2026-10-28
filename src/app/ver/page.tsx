'use client'
import { CalendarioConBloques } from "@/components/calendario";
import BotonPrimario from "@/components/BotonPrimario";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookmarkPlus, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Clock3, Info } from "lucide-react";
import Horario from "@/models/Horario";
import { NavbarHorario } from "@/components/navbars";
import { esPosibleCrearPlan, guardarPlan } from "@/services/almacenamiento/almacenamientoPlanes";
import { SidebarCursosConAtributos } from "@/components/sideBarCursosConAtributos";
import { generarHorarios } from "@/services/operacionesSobreHorario";
import { obtenerBloquesGuardados } from "@/services/almacenamiento/almacenamientoBloques";
import BloqueTiempo from "@/models/BloqueTiempo";
import Seccion from "@/models/Seccion";
import { atributosEspeciales, obtenerSeccionesPorAtributoYPrograma, programasEspeciales } from "@/services/fetcher";
import { filtrarSeccionesQueColisionan } from "@/services/operacionesSobreHorario";
import Spinner from "@/components/spinner";
import Image from "next/image";
import CasillasDias from "@/components/casillasDias";
import {
  obtenerGruposGuardados,
  type GrupoCurso,
} from "@/services/almacenamiento/almacenamientoGrupos";

/*
  Página que muestra los horarios generados así como la opción de guardar un horario y ver cursos especiales que se ajustan
*/
export default function Ver() {
  const [horariosGenerados, setHorariosGenerados] = useState<Horario[]>([]);
  const [indiceHorario, setIndiceHorario] = useState(0);
  const [bloquesUsuario, setBloquesUsuario] = useState<{ [titulo: string]: BloqueTiempo[] }>({});
  const [cargando, setCargando] = useState(false);
  const [verNombreCurso, setVerNombreCurso] = useState(true);
  const [grupos, setGrupos] = useState<GrupoCurso[]>([]);
  useEffect(() => {
    let efectoActivo = true;

    async function obtenerHorarios() {
      setCargando(true);
      const horarios = await generarHorarios();
      if (!efectoActivo) return;
      setBloquesUsuario(obtenerBloquesGuardados());
      setGrupos(obtenerGruposGuardados());
      setHorariosGenerados(horarios);
      setCargando(false);
    }

    void obtenerHorarios();
    return () => {
      efectoActivo = false;
    };
  }, []);
  useEffect(() => {
    const manejarFlechas = (evento: KeyboardEvent) => {
      if (horariosGenerados.length < 2 || evento.altKey || evento.ctrlKey || evento.metaKey) {
        return;
      }

      const elementoActivo = evento.target;
      if (
        elementoActivo instanceof HTMLElement &&
        (elementoActivo.isContentEditable ||
          elementoActivo.closest("input, textarea, select, [contenteditable='true']"))
      ) {
        return;
      }

      if (evento.key === "ArrowRight") {
        evento.preventDefault();
        setIndiceHorario((indiceActual) => (indiceActual + 1) % horariosGenerados.length);
      } else if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        setIndiceHorario(
          (indiceActual) =>
            (indiceActual - 1 + horariosGenerados.length) % horariosGenerados.length,
        );
      }
    };

    window.addEventListener("keydown", manejarFlechas);
    return () => window.removeEventListener("keydown", manejarFlechas);
  }, [horariosGenerados.length]);
  const siguienteHorario = () => setIndiceHorario((indiceHorario + 1) % horariosGenerados.length);
  const anteriorHorario = () => setIndiceHorario((indiceHorario - 1 + horariosGenerados.length) % horariosGenerados.length);
  return (
    <div className="min-h-screen flex flex-col dark:text-white dark:bg-page-dark">
      <NavbarHorario />
      {cargando && <Spinner mensajeDeCarga="Generando horarios..." mensajeAuxiliar="Intenta seleccionar menos secciones para obtener horarios más rápido" />}
      {!cargando && horariosGenerados.length > 0 &&
        <div className="pt-16 flex flex-1">
          <SidebarCursosConAtributos>
            <CursosPorAtributo horario={horariosGenerados[indiceHorario]} verNombreCurso={verNombreCurso} setVerNombreCurso={setVerNombreCurso} />
          </SidebarCursosConAtributos>
          <PanelHorario horariosGenerados={horariosGenerados} indiceHorario={indiceHorario} bloquesUsuario={bloquesUsuario} grupos={grupos} verNombreCurso={verNombreCurso} anteriorHorario={anteriorHorario} siguienteHorario={siguienteHorario} />
        </div>
      }
      {!cargando && horariosGenerados.length === 0 && <NoHayHorarios />}
    </div>
  )
}

function NoHayHorarios() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 pb-8 pt-20 sm:px-8">
      <section className="w-full max-w-3xl p-2 text-center sm:p-4">
        <Image
          src="/Mi-Horario-Uniandes/static/senecaSorprendida.svg"
          alt=""
          width={132}
          height={132}
          className="mx-auto"
        />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
          Ajusta tu planeación
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          No encontramos horarios posibles
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Prueba quitando algunos bloques de tiempo o secciones para encontrar
          una combinación compatible.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/planear/cursos"
            className="primary-action min-h-12 justify-between rounded-2xl px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <BookOpen size={19} />
              Revisar secciones
            </span>
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/planear/bloques"
            className="primary-action min-h-12 justify-between rounded-2xl px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <Clock3 size={19} />
              Revisar bloques
            </span>
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-left dark:bg-amber-300/10">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" size={18} />
            <div className="text-sm leading-6 text-slate-700 dark:text-slate-200">
              <p className="font-semibold">Revisa las secciones complementarias</p>
              <p className="mt-1">
                Si agregas una sección complementaria cuyo identificador comienza
                con una letra (como <strong>A1</strong>), también debes incluir su
                sección magistral correspondiente (por ejemplo, <strong>A</strong>).
                Si una sección magistral comienza con una letra, debes añadir al
                menos una de sus secciones complementarias.
              </p>
              <a
                href="https://registro.uniandes.edu.co/index.php/elaboracion-de-horario/informacion-para-el-registro-de-cursos-con-complementarias"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-semibold text-amber-800 underline-offset-4 hover:underline dark:text-amber-200"
              >
                Consultar la guía oficial <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/*
  Panel que muestra un horario generado

  @param horariosGenerados lista de horarios generados
  @param indiceHorario índice del horario a mostrar
  @param bloquesUsuario bloques de tiempo guardados por el usuario
*/
function PanelHorario({ horariosGenerados, indiceHorario, bloquesUsuario, grupos, verNombreCurso, anteriorHorario, siguienteHorario }: { horariosGenerados: Horario[], indiceHorario: number, bloquesUsuario: { [titulo: string]: BloqueTiempo[] }, grupos: GrupoCurso[], verNombreCurso?: boolean, anteriorHorario: () => void, siguienteHorario: () => void }) {
  const creditosTotales = horariosGenerados[indiceHorario]?.creditosTotales ?? 0;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full flex-col">
      <div>
        <CalendarioConBloques horario={horariosGenerados[indiceHorario]} bloquesUsuario={bloquesUsuario} grupos={grupos} verNombreCurso={verNombreCurso ?? false} />
      </div>
      <div className="mx-2 mb-2 mt-auto flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:mx-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-300/10 dark:text-amber-200">
              <BookOpen size={19} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total créditos</p>
              <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{creditosTotales}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-neutral-800">
            <button type="button" onClick={anteriorHorario} aria-label="Horario anterior" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-amber-300">
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 px-1 text-sm text-slate-600 dark:text-slate-300">
              <CalendarDays size={17} className="shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              <span className="whitespace-nowrap">Horario <span className="font-semibold text-slate-900 dark:text-white">{indiceHorario + 1} de {horariosGenerados.length}</span></span>
            </div>
            <button type="button" onClick={siguienteHorario} aria-label="Siguiente horario" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-amber-300">
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
          <BotonGuardarPlan horariosGenerados={horariosGenerados} indiceHorario={indiceHorario} />
      </div>
    </main>
  )
}

/*
  Botón para guardar un horario como plan

  @param horariosGenerados lista de horarios generados
  @param indiceHorario índice del horario a guardar
*/
function BotonGuardarPlan({ horariosGenerados, indiceHorario }: { horariosGenerados: Horario[], indiceHorario: number }) {
  const handleClic = () => {
    if (esPosibleCrearPlan()) {
      guardarPlan({ secciones: horariosGenerados[indiceHorario].secciones });
      alert("Plan guardado exitosamente");
    } else {
      alert("Ya tienes 5 planes guardados, elimina uno para poder guardar otro");
    }
  };
  return (
    <BotonPrimario onClick={handleClic} className="w-full shrink-0 sm:w-auto">
      <BookmarkPlus size={18} aria-hidden="true" />
      Guardar como plan
    </BotonPrimario>
  )
}

/*
  Componente que muestra los cursos agrupados por atributo
*/
function CursosPorAtributo({ horario, verNombreCurso = false, setVerNombreCurso }: { horario: Horario, verNombreCurso?: boolean, setVerNombreCurso?: (verNombreCurso: boolean) => void }) {
  const [seccionesEncontradas, setSeccionesEncontradas] = useState<Seccion[]>([]);
  const [atributoSeleccionado, setAtributoSeleccionado] = useState<string>("");
  const [programaSeleccionado, setProgramaSeleccionado] = useState<string>("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setSeccionesEncontradas([]);
    async function buscarCursosEspeciales() {
      setCargando(true);
      if (atributoSeleccionado === "" && programaSeleccionado === "") {
        setCargando(false);
        return;
      }
      const secciones = await obtenerSeccionesPorAtributoYPrograma(atributoSeleccionado, programaSeleccionado);
      const seccionesFiltradas = filtrarSeccionesQueColisionan(horario, secciones);
      setSeccionesEncontradas(seccionesFiltradas);
      setCargando(false);
    }
    buscarCursosEspeciales();
  }, [atributoSeleccionado, programaSeleccionado, horario]);
  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
          Personaliza la vista
        </p>
        <h1 className="mt-1 text-lg font-bold tracking-tight">Ajustes del horario</h1>
      </header>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Mostrar en el calendario</legend>
        <div className="grid gap-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition hover:bg-white dark:hover:bg-white/5">
            <input className="accent-amber-500" type="radio" id="Nombre del Curso" name="preview" checked={verNombreCurso} onChange={() => setVerNombreCurso && setVerNombreCurso(true)} />
            Nombre del curso
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition hover:bg-white dark:hover:bg-white/5">
            <input className="accent-amber-500" type="radio" id="Nombre del Profesor" name="preview" checked={!verNombreCurso} onChange={() => setVerNombreCurso && setVerNombreCurso(false)} />
            Nombre del profesor
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Filtrar por atributo</legend>
        <InputsAtributo atributoSeleccionado={atributoSeleccionado} setAtributoSeleccionado={setAtributoSeleccionado} />
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Filtrar por programa</legend>
        <InputsProgramaEspecial programaSeleccionado={programaSeleccionado} setProgramaSeleccionado={setProgramaSeleccionado} />
      </fieldset>
      <BotonQuitarFiltros setAtributoSeleccionado={setAtributoSeleccionado} setProgramaSeleccionado={setProgramaSeleccionado} />
      {cargando ? (
        <p className="rounded-xl bg-amber-50 p-3 text-center text-sm font-semibold dark:bg-amber-300/10">
          Buscando cursos...
        </p>
      ) : (
        <SeccionesEspeciales secciones={seccionesEncontradas} />
      )}
      {seccionesEncontradas.length === 0 && !cargando && (
        <p className="rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
          Selecciona un atributo o programa para buscar cursos compatibles.
        </p>
      )}
    </div>
  )
}

/*
  Componente que remueve los filtros seleccionados
*/
function BotonQuitarFiltros({ setAtributoSeleccionado, setProgramaSeleccionado }: { setAtributoSeleccionado: (atributo: string) => void, setProgramaSeleccionado: (programa: string) => void }) {
  return (
    <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-amber-300 hover:bg-white dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
      onClick={() => {
        setAtributoSeleccionado("");
        setProgramaSeleccionado("");
      }}>
      Limpiar filtros
    </button>
  )
}

/*
  Componente que muestra los inputs de los programas especiales
*/
function InputsProgramaEspecial({ programaSeleccionado, setProgramaSeleccionado }: { programaSeleccionado: string, setProgramaSeleccionado: (programa: string) => void }) {
  return <OpcionesFiltro nombre="programa" opciones={programasEspeciales} seleccionado={programaSeleccionado} onChange={setProgramaSeleccionado} />;
}

/*
  Componente que muestra los inputs de los atributos
*/
function InputsAtributo({ atributoSeleccionado, setAtributoSeleccionado }: { atributoSeleccionado: string, setAtributoSeleccionado: (atributo: string) => void }) {
  return <OpcionesFiltro nombre="atributo" opciones={atributosEspeciales} seleccionado={atributoSeleccionado} onChange={setAtributoSeleccionado} />;
}

/*
  Renderiza opciones de selección única para un filtro.
*/
function OpcionesFiltro({ nombre, opciones, seleccionado, onChange }: { nombre: string, opciones: string[], seleccionado: string, onChange: (valor: string) => void }) {
  return (
    <div className="space-y-1">
      {opciones.map((opcion) => {
        const estaSeleccionada = seleccionado === opcion;
        const id = `${nombre}-${opcion}`;
        return (
          <label
            key={opcion}
            htmlFor={id}
            className={`flex cursor-pointer items-start gap-2 rounded-xl px-2.5 py-2 text-xs transition ${
              estaSeleccionada
                ? "bg-amber-100 font-semibold text-amber-950 dark:bg-amber-300/15 dark:text-amber-200"
                : "hover:bg-white dark:hover:bg-white/5"
            }`}
          >
            <input
              className="mt-0.5 accent-amber-500"
              type="radio"
              id={id}
              name={nombre}
              value={opcion}
              onChange={(evento) => onChange(evento.target.value)}
              checked={estaSeleccionada}
            />
            <span>{opcion}</span>
          </label>
        );
      })}
    </div>
  )
}

/*
  Componente que muestra las secciones especiales de un atributo
*/
function SeccionesEspeciales({ secciones }: { secciones: Seccion[] }) {
  return (
    <div>
      {secciones.length > 0 && (
        <h2 className="mb-2 text-sm font-semibold">
          Secciones compatibles <span className="text-slate-500">({secciones.length})</span>
        </h2>
      )}
      {secciones.map(seccion => (
        <SeccionEspecial key={seccion.nrc} seccion={seccion} />
      ))}
    </div>
  )
}

/*
  Componente que muestra una sección especial
*/
function SeccionEspecial({ seccion }: { seccion: Seccion }) {
  return (
    <article className="mb-2 rounded-xl border border-slate-200 bg-white p-3 text-left dark:border-white/10 dark:bg-neutral-900">
      <h3 className="text-sm font-bold leading-5">{seccion.titulo}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {seccion.curso.programa + seccion.curso.curso} · NRC {seccion.nrc} · Sección {seccion.seccion}
      </p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
        {seccion.cuposTomados}/{seccion.cuposMaximos} cupos ocupados
      </p>
      {seccion.profesores.length > 0 && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {seccion.profesores.map((profesor) => profesor.nombre).join(", ")}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {seccion.curso.atributos.map((atributo) => (
          <span key={atributo} className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-950 dark:bg-amber-300/15 dark:text-amber-200">
            {atributo}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {seccion.horarios.map((bloque) => <CasillasDias bloque={bloque} key={bloque.titulo + bloque.horaInicio + bloque.horaFin} />)}
      </div>
    </article>
  )
}