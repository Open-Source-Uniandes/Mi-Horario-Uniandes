'use client'
import { CalendarioConBloques } from "@/components/calendario";
import { ChangeEvent, useEffect, useState } from "react";
import Horario from "@/models/Horario";
import { NavbarVer } from "@/components/navbars";
import {esPosibleCrearPlan , guardarPlan} from "@/services/almacenamiento/almacenamientoPlanes";
import { SidebarCursosConAtributos } from "@/components/sideBarCursosConAtributos";
import { generarHorarios } from "@/services/operacionesSobreHorario";
import { obtenerBloquesGuardados } from "@/services/almacenamiento/almacenamientoBloques";
import BloqueTiempo from "@/models/BloqueTiempo";
import Seccion from "@/models/Seccion";
import { atributosEspeciales, obtenerSeccionesPorAtributoYPrograma, programasEspeciales } from "@/services/fetcher";
import { filtrarSeccionesQueColisionan } from "@/services/operacionesSobreHorario";
import Spinner from "@/components/spinner";
import Image from "next/image";

/*
  Página que muestra los horarios generados así como la opción de guardar un horario y ver cursos especiales que se ajustan
*/
export default function Ver() {
  const [horariosGenerados, setHorariosGenerados] = useState<Horario[]>([]);
  const [indiceHorario, setIndiceHorario] = useState(0);
  const [bloquesUsuario, setBloquesUsuario] = useState<{[titulo: string]: BloqueTiempo[]}>({});
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    async function obtenerHorarios() {
      setCargando(true);
      setBloquesUsuario(obtenerBloquesGuardados());
      setHorariosGenerados(await generarHorarios());
      setCargando(false);
    }
    obtenerHorarios();
  }, []);
  const siguienteHorario = () => setIndiceHorario((indiceHorario + 1) % horariosGenerados.length);
  const anteriorHorario = () => setIndiceHorario((indiceHorario - 1 + horariosGenerados.length) % horariosGenerados.length);
  return (
    <div className="min-h-screen flex flex-col">
    <NavbarVer funcionHorarioSiguiente={siguienteHorario} funcionHorarioAnterior={anteriorHorario} />
    {cargando && <Spinner mensajeDeCarga="Generando horarios..." mensajeAuxiliar="Intenta seleccionar menos secciones para obtener horarios más rápido"/> }
    {!cargando && horariosGenerados.length > 0 &&
      <div className="pt-16 flex flex-1">
        <SidebarCursosConAtributos>
          <CursosPorAtributo horario={horariosGenerados[indiceHorario]}/>
        </SidebarCursosConAtributos>
        <PanelHorario horariosGenerados={horariosGenerados} indiceHorario={indiceHorario} bloquesUsuario={bloquesUsuario}/>
      </div>
    }
    {!cargando && horariosGenerados.length === 0 && <NoHayHorarios />}
    </div>
  )
}

function NoHayHorarios() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center my-auto">
      <Image src="/senecaSorprendida.svg" alt="Error" width={200} height={200} />
      <p className="text-xl font-semibold">No se encontraron horarios</p>
      <p className="text-lg">Intenta eliminar bloques o secciones para obtener horarios</p>
    </div>
  );
}

/*
  Panel que muestra un horario generado

  @param horariosGenerados lista de horarios generados
  @param indiceHorario índice del horario a mostrar
  @param bloquesUsuario bloques de tiempo guardados por el usuario
*/
function PanelHorario({horariosGenerados, indiceHorario, bloquesUsuario} : {horariosGenerados: Horario[], indiceHorario: number, bloquesUsuario: {[titulo: string]: BloqueTiempo[]}}) {
  return (
    <main className="w-full flex flex-col justify-between">
      <div>
        <CalendarioConBloques horario={horariosGenerados[indiceHorario]} bloquesUsuario={bloquesUsuario} />
        {horariosGenerados.length === 0 && <p className="text-center text-md">Total creditos: 0</p>}
        {horariosGenerados.length > 0 && <p className="text-center text-md">Total creditos: {horariosGenerados[indiceHorario].secciones.reduce((acc, seccion) => acc + Number(seccion.curso.creditos), 0)}</p>}
        <p className="text-center text-md ">¿Quieres guardar este horario para verlo más tarde, y usar nuestra herramienta para encontrar cursos especiales?</p>
        <p className="text-center text-md font-semibold">Da clic en el botón</p>
        <BotonGuardarPlan horariosGenerados={horariosGenerados} indiceHorario={indiceHorario} />
        <p className="text-center text-md font-semibold"> Mostrando el horario {horariosGenerados.length > 0 ? indiceHorario + 1 : 0} de {horariosGenerados.length} </p>
      </div>
    </main>
  )
}

/*
  Botón para guardar un horario como plan

  @param horariosGenerados lista de horarios generados
  @param indiceHorario índice del horario a guardar
*/
function BotonGuardarPlan({horariosGenerados, indiceHorario} : {horariosGenerados: Horario[], indiceHorario: number}) {
  const handleClic = () => {
    if (esPosibleCrearPlan()) {
      guardarPlan({ secciones: horariosGenerados[indiceHorario].secciones });
      alert("Plan guardado exitosamente");
    } else {
      alert("Ya tienes 5 planes guardados, elimina uno para poder guardar otro");
    }
  };
  return (
    <button onClick={handleClic} className=" w-40 h-12 mx-auto block bg-yellow-300 rounded border-2 border-black hover:bg-yellow-400 transition-colors duration-300 ease-in-out"> 
      Guardar como plan
    </button>
  )
}

