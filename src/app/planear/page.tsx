/*
  Esta página es la que se muestra cuando el usuario entra a la sección de Planear Horario.
  Muestra una breve descripción de las funcionalidades disponibles en la aplicación.
*/
export default function Planear() {
  return (
    <main className="p-8 space-y-4 dark:bg-neutral-800 dark:text-white">
        <h1 className="text-3xl font-semibold">Planear Horario</h1>
        <p className="sm:text-lgdark:text-white">Para crear el horario de tus sueños, cuentas con las siguientes funcionalidades disponibles en el menú lateral izquierdo:</p>
        <h2 className="text-2xl font-semibold">🏫 Cursos</h2>
        <p className="sm:text-lge">Aquí podrás seleccionar las secciones que te gusten de los cursos que piensas tomar.</p>
        <h2 className="text-2xl font-semibold">🕗 Bloques</h2>
        <p className="sm:text-lg">¿No quieres madrugar a las 6:30? ¿Quieres almorzar con tus amigos a las 12:30? ¡Agrega esos momentos en los cuales, por ningún motivo, quieres que se te cruce una clase!</p>
        <h2 className="text-2xl font-semibold">🧺 Grupos</h2>
        <p className="sm:text-lg">¿Tienes varias opciones de cursos para cumplir una electiva, pero no quieres revisar opción por opción? Agrega todas las opciones y nos encargaremos de mostrártelas :)</p>
        <h2 className="text-2xl font-semibold">🗒️ Planes</h2>
        <p className="sm:text-lg">Aquí encontrarás todos los planes que hayas creado.</p>
        <h2 className="text-2xl font-semibold">⚙️ Criterios</h2>
        <p className="sm:text-lg">Aquí podrás seleccionar cómo quieres optimizar tu horario, por ejemplo, si quieres pocos huecos o si quieres salir temprano.</p>
        <h2 className="text-2xl font-semibold">📅 Ver</h2>
        <p className="sm:text-lg">Aquí encontrarás todos los horarios que hemos encontrado para ti.</p>
    </main>
  )
}