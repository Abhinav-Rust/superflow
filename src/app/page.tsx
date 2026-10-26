'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react';
import confetti from 'canvas-confetti';
import { ARCHITECTURE_PRESETS } from '@/lib/presets';
import { supercompileGraph } from '@/lib/refalBridge';
import { ArchitectureGraph, MetasystemAnalysisResult, ArchitectureNodeData, ArchitectureEdgeData } from '@/types/architecture';
import { CustomNode } from '@/components/CustomNode';
import { VoiceInputBar } from '@/components/VoiceInputBar';
import { RefalInspector } from '@/components/RefalInspector';
import { BlueprintModal } from '@/components/BlueprintModal';
import { NodeDetailModal } from '@/components/NodeDetailModal';
import { RefreshCw } from 'lucide-react';

const nodeTypes = {
  gateway: CustomNode,
  queue: CustomNode,
  service: CustomNode,
  invariant: CustomNode,
  database: CustomNode,
};

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentPresetId, setCurrentPresetId] = useState<string>('opspulse-incident-triage');
  const [activeGraph, setActiveGraph] = useState<ArchitectureGraph>(ARCHITECTURE_PRESETS[0]);
  const [isSupercompiledView, setIsSupercompiledView] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MetasystemAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>(ARCHITECTURE_PRESETS[0].spokenPrompt);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [selectedNodeData, setSelectedNodeData] = useState<ArchitectureNodeData | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showResetToast, setShowResetToast] = useState<boolean>(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ArchitectureNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<ArchitectureEdgeData>>([]);

  const isDark = theme === 'dark';

  // Load saved theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('superflow-theme') as 'dark' | 'light' | null;
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
  }, []);

  // Synchronize Theme class on root document and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      body.style.backgroundColor = '#050505';
      body.style.color = '#f3f4f6';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#0a0a0a';
    }
  }, [theme]);

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('superflow-theme', next);
      return next;
    });
  };

  // Initialize graph
  const loadGraph = useCallback((graph: ArchitectureGraph, supercompiled: boolean) => {
    const { supercompiledGraph, analysis } = supercompileGraph(graph);
    setAnalysisResult(analysis);

    const targetGraph = supercompiled ? supercompiledGraph : graph;

    const formattedNodes: Node<ArchitectureNodeData>[] = targetGraph.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));

    // Ensure ALL edges have dynamic animated moving connection pulses across the entire flow
    const formattedEdges: Edge<ArchitectureEdgeData>[] = targetGraph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'default',
      animated: true,
      data: e.data,
      label: e.data?.label,
      labelStyle: {
        fill: isDark ? '#34d399' : '#047857',
        fontSize: 10,
        fontFamily: 'monospace',
        fontWeight: 700,
      },
      labelBgStyle: {
        fill: isDark ? '#141414' : '#f8fafc',
        fillOpacity: 0.95,
      },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 8,
      style: {
        stroke: isDark ? '#10b981' : '#059669',
        strokeWidth: 2.5,
      },
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [setNodes, setEdges, isDark]);

  // Initial load and reload when graph changes
  useEffect(() => {
    loadGraph(activeGraph, isSupercompiledView);
  }, [activeGraph, isSupercompiledView, loadGraph]);

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    const selected = ARCHITECTURE_PRESETS.find((p) => p.id === presetId) || ARCHITECTURE_PRESETS[0];
    setCurrentPresetId(presetId);
    setActiveGraph(selected);
    setPromptInput(selected.spokenPrompt);
    setIsSupercompiledView(false);
    loadGraph(selected, false);
  };

  // Run Supercompilation & Metasystem Transition
  const handleSupercompile = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const { supercompiledGraph, analysis } = supercompileGraph(activeGraph);
      setAnalysisResult(analysis);
      setIsSupercompiledView(true);
      loadGraph(activeGraph, true);
      setIsProcessing(false);

      // Trigger Celebration
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }, 450);
  };

  // Toggle View
  const handleToggleView = () => {
    const nextView = !isSupercompiledView;
    setIsSupercompiledView(nextView);
    loadGraph(activeGraph, nextView);
  };

  // Reset to original layout with physical motion, camera transition, and prompt restore
  const handleReset = () => {
    setIsResetting(true);
    setShowResetToast(true);
    setIsSupercompiledView(false);
    setSelectedNodeData(null);

    const originalPreset = ARCHITECTURE_PRESETS.find((p) => p.id === currentPresetId) || ARCHITECTURE_PRESETS[0];
    setActiveGraph(originalPreset);
    setPromptInput(originalPreset.spokenPrompt);

    const { analysis } = supercompileGraph(originalPreset);
    setAnalysisResult(analysis);

    // Deep fresh clone of nodes to force React Flow to physically mount & spring-animate
    const idMap: Record<string, string> = {};
    const timestamp = Date.now();

    const formattedNodes: Node<ArchitectureNodeData>[] = originalPreset.nodes.map((n) => {
      const newId = `${n.id}-${timestamp}`;
      idMap[n.id] = newId;
      return {
        id: newId,
        type: n.type,
        position: { x: n.position.x, y: n.position.y },
        data: { ...n.data },
        className: 'node-reset-motion',
      };
    });

    const formattedEdges: Edge<ArchitectureEdgeData>[] = originalPreset.edges.map((e) => ({
      id: `${e.id}-${timestamp}`,
      source: idMap[e.source] || e.source,
      target: idMap[e.target] || e.target,
      type: 'default',
      animated: true,
      data: e.data,
      label: e.data?.label,
      labelStyle: {
        fill: isDark ? '#34d399' : '#047857',
        fontSize: 10,
        fontFamily: 'monospace',
        fontWeight: 700,
      },
      labelBgStyle: {
        fill: isDark ? '#141414' : '#f8fafc',
        fillOpacity: 0.95,
      },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 8,
      style: {
        stroke: isDark ? '#10b981' : '#059669',
        strokeWidth: 2.5,
      },
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);

    // Animate viewport camera: pull back slightly then glide smoothly into centered view
    if (reactFlowInstance) {
      try {
        const vp = reactFlowInstance.getViewport();
        reactFlowInstance.setViewport(
          {
            x: vp.x,
            y: vp.y,
            zoom: Math.max(0.35, vp.zoom * 0.9),
          },
          { duration: 200 }
        );

        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.16, duration: 650 });
        }, 220);
      } catch {
        reactFlowInstance.fitView({ padding: 0.16, duration: 600 });
      }
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 700);

    setTimeout(() => {
      setShowResetToast(false);
    }, 2400);
  };

  // Handle Node Click to Expand into Detail Modal
  const handleNodeClick = (_: React.MouseEvent, node: Node<ArchitectureNodeData>) => {
    setSelectedNodeData(node.data);
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'dark bg-[#050505] text-neutral-100' : 'light bg-white text-neutral-900'
      }`}
      style={{ backgroundColor: isDark ? '#050505' : '#ffffff' }}
    >
      {/* Voice Dictation Bar */}
      <VoiceInputBar
        promptText={promptInput}
        onPromptChange={setPromptInput}
        onSupercompile={handleSupercompile}
        onReset={handleReset}
        isResetting={isResetting}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        onSelectPreset={handleSelectPreset}
        isSupercompiled={isSupercompiledView}
        onToggleSupercompileView={handleToggleView}
        isProcessing={isProcessing}
        currentPresetId={currentPresetId}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Graph Canvas Area */}
      <div
        className={`flex-1 relative w-full select-none transition-colors duration-200 ${
          isDark ? 'bg-[#050505]' : 'bg-white'
        }`}
        style={{
          minHeight: '520px',
          height: 'calc(100vh - 165px)',
          backgroundColor: isDark ? '#050505' : '#ffffff',
        }}
      >
        {/* Floating Header Tag */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div
            className={`border rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xl transition-colors ${
              isDark
                ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100'
                : 'bg-white/95 border-slate-300 text-slate-950 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono tracking-tight">{activeGraph.name}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isSupercompiledView
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}
              >
                {isSupercompiledView ? '⚡ SUPERCOMPILED RESIDUAL' : 'RAW SPOKEN TOPOLOGY'}
              </span>
            </div>
            <p className={`text-xs mt-0.5 max-w-lg truncate ${isDark ? 'text-neutral-400' : 'text-slate-700 font-medium'}`}>
              {activeGraph.description}
            </p>
          </div>
        </div>

        {/* Reset Motion Toast Notification */}
        {showResetToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none reset-toast-enter">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border shadow-2xl backdrop-blur-md bg-emerald-500 text-neutral-950 border-emerald-400 font-mono text-xs font-black tracking-wide">
              <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
              <span>Topology Restored &amp; Re-aligned</span>
            </div>
          </div>
        )}

        {/* React Flow Viewport */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          colorMode={theme}
          fitView
          fitViewOptions={{ padding: 0.16 }}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          preventScrolling={true}
          panOnDrag={true}
          nodesDraggable={true}
          nodesConnectable={false}
          minZoom={0.25}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          style={{ backgroundColor: isDark ? '#050505' : '#ffffff' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color={isDark ? '#262626' : '#cbd5e1'}
          />
          <Controls position="top-right" showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Refal Metasystem Inspector Drawer */}
      <RefalInspector analysis={analysisResult} isDark={isDark} />

      {/* Node Detail Expansion Modal */}
      {selectedNodeData && (
        <NodeDetailModal
          nodeData={selectedNodeData}
          onClose={() => setSelectedNodeData(null)}
          isDark={isDark}
        />
      )}

      {/* Production Blueprint Modal */}
      {isBlueprintOpen && (
        <BlueprintModal
          graph={activeGraph}
          analysis={analysisResult}
          onClose={() => setIsBlueprintOpen(false)}
        />
      )}
    </div>
  );
}
