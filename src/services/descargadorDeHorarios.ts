export function descargarComoTxt(texto: string, nombreArchivo: string) {
    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto));
    elemento.setAttribute('download', nombreArchivo);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
}