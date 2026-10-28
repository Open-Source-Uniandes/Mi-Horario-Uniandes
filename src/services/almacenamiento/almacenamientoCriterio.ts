import OrdenamientoHorario from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";
import OrdenamientoAleatorio from "@/models/algoritmosOrdenamiento/OrdenamientoAleatorio";
import OrdenamientoEntradasTardias from "@/models/algoritmosOrdenamiento/OrdenamientoEntradasTardias";
import OrdenamientoSalidasTempranas from "@/models/algoritmosOrdenamiento/OrdenamientoSalidasTempranas";
import OrdenamientoHuecosMinimos from "@/models/algoritmosOrdenamiento/OrdenamientoHuecosMinimos";
import OrdenamientoCuposLibres from "@/models/algoritmosOrdenamiento/OrdenamientoCuposLibres";
import OrdenamientoCreditos from "@/models/algoritmosOrdenamiento/OrdenamientoCreditos";
import OrdenamientoCompuesto from "@/models/algoritmosOrdenamiento/OrdenamientoCompuesto";

const algoritmosOrdenamiento: {[nombre:string] : OrdenamientoHorario} = {
  "más créditos": new OrdenamientoCreditos(),
  "sin huecos": new OrdenamientoHuecosMinimos(),
  "salir temprano": new OrdenamientoSalidasTempranas(),
  "entrar tarde": new OrdenamientoEntradasTardias(),
  "cupos libres": new OrdenamientoCuposLibres(),
  "aleatorio": new OrdenamientoAleatorio()
};

export function obtenerCriteriosOrdenamientoGuardados(): string[] {
  if (typeof window !== "undefined") {
    const guardado: unknown = JSON.parse(localStorage.getItem("criterio") || '"sin huecos"');
    const criterios = Array.isArray(guardado) ? guardado : [guardado];
    const validos = criterios.filter(
      (criterio): criterio is string =>
        typeof criterio === "string" && Object.hasOwn(algoritmosOrdenamiento, criterio),
    );
    if (validos.length > 0) return Array.from(new Set(validos));
  }
  return ["sin huecos"];
}

export function guardarCriteriosOrdenamiento(criterios: string[]) {
  if (typeof window !== "undefined") {
    const validos = criterios.filter((criterio) =>
      Object.hasOwn(algoritmosOrdenamiento, criterio),
    );
    localStorage.setItem("criterio", JSON.stringify(Array.from(new Set(validos))));
  }
}

export function obtenerOrdenamientosDisponibles() {
  return Object.keys(algoritmosOrdenamiento);
}

export function obtenerAlgoritmoOrdenamiento() {
  const criterios = obtenerCriteriosOrdenamientoGuardados()
    .map((criterio) => algoritmosOrdenamiento[criterio])
    .filter((algoritmo): algoritmo is OrdenamientoHorario => Boolean(algoritmo));
  return new OrdenamientoCompuesto(criterios);
}
