import Link  from "next/link";
import Image from "next/image";


/*
  Navbar utilizado en la planeación general de horario
  Solo contiene el titulo de la aplicación como link
*/
export function NavbarSimple() {
  return (
    <header className="flex items-center h-16 px-4 bg-yellow-300  md:px-6 fixed w-screen">
      <Link className="text-lg font-medium mx-auto hover:font-bold hover:delay-75" href={"/"} >Mi horario Uniandes</Link>
    </header>
  )
}

/*
  Nabvar utilizado en la revisión de horarios generados
  Contiene un boton para regresar, el titulo de la aplicación como link y dos botones para cambiar de horario
*/
export function NavbarVer({funcionHorarioAnterior, funcionHorarioSiguiente}: {funcionHorarioAnterior: () => void, funcionHorarioSiguiente: () => void}) {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-yellow-300 md:px-6 fixed z-10 w-full">
      <div className="flex items-center gap-4">
        <BotonRegresar/>
      </div>
      <Link className="text-lg font-medium mx-auto hover:font-bold hover:delay-75" href={"/"} >Mi horario Uniandes</Link>
      <div className="flex items-center gap-2">
        <BotonHorarioAnterior funcionClic={funcionHorarioAnterior}/>
        <BotonSiguienteHorario funcionClic={funcionHorarioSiguiente}/>
      </div>
    </header>
  )
}

/*
  Navbar utilizado en la edición de un plan
  Contiene un boton para regresar y el titulo de la aplicación como link
*/
export function NavbarEditar() {
  return (
    <header className="flex items-center h-16 px-4 bg-yellow-300  md:px-6 w-full fixed z-10 ">
      <div className="flex items-center gap-4">
        <BotonRegresar/>
      </div>
      <Link className="text-lg font-medium mx-auto hover:font-bold hover:delay-75" href={"/"} >Mi horario Uniandes</Link>
    </header>
  )
}

/*
  Boton que permite cambiar el horario actual al anterior
*/
function BotonHorarioAnterior({funcionClic}: {funcionClic: () => void}) {
  return (
    <button className="rounded-full" onClick={funcionClic}>
      <Image src="/Mi-Horario-Uniandes/static/flechaIzquierda.svg" alt="Horario anterior" width={24} height={24}/>
      <span className="sr-only">Anterior horario</span>
    </button>
  );
}

/*
  Boton que permite cambiar el horario actual al siguiente
*/
function BotonSiguienteHorario({funcionClic}: {funcionClic: () => void}) {
  return (
    <button className="rounded-full" onClick={funcionClic}>
      <Image src="/Mi-Horario-Uniandes/static/flechaDerecha.svg" alt="Horario siguiente" width={24} height={24}/>
      <span className="sr-only">Siguiente horario</span>
    </button>
  )
}

/*
  Boton que permite regresar al menu de planeación
*/
function BotonRegresar() {
  return (
    <button className="rounded-full">
      <Link href="/planear">
        <Image src="/Mi-Horario-Uniandes/static/salida.svg" alt="Seguir planeando" width={24} height={24}/>
        <span className="sr-only">Regresar</span>
      </Link>
    </button>
  )
}

