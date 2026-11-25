"use client";

export type PeriodoAcademico = {
  codigo: string;
  nombre: string;
};

const API_PERIODOS = "https://ofertadecursos.uniandes.edu.co/api/terms";
const CLAVE_CACHE = "periodosAcademicos";
const DURACION_CACHE_MS = 24 * 60 * 60 * 1000;

let periodosEnMemoria: PeriodoAcademico[] | null = null;

function validarPeriodos(datos: unknown): PeriodoAcademico[] {
  if (!Array.isArray(datos)) {
    throw new Error("La respuesta de períodos no tiene el formato esperado.");
  }

  return datos.map((periodo) => {
    if (
      !periodo ||
      typeof periodo.term_desc !== "string" ||
      typeof periodo.term_name !== "string"
    ) {
      throw new Error("La respuesta de períodos contiene datos inválidos.");
    }
    return { codigo: periodo.term_desc, nombre: periodo.term_name };
  });
}

export async function obtenerPeriodosAcademicos(): Promise<PeriodoAcademico[]> {
  if (periodosEnMemoria) return periodosEnMemoria;

  let cacheLocal: { guardadoEn: number; periodos: PeriodoAcademico[] } | null = null;
  try {
    const cache = localStorage.getItem(CLAVE_CACHE);
    if (cache) {
      const datosCache = JSON.parse(cache);
      if (
        typeof datosCache.guardadoEn === "number" &&
        Array.isArray(datosCache.periodos)
      ) {
        cacheLocal = {
          guardadoEn: datosCache.guardadoEn,
          periodos: validarPeriodos(datosCache.periodos.map((periodo: PeriodoAcademico) => ({
            term_desc: periodo.codigo,
            term_name: periodo.nombre,
          }))),
        };
        if (Date.now() - cacheLocal.guardadoEn < DURACION_CACHE_MS) {
          periodosEnMemoria = cacheLocal.periodos;
          return periodosEnMemoria;
        }
      }
    }
  } catch {
    localStorage.removeItem(CLAVE_CACHE);
  }

  try {
    const respuesta = await fetch(API_PERIODOS);
    if (!respuesta.ok) {
      throw new Error(`No se pudieron cargar los períodos (HTTP ${respuesta.status}).`);
    }
    const periodos = validarPeriodos(await respuesta.json());
    if (periodos.length === 0) {
      throw new Error("La API no devolvió períodos académicos.");
    }
    localStorage.setItem(CLAVE_CACHE, JSON.stringify({ guardadoEn: Date.now(), periodos }));
    periodosEnMemoria = periodos;
    return periodos;
  } catch (error) {
    if (cacheLocal) {
      periodosEnMemoria = cacheLocal.periodos;
      return cacheLocal.periodos;
    }
    throw error;
  }
}
