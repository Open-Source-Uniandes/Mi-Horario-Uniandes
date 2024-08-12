'use client'
import { CalendarioConBloques } from "@/components/calendario";
import { useEffect, useState } from "react";
import Horario from "@/models/Horario";
import { NavbarVer } from "@/components/navbars";
import {esPosibleCrearPlan , guardarPlan} from "@/services/almacenamiento/almacenamientoPlanes";
import SidebarCursosConAtributos from "@/components/sideBarCursosConAtributos";
import { generarHorarios } from "@/services/operacionesSobreHorario";
import { obtenerBloquesGuardados } from "@/services/almacenamiento/almacenamientoBloques";
import BloqueTiempo from "@/models/BloqueTiempo";

/*
  Página que muestra los horarios generados así como la opción de guardar un horario y ver cursos especiales que se ajustan
*/
export default function Ver() {
  const [horariosGenerados, setHorariosGenerados] = useState<Horario[]>([]);
  const [indiceHorario, setIndiceHorario] = useState(0);
  useEffect(() => {
    async function fetchData() {
      setHorariosGenerados(await generarHorarios());
    }
    fetchData();
  }, []);
  const siguienteHorario = () => setIndiceHorario((indiceHorario + 1) % horariosGenerados.length);
  const anteriorHorario = () => setIndiceHorario((indiceHorario - 1 + horariosGenerados.length) % horariosGenerados.length);
  return (
    <div className="min-h-screen flex flex-col">
    <NavbarVer funcionHorarioSiguiente={siguienteHorario} funcionHorarioAnterior={anteriorHorario} />
    <div className="pt-16 flex flex-1">
      <SidebarCursosConAtributos />
      <PanelHorario horariosGenerados={horariosGenerados} indiceHorario={indiceHorario} />
    </div>
    </div>
  )
}

/*
  Panel que muestra un horario generado

  @param horariosGenerados lista de horarios generados
  @param indiceHorario índice del horario a mostrar
*/
function PanelHorario({horariosGenerados, indiceHorario} : {horariosGenerados: Horario[], indiceHorario: number}) {
  const [bloquesUsuario, setBloquesUsuario] = useState<{[titulo: string]: BloqueTiempo[]}>({});
  useEffect(() => {
    setBloquesUsuario(obtenerBloquesGuardados());
  }, []);

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