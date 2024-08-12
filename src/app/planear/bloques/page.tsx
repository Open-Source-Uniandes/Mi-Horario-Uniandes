"use client";
import { useState, ChangeEvent, MouseEvent, createContext, useContext, useEffect } from 'react';
import BloqueTiempo from "@/models/BloqueTiempo";
import Image from "next/image";
import { EstadoBloques } from '@/types/contexto'
import { eliminarBloque,obtenerBloquesGuardados, guardarBloque} from '@/services/almacenamiento/almacenamientoBloques';

/*
  Contexto de los bloques de tiempo
*/
const BloqueContext = createContext<EstadoBloques>(
  { bloquesGuardados: {},
  setBloquesGuardados: () => {} ,
  bloqueEnCreacion: new BloqueTiempo(1, "", "", [], 630, 630),
  setBloqueEnCreacion: () => {}
});

/*
  Componente que se encarga de mostrar los bloques de tiempo planeados por el usuario y de permitirle crear nuevos bloques
*/
export default function Bloques() {
  const [bloqueEnCreacion, setBloqueEnCreacion] = useState<BloqueTiempo>(new BloqueTiempo(1, "", "", [], 630, 630));
  const [bloquesGuardados, setBloquesGuardados] = useState<{ [key: string]: BloqueTiempo[] }>({});
  useEffect(() => {
    setBloquesGuardados(obtenerBloquesGuardados());
  }, []);
  return (
    <BloqueContext.Provider value={{ bloquesGuardados, setBloquesGuardados, bloqueEnCreacion, setBloqueEnCreacion }}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FormularioBloque />
        <BloquesPlaneados />
      </div>
    </BloqueContext.Provider>
  );
}

/*
  Formulario para crear un bloque de tiempo
*/
function FormularioBloque() {
  const { bloqueEnCreacion, setBloqueEnCreacion, setBloquesGuardados } = useContext(BloqueContext);
  const handleClic = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!bloqueEnCreacion.titulo || !bloqueEnCreacion.lugar || !bloqueEnCreacion.horaInicio || !bloqueEnCreacion.horaFin) {
      alert("Por favor, llena todos los campos");
      return;
    }
    guardarBloque(bloqueEnCreacion);
    setBloquesGuardados(obtenerBloquesGuardados());
    setBloqueEnCreacion(new BloqueTiempo(1, "", "", [], 630, 630));
  };
  return (
    <div className="mx-auto w-[80%] min-w-44 pt-8 space-y-4">
      <h2 className='text-2xl font-semibold'>Crea un bloque de tiempo</h2>
      <InputsBloque />
      <CheckBoxDiasSemana />
      <button className="w-40 h-12 mx-auto block bg-yellow-300  rounded border-2 border-black hover:bg-yellow-400 transition-colors duration-300 ease-in-out" onClick={handleClic}>Crear</button>
    </div>
  )
}

/*
  Inputs para llenar la información de un bloque de tiempo
*/
function InputsBloque() {
  const { bloqueEnCreacion, setBloqueEnCreacion } = useContext(BloqueContext);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBloqueEnCreacion({...bloqueEnCreacion, [name]: value});
  };
  return (
    <div>
      <label className='text-lg' htmlFor="nombre">Nombre</label>
      <input placeholder="Videojuegos" className="w-full text-lg bg-gray-100 focus:outline-none border border-1 border-gray-300 focus:border-gray-400" type="text" id="titulo" name="titulo" value={bloqueEnCreacion.titulo} onChange={handleChange}/>
      <label className="text-lg" htmlFor="lugar">Lugar</label>
      <input placeholder="Centro deportivo" className="w-full text-lg bg-gray-100 focus:outline-none border border-1 border-gray-300 focus:border-gray-400" type="text" id="lugar" name="lugar" value={bloqueEnCreacion.lugar} onChange={handleChange}/>
      <label className="text-lg" htmlFor="horaInicio">Hora Inicio (HHMM)</label>
      <input className="w-full text-lg bg-gray-100 focus:outline-none border border-1 border-gray-300 focus:border-gray-400" type="number" id="horaInicio" name="horaInicio" value={bloqueEnCreacion.horaInicio !== undefined ? bloqueEnCreacion.horaInicio.toString() : ''} onChange={handleChange}/>
      <label className="text-lg" htmlFor="horaFin">Hora Fin (HHMM)</label>
      <input className="w-full text-lg bg-gray-100 focus:outline-none border border-1 border-gray-300 focus:border-gray-400" type="number" id="horaFin" name="horaFin" value={bloqueEnCreacion.horaFin !== undefined ? bloqueEnCreacion.horaFin.toString()  : ''} onChange={handleChange}/>
    </div>
  )
}

/*
  Checkbox para seleccionar los días de la semana en los que se repetirá el bloque
*/
function CheckBoxDiasSemana() {
  const { bloqueEnCreacion, setBloqueEnCreacion } = useContext(BloqueContext);
  const diasSemana = ["l", "m", "i", "j", "v", "s"];
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    checked ? bloqueEnCreacion.dias.push(value) : bloqueEnCreacion.dias = bloqueEnCreacion.dias.filter((dia) => dia !== value);
    setBloqueEnCreacion({...bloqueEnCreacion, dias: bloqueEnCreacion.dias});
  }
  return (
    <div className='flex place-content-around'>
      {diasSemana.map((dia, index) => (
        <label key={index} className="text-3xl">
          <input className="w-6 h-6" type="checkbox" name="dias" value={dia} onChange={handleChange}/>
          {dia.charAt(0).toUpperCase() + dia.slice(1)}
        </label>
      ))}
    </div>
  );
}

/*
  Bloques de tiempo planeados por el usuario
*/
function BloquesPlaneados() {
  const { bloquesGuardados, setBloquesGuardados } = useContext(BloqueContext);
  const handleEliminar = (bloque: BloqueTiempo) => {
    eliminarBloque(bloque);
    setBloquesGuardados(obtenerBloquesGuardados());
  };
  return (
    <div className="mx-auto w-[80%] min-w-44 pt-8">
    <h2 className='text-2xl font-semibold'>Tus bloques planeados</h2>
    <p className='text-lg mt-2'>Aquí puedes ver los bloques que has planeado</p>
      <div>
        {Object.values(bloquesGuardados).map((listaBloques) => (
          listaBloques.map((bloque, index) => (
            <BloquePlaneado key={index} bloque={bloque} funcionEliminar={() => handleEliminar(bloque)}/>
          ))
        ))}
      </div>
    </div>
  )
}

/*
  Bloque de tiempo planificado por el usuario

  @param bloque bloque de tiempo planeado
  @param funcionEliminar función que se ejecuta al hacer clic en el botón de eliminar
*/
function BloquePlaneado({ bloque , funcionEliminar }: { bloque: BloqueTiempo, funcionEliminar: () => void }) {
  return (
    <div className="bg-gray-100 text-center  flex flex-col  border border-3 border-black  h-36 my-3">
      <div className='bg-yellow-400 flex h-8 place-content-end'>
        <Image src="/cruz.svg" alt="Eliminar" width="0" height={24} onClick={funcionEliminar} className='w-6 h-auto cursor-pointer'/>
      </div>
      <h3 className="text-lg font-semibold">{bloque.titulo}</h3>
      <p>{bloque.lugar}</p>
      <p>{bloque.dias?.join(", ")}</p>
      <p>{bloque.horaInicio + " - " + bloque.horaFin}</p>
    </div>
  );
}