import Seccion from "@/models/Seccion";
import { atributosEspeciales, obtenerSeccionesPorAtributoYPrograma, programasEspeciales } from "@/services/fetcher";
import { ChevronLast, ChevronFirst } from "lucide-react"; // Son iconos de flechas hacia la izquierda y derecha
import { createContext, useState, ChangeEvent, useContext, useEffect } from "react";



interface SidebarContextProps {
  estaExpandido: boolean;
}
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export default function SidebarCursosConAtributos() {
  const [expandido, setExpandido] = useState<boolean>(true);
  return (
    <SidebarContext.Provider value={{ estaExpandido: expandido }}>
      <aside>
        <nav className="h-full  flex flex-col bg-gray-300 border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <button onClick={() => setExpandido((estadoActual) => !estadoActual)} className="p-1.5 rounded-lg bg-yellow-200 hover:bg-yellow-300">
              {expandido ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <div className="border-t flex p-3">
            <div className={` flex justify-between items-center overflow-hidden transition-all ${expandido ? "w-52 ml-3" : "w-0"} `}>
              <CursosPorAtributo/>
            </div>
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

/*
  Componente que muestra los cursos agrupados por atributo
*/
function CursosPorAtributo() {
  const [seccionesEncontradas, setSeccionesEncontradas] = useState<Seccion[]>([]);
  const [atributoSeleccionado, setAtributoSeleccionado] = useState<string>("");
  const [programaSeleccionado, setProgramaSeleccionado] = useState<string>("");
  useEffect(() => {
    setSeccionesEncontradas([]);
    async function fetchData() {
      if (atributoSeleccionado === "" && programaSeleccionado === "") return;
      const secciones = await obtenerSeccionesPorAtributoYPrograma(atributoSeleccionado, programaSeleccionado);
      setSeccionesEncontradas(secciones);
    }
    fetchData();
  }, [atributoSeleccionado, programaSeleccionado]);
  return (
    <div>
      <div>
        <h2>Selecciona un atributo</h2>
        <InputsAtributo atributoSeleccionado={atributoSeleccionado} setAtributoSeleccionado={setAtributoSeleccionado}/>
        <h2>Selecciona un programa especial</h2>
        <InputsProgramaEspecial programaSeleccionado={programaSeleccionado} setProgramaSeleccionado={setProgramaSeleccionado}/>
        <BotonQuitarFiltros setAtributoSeleccionado={setAtributoSeleccionado} setProgramaSeleccionado={setProgramaSeleccionado}/>
        <SeccionesEspeciales secciones={seccionesEncontradas}/>
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
        <h2 className="text-center font-semibold">Secciones Encontradas</h2>
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

