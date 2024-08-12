import OrdenamientoHorario from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";
import OrdenamientoAleatorio from "@/models/algoritmosOrdenamiento/OrdenamientoAleatorio";
import OrdenamientoEntradasTardias from "@/models/algoritmosOrdenamiento/OrdenamientoEntradasTardias";
import OrdenamientoSalidasTempranas from "@/models/algoritmosOrdenamiento/OrdenamientoSalidasTempranas";
import OrdenamientoHuecosMinimos from "@/models/algoritmosOrdenamiento/OrdenamientoHuecosMinimos";

const algoritmosOrdenamiento: {[nombre:string] : OrdenamientoHorario} = {
  "sin huecos": new OrdenamientoHuecosMinimos(),
  "salir temprano": new OrdenamientoSalidasTempranas(),
  "entrar tarde": new OrdenamientoEntradasTardias(),
  "aleatorio": new OrdenamientoAleatorio()
};

export function obtenerAlgoritmoOrdenamiento() {
  if (typeof window !== "undefined") {
    const algoritmoGuardado = JSON.parse(localStorage.getItem("criterio") || "");
    if (algoritmoGuardado) {
      return algoritmosOrdenamiento[algoritmoGuardado];
    }
  }
  return algoritmosOrdenamiento["sin huecos"];
}

export function guardarAlgoritmoOrdenamiento(algoritmo: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("criterio", JSON.stringify(algoritmo));
  }
}

export function obtenerOrdenamientosDisponibles() {
  return Object.keys(algoritmosOrdenamiento);
}

