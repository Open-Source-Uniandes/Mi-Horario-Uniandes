"use client";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { AlertCircle, ChevronDown, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import type { Requisito } from "@/services/prerrequisitos";

import "@xyflow/react/dist/style.css";

const PROFUNDIDAD_MAXIMA = 5;
const NODOS_MAXIMOS = 80;

export type EstadoExpansion =
  | { estado: "cargando" }
  | { estado: "sin-oferta" }
  | { estado: "cargado"; requisitos: Requisito | null }
  | { estado: "error"; mensaje: string };

type DatosNodoCurso = {
  tipo: "curso";
  codigo: string;
  descripcion: string;
  ruta: string;
  ancestros: string[];
  profundidad: number;
  estado?: EstadoExpansion;
  alExpandir: (ruta: string, codigo: string, ancestros: string[]) => void;
};
type DatosNodoOperador = { tipo: "operador"; operador: "y" | "o"; descripcion?: string };
type DatosNodoTexto = { tipo: "texto"; texto: string };
type DatosNodo = DatosNodoCurso | DatosNodoOperador | DatosNodoTexto;
type Nodo = Node<DatosNodo>;

const tiposNodo = {
  curso: NodoCurso,
  operador: NodoOperador,
  texto: NodoTexto,
};

function NodoCurso({ data }: NodeProps<Nodo>) {
  if (data.tipo !== "curso") return null;
  const ciclo = data.ancestros.includes(data.codigo);
  const puedeExpandir = data.profundidad < PROFUNDIDAD_MAXIMA && !ciclo;
  const estado = data.estado;

  return (
    <div className={`min-w-48 max-w-60 rounded-xl border p-3 shadow-sm ${
      data.profundidad === 0
        ? "border-amber-500 bg-amber-50 dark:bg-amber-300/10"
        : "border-slate-200 bg-white dark:border-white/15 dark:bg-neutral-800"
    }`}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-transparent" />
      <p className="text-sm font-bold">{data.codigo}</p>
      {data.descripcion && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{data.descripcion}</p>}
      {ciclo ? (
        <p className="mt-2 text-xs font-medium text-rose-700 dark:text-rose-300">Ciclo detectado</p>
      ) : estado?.estado === "sin-oferta" ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Sin oferta en este período</p>
      ) : estado?.estado === "cargado" && !estado.requisitos ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Sin prerrequisitos registrados</p>
      ) : puedeExpandir && estado?.estado === "cargado" && estado.requisitos ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Requisitos cargados</p>
      ) : estado?.estado === "error" ? (
        <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
          <span className="flex items-center gap-1"><AlertCircle size={13} /> {estado.mensaje}</span>
          {puedeExpandir && (
            <button type="button" className="mt-1 underline" onClick={() => data.alExpandir(data.ruta, data.codigo, data.ancestros)}>
              Reintentar
            </button>
          )}
        </p>
      ) : puedeExpandir && (estado?.estado === "cargando" || !estado) ? (
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-200 disabled:opacity-60 dark:bg-amber-300/15 dark:text-amber-100"
          onClick={() => data.alExpandir(data.ruta, data.codigo, data.ancestros)}
          disabled={estado?.estado === "cargando"}
        >
          {estado?.estado === "cargando" ? <LoaderCircle size={13} className="animate-spin" /> : <ChevronDown size={13} />}
          {estado?.estado === "cargando" ? "Cargando..." : "Explorar"}
        </button>
      ) : null}
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-transparent" />
    </div>
  );
}

