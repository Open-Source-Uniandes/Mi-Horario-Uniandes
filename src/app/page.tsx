/*
  Este archivo contiene la página principal del proyecto
  Contiene un mensaje de bienvenida, una breve descripción de la aplicación y un botón para planear horarios
*/

import Image from "next/image";
import Link from "next/link";
import {NavbarSimple} from "@/components/navbars";

/*
  Función de la página principal de la aplicación
*/
export default function PaginaPrincipal() {
  return (
    <div className="flex flex-col min-h-screen">
	    <NavbarSimple />
      <Main/>
      <Footer/>
    </div>
  );
}

/*
  Contenido de la página principal
  Contiene un mensaje de bienvenida, una breve descripción de la aplicación y un botón para planear horarios
  Tambien contiene un mensaje para informar sobre el servicio de notificaciones
*/
function Main(){
  return (
    <main className="pt-24 px-8">
        <h1 className="text-3xl font-semibold">Tu Horario Perfecto</h1>
          <h2 className="text-2xl font-semibold">Planear nunca había sido tan fácil</h2>
            <p className="text-xl font-medium mt-4">¡Bienvenidx a Mi Horario Uniandes!</p>
            <p className="text-lg">Creamos esta herramienta para hacer más fácil tu inscripción de materias. Con un solo clic podrás ver todas las posibilidades para encontrar el horario de tus sueños. ¡Es tan sencillo como agregar los cursos que planeas ver!</p>
          <h2 className="text-xl font-medium mt-4">A tu medida</h2>
            <p className="text-lg">Personaliza las opciones de búsqueda para considerar solo las secciones que tú quieres, en los horarios que tú quieres. Añade bloques de tiempo para reservar tus horas de almuerzo y de parchar con tus amigos. Optimiza tu horario para minimizar huecos o para salir más temprano. ¡Tu semestre perfecto a un solo clic de distancia!</p>
          <h2 className="text-xl font-medium mt-4">Open Source</h2>
            <p className="text-lg">Este es un proyecto de la comunidad Uniandina para la comunidad Uniandina. El código que hace posible esta herramienta es tuyo. Anímate a proponer nuevas funcionalidades, cambios de diseño, optimizaciones, o lo que tú quieras. ¡Tu aporte impactará toda la comunidad Uniandina! </p>
          <h2 className="text-xl font-medium mt-4">Inicia aquí 👇</h2>
            <p className="text-lg"> Queremos ofrecerte la información más actualizada desde Banner. Por esto, cada vez que consultes un curso se descargará nuevamente la información. Esto no suele tomar mucho tiempo. </p>
            <p className="my-4 text-lg font-bold">Recuerda que debes inscribir tus cursos a través de Banner, este proceso no se hace automáticamente.</p>
        <ServicioNotificaciones/>
        <button className="my-4 w-40 h-12 mx-auto block bg-yellow-300 rounded border-2 border-black hover:bg-yellow-400 transition-colors duration-300 ease-in-out">
          <Link href="planear">Arma tu horario</Link>
        </button>
    </main>
  )
}

/*
  Contiene el enlace al servicio de notificaciones
  Consiste en un rectangulo con bordes amarillos que al ser presionado redirige a la página de notificaciones
  El rectangulo contiene un mensaje de introducción y una breve descripción del servicio
*/
function ServicioNotificaciones(){
  return (
    <div className="my-4 w-fit h-fit rounded-md bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 p-2 mx-auto">
      <div className="flex h-full items-center justify-center dark:bg-black bg-white p-3 hover:bg-yellow-100 transition-colors duration-300 ease-in-out">
        <Link href="https://open-source-uniandes.github.io/notifications/" target="_blank">
          <div>
            <p className="text-lg font-semibold">¡Conoce nuestro servicio de notificaciones!</p>
            <p>Te avisamos cuando tus cursos se queden sin cupos.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

/*
  Contiene el footer de la página principal
  Consiste en un contenedor oscuro con el mensaje "Hecho con 💛 en Uniandes" y un link para ver el proyecto
*/
function Footer() {
  return (
    <footer  className="flex items-center justify-center bg-neutral-800 py-5 text-white w-screen mt-auto">
      <div>
        <p className="text-center text-lg">Hecho con 💛 en Uniandes</p>
        <Link href="https://github.com/Open-Source-Uniandes/Mi-Horario-Uniandes" className="font-semibold text-yellow-300  hover:text-yellow-500 transition-colors duration-300 ease-in-out">Sé parte de este proyecto aquí</Link>
      </div>
      <Image src="/static/seneca-icon.svg" alt="Icono seneca" width={70} height={70} className="ml-6" />
    </footer>
  )
}