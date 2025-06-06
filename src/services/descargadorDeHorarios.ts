export function descargarComoTxt(texto: string, nombreArchivo: string) {
    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto));
    elemento.setAttribute('download', nombreArchivo);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
}

export function cargarComoTxt(): Promise<string> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/plain';
        input.style.display = 'none';
        input.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const file = target.files[0];
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            } else {
                resolve("");
            }
        });
        document.body.appendChild(input);
        input.click();
        input.remove();
    });
}