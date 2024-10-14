import ClipLoader from "react-spinners/ClipLoader";
/*
  Spinner de carga

  @param mensajeDeCarga Mensaje que se muestra mientras se carga
  @param mensajeAuxiliar Mensaje adicional que se muestra mientras se carga
*/
export default function Spinner({ mensajeDeCarga, mensajeAuxiliar }: { mensajeDeCarga: string , mensajeAuxiliar?: string }) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:text-white">
        <ClipLoader color={"#FFD700"} loading={true} size={150} />
        <p className="text-center text-xl mt-4 font-semibold">{mensajeDeCarga}</p>
        {mensajeAuxiliar && <p className="text-center text-lg mt-4">{mensajeAuxiliar}</p>}
      </div>
    );
  }