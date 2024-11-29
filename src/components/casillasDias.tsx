import BloqueTiempo from "@/models/BloqueTiempo";
import { tiempoNumeroATexto } from "@/services/formateadorTiempo";

/*
    Componente que muestra en fila los días de la semana en los que se da un bloque de tiempo
*/
export default function CasillasDias({ bloque }: { bloque: BloqueTiempo }) {
  const diasSemana = ["L", "M", "I", "J", "V", "S"];
  return (
    <div className="my-1">
      {tiempoNumeroATexto(bloque.horaInicio)} - {tiempoNumeroATexto(bloque.horaFin)}
      <div className="flex justify-center items-center space-x-1 ">
        {diasSemana.map((letraDia, index) => (
            <div key={index} className={`w-5 h-5 bg-black-300 flex items-center justify-center rounded-md  ${bloque.dias.includes(letraDia.toLowerCase()) ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-neutral-800'}`}>
            <span className="text-xl font-semibold text-gray-700 dark:text-gray-500">
                {letraDia}
            </span>
            </div>
        ))}
      </div>
    </div>
  );
}