/*
  Componente que muestra los cursos agrupados por atributo
*/
function CursosPorAtributo({horario}: {horario: Horario}) {
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
    <div>
      <div>
        <h2>Selecciona un atributo</h2>
        <InputsAtributo atributoSeleccionado={atributoSeleccionado} setAtributoSeleccionado={setAtributoSeleccionado}/>
        <h2>Selecciona un programa especial</h2>
        <InputsProgramaEspecial programaSeleccionado={programaSeleccionado} setProgramaSeleccionado={setProgramaSeleccionado}/>
        <BotonQuitarFiltros setAtributoSeleccionado={setAtributoSeleccionado} setProgramaSeleccionado={setProgramaSeleccionado}/>
        {cargando? <p className="text-center font-semibold text-md">Buscando cursos ...</p> : <SeccionesEspeciales secciones={seccionesEncontradas}/> }
        {seccionesEncontradas.length === 0 && !cargando && <p className="text-center font-semibold text-md">No se encontraron cursos</p>}
      </div>
    </div>
  )
}

/*
  Componente que remueve los filtros seleccionados
*/
function BotonQuitarFiltros({setAtributoSeleccionado, setProgramaSeleccionado}: {setAtributoSeleccionado: (atributo: string) => void, setProgramaSeleccionado: (programa: string) => void}) {
  return (
    <button className="my-4 w-40 h-12 mx-auto block bg-yellow-300 rounded border-2 border-black hover:bg-yellow-400 transition-colors duration-300 ease-in-out"
      onClick={() => {
        setAtributoSeleccionado("");
        setProgramaSeleccionado("");
      }}>
        Quitar Filtros
    </button>
  )
}

/*
  Componente que muestra los inputs de los programas especiales
*/
function InputsProgramaEspecial( {programaSeleccionado, setProgramaSeleccionado}: {programaSeleccionado: string, setProgramaSeleccionado: (programa: string) => void} ) {
  const handleSeleccionPrograma = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setProgramaSeleccionado(value);
  }
  return (
    <div>
      {programasEspeciales.map((programa) => (
        <InputProgramaEspecial key={programa} programa={programa} handleClick={handleSeleccionPrograma} seleccionado={programaSeleccionado === programa} />
      ))}
    </div>
  )
}

/*
  Componente que muestra un input de programa especial
*/
function InputProgramaEspecial({ programa, handleClick, seleccionado }: { programa: string, handleClick: (event: ChangeEvent<HTMLInputElement>) => void, seleccionado: boolean }) {
  return (
    <div>
      <input type="radio" id={programa} name="programa" value={programa} onChange={handleClick} checked={seleccionado} />
      <label htmlFor={programa}>{programa}</label>
    </div>
  )
}

/*
  Componente que muestra los inputs de los atributos
*/
function InputsAtributo({ atributoSeleccionado, setAtributoSeleccionado }: { atributoSeleccionado: string, setAtributoSeleccionado: (atributo: string) => void }) {
  const handleSeleccionAtributo = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAtributoSeleccionado(value);
  }
  return (
    <div>
      {atributosEspeciales.map((atributo) => (
        <InputAtributo key={atributo} atributo={atributo} handleClick={handleSeleccionAtributo} seleccionado={atributoSeleccionado === atributo} />
      ))}
    </div>
  )
}

/*
  Componente que muestra un input de atributo
*/
function InputAtributo({ atributo, handleClick, seleccionado }: { atributo: string, handleClick: (event: ChangeEvent<HTMLInputElement>) => void, seleccionado: boolean }) {
  return (
    <div>
      <input type="radio" id={atributo} name="atributo" value={atributo} onChange={handleClick} checked={seleccionado} />
      <label htmlFor={atributo}>{atributo}</label>
    </div>
  )
}

/*
  Componente que muestra las secciones especiales de un atributo
*/
function SeccionesEspeciales({secciones}: {secciones: Seccion[]}){
  return (
    <div>
        {secciones.length > 0 && <h2 className="text-center font-semibold">Secciones Encontradas</h2>}
        {secciones.map(seccion => (
          <SeccionEspecial key={seccion.nrc} seccion={seccion}/>
        ))}
    </div>
  )
}

/*
  Componente que muestra una sección especial
*/
function SeccionEspecial({seccion}: {seccion: Seccion}){
  return (
    <div className="bg-gray-100 text-center  flex  border border-3 border-black">
      <div className='flex flex-col justify-center'>
        <h3 className="text-md font-semibold">{seccion.titulo}</h3>
        <p>nrc: {seccion.nrc} sección: {seccion.seccion}</p>
        <p>Se han inscrito {seccion.cuposTomados} de {seccion.cuposMaximos} estudiantes</p>
        <p>{seccion.curso.programa + seccion.curso.curso}</p>
        <p>{seccion.profesores.map((profesor) => profesor.nombre).join(", ")}</p>
        <p>{seccion.horarios.map((bloque) => bloque.dias.join("") + " " + bloque.horaInicio + " " + bloque.horaFin).join(", ")}</p>
        {seccion.curso.atributos.map((atributo) => (
          <p key={atributo}>{atributo}</p>
        ))}
      </div>
    </div>
  )
}