function NodoOperador({ data }: NodeProps<Nodo>) {
  if (data.tipo !== "operador") return null;
  const esY = data.operador === "y";
  return (
    <div className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm ${
      esY
        ? "border-sky-300 bg-sky-100 text-sky-950 dark:border-sky-400/40 dark:bg-sky-400/15 dark:text-sky-100"
        : "border-orange-300 bg-orange-100 text-orange-950 dark:border-orange-400/40 dark:bg-orange-400/15 dark:text-orange-100"
    }`}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-transparent" />
      {esY ? "Y · todos" : "O · uno"}
      {data.descripcion && <span className="block max-w-64 truncate text-[10px] font-normal normal-case" title={data.descripcion}>{data.descripcion}</span>}
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-transparent" />
    </div>
  );
}

function NodoTexto({ data }: NodeProps<Nodo>) {
  if (data.tipo !== "texto") return null;
  return (
    <div className="max-w-72 rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-700 dark:border-white/15 dark:bg-neutral-800 dark:text-slate-200">
      <Handle type="target" position={Position.Top} className="!border-0 !bg-transparent" />
      <p className="font-semibold">No se pudo interpretar automáticamente</p>
      <p className="mt-1 whitespace-pre-wrap">{data.texto}</p>
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-transparent" />
    </div>
  );
}

type PropsGrafo = {
  raiz: string;
  requisitos: Requisito;
  expansiones: Record<string, EstadoExpansion>;
  expandir: (ruta: string, codigo: string, ancestros: string[]) => void;
};

function Grafo({
  raiz,
  requisitos,
  expansiones,
  expandir,
}: PropsGrafo) {
  const { nodes, edges } = useMemo(() => {
    const nodos: Nodo[] = [];
    const aristas: Edge[] = [];
    let siguienteColumna = 0;
    let cantidadNodos = 0;

    const visitar = (
      requisito: Requisito,
      ruta: string,
      profundidad: number,
      ancestros: string[],
    ): { id: string; columna: number } => {
      cantidadNodos++;
      if (cantidadNodos > NODOS_MAXIMOS || profundidad > PROFUNDIDAD_MAXIMA) {
        const id = cantidadNodos > NODOS_MAXIMOS ? "limite:global" : `limite:${ruta}`;
        let nodoLimite = nodos.find((nodo) => nodo.id === id);
        if (!nodoLimite) {
          const columna = siguienteColumna++;
          nodos.push({
            id,
            type: "texto",
            position: { x: columna * 240, y: profundidad * 145 },
            data: { tipo: "texto", texto: "Límite de exploración alcanzado." },
          });
          nodoLimite = nodos[nodos.length - 1];
        }
        return { id, columna: nodoLimite.position.x / 240 };
      }

      if (requisito.tipo === "curso") {
        const id = `curso:${ruta}`;
        const estado = expansiones[ruta];
        const columna = siguienteColumna++;
        nodos.push({
          id,
          type: "curso",
          position: { x: columna * 240, y: profundidad * 145 },
          data: {
            tipo: "curso",
            codigo: requisito.codigo,
            descripcion: requisito.descripcion,
            ruta,
            ancestros,
            profundidad,
            estado,
            alExpandir: expandir,
          },
        });
        if (estado?.estado === "cargado" && estado.requisitos) {
          const hijo = visitar(estado.requisitos, `${ruta}/requisitos`, profundidad + 1, [...ancestros, requisito.codigo]);
          aristas.push({ id: `${id}->${hijo.id}`, source: id, target: hijo.id, type: "smoothstep" });
        }
        return { id, columna };
      }

      if (requisito.tipo === "sin-interpretar") {
        const id = `texto:${ruta}`;
        const columna = siguienteColumna++;
        nodos.push({
          id,
          type: "texto",
          position: { x: columna * 240, y: profundidad * 145 },
          data: { tipo: "texto", texto: [requisito.codigo, requisito.descripcion].filter(Boolean).join("\n\n") },
        });
        return { id, columna };
      }

      const id = `operador:${ruta}`;
      const hijos = requisito.hijos.map((hijo, indice) =>
        visitar(hijo, `${ruta}/${indice}`, profundidad + 1, ancestros),
      );
      const columna = hijos.reduce((suma, hijo) => suma + hijo.columna, 0) / hijos.length;
      nodos.push({
        id,
        type: "operador",
        position: { x: columna * 240, y: profundidad * 145 },
        data: { tipo: "operador", operador: requisito.tipo, descripcion: requisito.descripcion },
      });
      hijos.forEach((hijo, indice) => aristas.push({
        id: `${id}->${indice}:${hijo.id}`,
        source: id,
        target: hijo.id,
        type: "smoothstep",
      }));
      return { id, columna };
    };

    const resultado = visitar(requisitos, "raiz", 1, [raiz]);
    nodos.push({
      id: "curso-raiz",
      type: "curso",
      position: { x: resultado.columna * 240, y: 0 },
      data: {
        tipo: "curso",
        codigo: raiz,
        descripcion: "Curso consultado",
        ruta: "curso-raiz",
        ancestros: [],
        profundidad: 0,
        alExpandir: expandir,
      },
    });
    aristas.push({ id: `curso-raiz->${resultado.id}`, source: "curso-raiz", target: resultado.id, type: "smoothstep" });
    return { nodes: nodos, edges: aristas };
  }, [raiz, requisitos, expansiones, expandir]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={tiposNodo}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      maxZoom={1.5}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="var(--flow-grid, #cbd5e1)" gap={24} />
      <Controls />
    </ReactFlow>
  );
}

export default function GrafoPrerrequisitos(props: PropsGrafo) {
  return (
    <ReactFlowProvider>
      <Grafo {...props} />
    </ReactFlowProvider>
  );
}
