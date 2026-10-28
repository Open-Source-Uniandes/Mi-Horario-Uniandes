"use client";
import { useState, ChangeEvent, MouseEvent, createContext, useContext, useEffect } from 'react';
import BloqueTiempo from "@/models/BloqueTiempo";
import Image from "next/image";
import { EstadoBloques } from '@/types/contexto'
import { eliminarBloque,obtenerBloquesGuardados, guardarBloque} from '@/services/almacenamiento/almacenamientoBloques';
import { tiempoNumeroATexto } from '@/services/formateadorTiempo';
import CasillasDias from '@/components/casillasDias';
import BotonPrimario from "@/components/BotonPrimario";

/*
  Contexto de los bloques de tiempo
*/
const BloqueContext = createContext<EstadoBloques>(
  { bloquesGuardados: {},
  setBloquesGuardados: () => {} ,
  bloqueEnCreacion: new BloqueTiempo(1, "", "", [], 1300, 1430),
  setBloqueEnCreacion: () => {}
});

/*
  Componente que se encarga de mostrar los bloques de tiempo planeados por el usuario y de permitirle crear nuevos bloques
*/
export default function Bloques() {
  const [bloqueEnCreacion, setBloqueEnCreacion] = useState<BloqueTiempo>(new BloqueTiempo(1, "", "", [], 1300, 1430));
  const [bloquesGuardados, setBloquesGuardados] = useState<{ [key: string]: BloqueTiempo[] }>({});
  useEffect(() => {
    setBloquesGuardados(obtenerBloquesGuardados());
  }, []);
  return (
    <BloqueContext.Provider value={{ bloquesGuardados, setBloquesGuardados, bloqueEnCreacion, setBloqueEnCreacion }}>
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 px-4 py-6 sm:px-6 sm:py-8 xl:grid-cols-2">
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
    if (bloqueEnCreacion.horaFin <= bloqueEnCreacion.horaInicio) {
      alert("La hora de fin debe ser mayor que la hora de inicio.");
      return;
    }
    if (!bloqueEnCreacion.titulo || !bloqueEnCreacion.lugar || !bloqueEnCreacion.horaInicio || !bloqueEnCreacion.horaFin || bloqueEnCreacion.dias.length == 0) {
      alert("Por favor, llena todos los campos");
      return;
    }
    if (bloqueEnCreacion.horaInicio < 600) bloqueEnCreacion.horaInicio = 600;
    if (bloqueEnCreacion.horaFin > 2100) bloqueEnCreacion.horaFin = 2100;

    guardarBloque(bloqueEnCreacion);
    setBloquesGuardados(obtenerBloquesGuardados());
    setBloqueEnCreacion(new BloqueTiempo(1, "", "", [], 1300, 1430));
  };
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
        Tiempo para ti
      </p>
      <h2 className='mt-2 text-2xl font-bold tracking-tight'>Crea un bloque de tiempo</h2>
      <p className="mt-2 mb-6 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Reserva espacios en los que prefieres no tener clases.
      </p>
      <InputsBloque />
      <CheckBoxDiasSemana />
      <div className="mt-6 flex justify-center">
        <BotonPrimario className="w-full px-6 sm:w-auto" onClick={handleClic}>Crear bloque</BotonPrimario>
      </div>
    </section>
  )
}

/*
  Inputs para llenar la información de un bloque de tiempo
*/
function InputsBloque() {
  const { bloqueEnCreacion, setBloqueEnCreacion } = useContext(BloqueContext);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let valorFormateado = value;
    if (name === "horaInicio" || name === "horaFin") {
      valorFormateado = value.replace(":", "");
    }
    setBloqueEnCreacion({ ...bloqueEnCreacion, [name]: valorFormateado });
  };

  return (
    <div className="space-y-4">
      <label className='block text-sm font-semibold' htmlFor="titulo">Nombre</label>
      <input placeholder="Videojuegos" className="field-theme mt-1 h-11 w-full rounded-xl px-3 text-base" type="text" id="titulo" name="titulo" value={bloqueEnCreacion.titulo} onChange={handleChange}/>
      <label className="block text-sm font-semibold" htmlFor="lugar">Lugar</label>
      <input placeholder="Centro deportivo" className="field-theme mt-1 h-11 w-full rounded-xl px-3 text-base" type="text" id="lugar" name="lugar" value={bloqueEnCreacion.lugar} onChange={handleChange}/>
      <div className="grid grid-cols-2 gap-3">
      <label className="block text-sm font-semibold" htmlFor="horaInicio">Hora de inicio
      <input className="field-theme mt-1 h-11 w-full rounded-xl px-3 text-base [color-scheme:light] dark:[color-scheme:dark]" type="time" id="horaInicio" name="horaInicio" onChange={handleChange}
        value={bloqueEnCreacion.horaInicio !== undefined ? bloqueEnCreacion.horaInicio.toString().padStart(4, '0').slice(0, 2) + ":" + bloqueEnCreacion.horaInicio.toString().padStart(4, '0').slice(2): ''}
      />
      </label>
      <label className="block text-sm font-semibold" htmlFor="horaFin">Hora de fin
      <input className="field-theme mt-1 h-11 w-full rounded-xl px-3 text-base [color-scheme:light] dark:[color-scheme:dark]"
        type="time" id="horaFin" name="horaFin" onChange={handleChange}
        value={bloqueEnCreacion.horaFin !== undefined? bloqueEnCreacion.horaFin.toString().padStart(4, '0').slice(0, 2) + ":" + bloqueEnCreacion.horaFin.toString().padStart(4, '0').slice(2): ''}
      />
      </label>
      </div>
    </div>
  );
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
    <div className='mt-6 flex flex-wrap justify-between gap-2'>
      {diasSemana.map((dia, index) => (
        <label key={index} className="flex cursor-pointer flex-col items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <input className="h-5 w-5 accent-amber-400" type="checkbox" name="dias" value={dia} checked={bloqueEnCreacion.dias.includes(dia)}  onChange={handleChange}/>
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
    <section className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-8">
    <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">Tu semana</p>
    <h2 className='mt-2 text-2xl font-bold tracking-tight'>Tus bloques planeados</h2>
    <p className='mt-2 mb-6 text-sm leading-6 text-slate-600 dark:text-slate-300'>Aquí puedes ver los espacios que reservaste.</p>
      <div className="space-y-3">
        {Object.values(bloquesGuardados).map((listaBloques) => (
          listaBloques.map((bloque, index) => (
            <BloquePlaneado key={index} bloque={bloque} funcionEliminar={() => handleEliminar(bloque)}/>
          ))
        ))}
      </div>
    </section>
  )
}

/*
  Bloque de tiempo planificado por el usuario

  @param bloque bloque de tiempo planeado
  @param funcionEliminar función que se ejecuta al hacer clic en el botón de eliminar
*/
function BloquePlaneado({ bloque , funcionEliminar }: { bloque: BloqueTiempo, funcionEliminar: () => void }) {
  return (
    <article className="relative flex min-h-36 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-page p-4 text-center dark:border-white/10 dark:bg-neutral-800">
      <button type="button" aria-label={`Eliminar bloque ${bloque.titulo}`} onClick={funcionEliminar} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-rose-100 dark:hover:bg-rose-400/15">
        <Image src="/Mi-Horario-Uniandes/static/cruz.svg" alt="" width={16} height={16} className='icon-svg'/>
      </button>
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-lg font-bold">{bloque.titulo}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{bloque.lugar}</p>
        <CasillasDias bloque={bloque} />
      </div>
    </article>
  );
}
