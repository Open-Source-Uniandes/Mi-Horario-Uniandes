'use client'
import { Calendario } from "@/components/calendario";
import { NavbarHorario } from "@/components/navbars";
import Horario from "@/models/Horario";
import { obtenerHorarioAPartirDePlan } from "@/services/fetcher";
import { useEffect, useState } from "react";
import { descargarComoTxt } from "@/services/descargadorDeHorarios";
import Spinner from "@/components/spinner";
import { Download } from "lucide-react";
import BotonPrimario from "@/components/BotonPrimario";

/*
  Este componente se encarga de mostrar el horario de un plan guardado y permitir al usuario descargarlo como txt
*/
export default function Editar({ params }: { params: { planId: string } }) {
  const [horario, setHorario] = useState<Horario>(new Horario(0, []));
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    async function obtenerPlan() {
      setCargando(true);
      setHorario(await obtenerHorarioAPartirDePlan(Number(params.planId)));
      setCargando(false);
    }
    obtenerPlan();
  }, [params.planId]);
  const handleDescargar = () => {
    const infoSecciones = horario.secciones.map(seccion => seccion.curso.programa + seccion.curso.curso + " : " + seccion.nrc).join("\n");
    descargarComoTxt(infoSecciones, "horario.txt");
  };
  return (
    <div className="min-h-screen flex flex-col dark:bg-page-dark">
      <NavbarHorario />
      {cargando ? <Spinner mensajeDeCarga="Cargando horario" /> :
        <div className="pt-16 flex flex-1">
          <main className="w-full flex flex-col justify-between">
            <Calendario horario={horario} />
            <div className="flex justify-center p-4">
              <BotonPrimario
                onClick={handleDescargar}
              >
                <Download size={18} aria-hidden="true" />
                Descargar como TXT
              </BotonPrimario>
            </div>
          </main>
        </div>
    }
    </div>
  )
}
