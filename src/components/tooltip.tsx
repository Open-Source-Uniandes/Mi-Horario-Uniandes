/*
  Define un tooltip que muestra un mensaje al pasar el mouse sobre un elemento

  @param children El elemento al que se le aplicará el tooltip
  @param mensaje El mensaje que se mostrará al pasar el mouse sobre el elemento
*/

export default function Tooltip({ children, mensaje }: { children: React.ReactNode, mensaje: string }) {
    return (
      <div className="group relative inline-block">
        {children}
        <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-yellow-300 text-black text-sm px-2 py-1 rounded border border-black">
          {mensaje}
        </span>
      </div>
    );
  }