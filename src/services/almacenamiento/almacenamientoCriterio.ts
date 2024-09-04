import OrdenamientoHorario from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";
import OrdenamientoAleatorio from "@/models/algoritmosOrdenamiento/OrdenamientoAleatorio";
import OrdenamientoEntradasTardias from "@/models/algoritmosOrdenamiento/OrdenamientoEntradasTardias";
import OrdenamientoSalidasTempranas from "@/models/algoritmosOrdenamiento/OrdenamientoSalidasTempranas";
import OrdenamientoHuecosMinimos from "@/models/algoritmosOrdenamiento/OrdenamientoHuecosMinimos";
import OrdenamientoCuposLibres from "@/models/algoritmosOrdenamiento/OrdenamientoCuposLibres";

const algoritmosOrdenamiento: {[nombre:string] : OrdenamientoHorario} = {
  "sin huecos": new OrdenamientoHuecosMinimos(),
  "salir temprano": new OrdenamientoSalidasTempranas(),
  "entrar tarde": new OrdenamientoEntradasTardias(),
  "cupos libres": new OrdenamientoCuposLibres(),
  "aleatorio": new OrdenamientoAleatorio()
};

export function obtenerAlgoritmoOrdenamiento() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("criterio") === null) {
      localStorage.setItem("criterio", JSON.stringify("sin huecos"));
    }
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

