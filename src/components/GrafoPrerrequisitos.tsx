"use client";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useMemo } from "react";
import type { Requisito } from "@/services/prerrequisitos";

import "@xyflow/react/dist/style.css";

const PROFUNDIDAD_MAXIMA = 5;
const NODOS_MAXIMOS = 80;

type DatosNodoCurso = {
  tipo: "curso";
  codigo: string;
  descripcion: string;
  raiz: boolean;
};
type DatosNodoOperador = { tipo: "operador"; operador: "y" | "o" };
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

  return (
    <div className={`min-w-48 max-w-60 rounded-xl border p-3 shadow-sm ${
      data.raiz
        ? "border-amber-500 bg-amber-50 dark:bg-amber-300/10"
        : "border-slate-200 bg-white dark:border-white/15 dark:bg-neutral-800"
    }`}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-transparent" />
    <div className="flex flex-wrap items-baseline gap-x-2">
      <p className="text-sm font-bold">{data.codigo}</p>
      {data.descripcion && <p className="text-xs text-slate-600 dark:text-slate-300">{data.descripcion}</p>}
    </div>
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
      {esY ? "Todos" : "Alguno"}
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

type PropsGrafo = { raiz: string; requisitos: Requisito };

function Grafo({ raiz, requisitos }: PropsGrafo) {
  const { fitView } = useReactFlow();
  const { nodes, edges } = useMemo(() => {
    const nodos: Nodo[] = [];
    const aristas: Edge[] = [];
    let siguienteColumna = 0;
    let cantidadNodos = 0;

    const visitar = (
      requisito: Requisito,
      ruta: string,
      profundidad: number,
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
        const columna = siguienteColumna++;
        nodos.push({
          id,
          type: "curso",
          position: { x: columna * 240, y: profundidad * 145 },
          data: {
            tipo: "curso",
            codigo: requisito.codigo,
            descripcion: requisito.descripcion,
            raiz: false,
          },
        });
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
        visitar(hijo, `${ruta}/${indice}`, profundidad + 1),
      );
      const columna = hijos.reduce((suma, hijo) => suma + hijo.columna, 0) / hijos.length;
      nodos.push({
        id,
        type: "operador",
        position: { x: columna * 240, y: profundidad * 145 },
        data: { tipo: "operador", operador: requisito.tipo },
      });
      hijos.forEach((hijo, indice) => aristas.push({
        id: `${id}->${indice}:${hijo.id}`,
        source: id,
        target: hijo.id,
        type: "smoothstep",
      }));
      return { id, columna };
    };

    const resultado = visitar(requisitos, "raiz", 1);
    nodos.push({
      id: "curso-raiz",
      type: "curso",
      position: { x: resultado.columna * 240, y: 0 },
      data: {
        tipo: "curso",
        codigo: raiz,
        descripcion: "Curso consultado",
        raiz: true,
      },
    });
    aristas.push({ id: `curso-raiz->${resultado.id}`, source: "curso-raiz", target: resultado.id, type: "smoothstep" });
    return { nodes: nodos, edges: aristas };
  }, [raiz, requisitos]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void fitView({ padding: 0.2 });
    });
    return () => cancelAnimationFrame(frame);
  }, [fitView, nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={tiposNodo}
      minZoom={0.2}
      maxZoom={1.5}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="var(--flow-grid, #cbd5e1)" gap={24} />
      <Controls className="graph-flow-controls" />
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
