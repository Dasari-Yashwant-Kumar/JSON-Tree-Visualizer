import { useEffect, useRef, useState } from "react";
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import * as htmlToImage from "html-to-image";

export default function TreeVisualizer(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvas key={props.highlightNodeId || 'flow'} {...props} />
    </ReactFlowProvider>
  );
}

function FlowCanvas({ nodes, edges, highlightNodeId }) {
  const [n, setNodes, onNodesChange] = useNodesState(nodes);
  const [e, setEdges, onEdgesChange] = useEdgesState(edges);
  const rf = useReactFlow();
  const wrapperRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    setNodes(nodes.map(node => ({ ...node, style: { ...node.style, border: undefined, boxShadow: undefined }})));
  }, [nodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  useEffect(() => {
    if (!highlightNodeId) return;
    setNodes(prev => prev.map(node => node.id === highlightNodeId ? {
      ...node,
      style: {
        ...node.style,
        border: "3px solid #3b82f6",
        boxShadow: "0 0 15px rgba(59,130,246,0.6)",
      },
    } : { ...node, style: { ...node.style, border: undefined, boxShadow: undefined }}));
    try {
      const node = rf.getNode(highlightNodeId);
      if (node) {
        const centerX = node.position.x + (node.width || 0) / 2;
        const centerY = node.position.y + (node.height || 0) / 2;
        rf.setCenter(centerX, centerY, { zoom: 1.1, duration: 300 });
      } else {
        rf.fitView({ nodes: [{ id: highlightNodeId }], duration: 300, padding: 0.2 });
      }
    } catch {}
  }, [highlightNodeId, setNodes, rf]);

  const handleNodeClick = (_, node) => {
    if (node?.data?.path) {
      navigator.clipboard?.writeText(node.data.path).catch(() => {});
    }
  };

  const handleNodeMouseEnter = (event, node) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    setTooltip({
      x: event.clientX - (rect?.left || 0) + 8,
      y: event.clientY - (rect?.top || 0) + 8,
      text: `${node.data.path} — ${node.data.valuePreview ?? ''}`,
    });
  };
  const handleNodeMouseMove = (event) => {
    if (!tooltip) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    setTooltip((t) => ({ ...t, x: event.clientX - (rect?.left || 0) + 8, y: event.clientY - (rect?.top || 0) + 8 }));
  };
  const handleNodeMouseLeave = () => setTooltip(null);

  const downloadPng = async () => {
    const el = wrapperRef.current?.querySelector(".react-flow__renderer") || wrapperRef.current;
    if (!el) return;
    try {
      const dataUrl = await htmlToImage.toPng(el, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = "json-tree.png";
      link.href = dataUrl;
      link.click();
    } catch {}
  };

  const safeNodes = (Array.isArray(n) ? n : []).filter(
    node => node && typeof node.position?.x === 'number' && typeof node.position?.y === 'number'
  );

  return (
    <div ref={wrapperRef} className="h-[85vh] bg-white dark:bg-neutral-800 shadow-lg border border-gray-200 dark:border-neutral-700 rounded-xl p-4 text-base relative">
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <button onClick={downloadPng} className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-neutral-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-neutral-600">Download PNG</button>
      </div>
      <ReactFlow
        nodes={safeNodes}
        edges={e}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseMove={handleNodeMouseMove}
        onNodeMouseLeave={handleNodeMouseLeave}
        minZoom={0.4}
        maxZoom={2}
        fitView
        style={{ borderRadius: "12px" }}
      >
        {safeNodes.length > 0 && <Background color="#cbd5e1" gap={24} />}
        <Controls />
      </ReactFlow>
      {tooltip && (
        <div style={{ left: tooltip.x, top: tooltip.y }} className="pointer-events-none absolute z-20 px-2 py-1 text-xs rounded bg-black/80 text-white shadow">
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
