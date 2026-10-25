'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
import { Sparkles, Terminal } from 'lucide-react';

const nodeTypes = {
  gateway: CustomNode,
  queue: CustomNode,
  service: CustomNode,
  invariant: CustomNode,
  database: CustomNode,
};

export default function Home() {
  const [currentPresetId, setCurrentPresetId] = useState<string>('opspulse-incident-triage');
  const [activeGraph, setActiveGraph] = useState<ArchitectureGraph>(ARCHITECTURE_PRESETS[0]);
  const [isSupercompiledView, setIsSupercompiledView] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MetasystemAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>(ARCHITECTURE_PRESETS[0].spokenPrompt);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ArchitectureNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<ArchitectureEdgeData>>([]);

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

    const formattedEdges: Edge<ArchitectureEdgeData>[] = targetGraph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: e.animated ?? true,
      style: e.style || { stroke: '#6366f1', strokeWidth: 2 },
      data: e.data,
      label: e.data?.label,
      labelStyle: { fill: '#cbd5e1', fontSize: 10, fontFamily: 'monospace' },
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [setNodes, setEdges]);

  // Initial load
  useEffect(() => {
    loadGraph(activeGraph, isSupercompiledView);
  }, []);

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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }, 600);
  };

  // Toggle View
  const handleToggleView = () => {
    const nextView = !isSupercompiledView;
    setIsSupercompiledView(nextView);
    loadGraph(activeGraph, nextView);
  };

  // Reset to original
  const handleReset = () => {
    setIsSupercompiledView(false);
    loadGraph(activeGraph, false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Voice Dictation Bar */}
      <VoiceInputBar
        promptText={promptInput}
        onPromptChange={setPromptInput}
        onSupercompile={handleSupercompile}
        onReset={handleReset}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        onSelectPreset={handleSelectPreset}
        isSupercompiled={isSupercompiledView}
        onToggleSupercompileView={handleToggleView}
        isProcessing={isProcessing}
      />

      {/* Main Graph Canvas Area */}
      <div className="flex-1 relative w-full" style={{ minHeight: '520px', height: 'calc(100vh - 200px)' }}>
        {/* Floating Header Tag */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-100">{activeGraph.name}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isSupercompiledView
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
              >
                {isSupercompiledView ? '⚡ SUPERCOMPILED RESIDUAL' : 'RAW SPOKEN TOPOLOGY'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 max-w-lg truncate">{activeGraph.description}</p>
          </div>
        </div>

        {/* React Flow Viewport */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.8}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#262626" />
          <Controls position="top-right" />
          <MiniMap
            nodeColor={(n) => {
              if (n.data?.isEliminatedBySupercompile) return '#737373';
              if (n.type === 'gateway') return '#3b82f6';
              if (n.type === 'queue') return '#f59e0b';
              if (n.type === 'service') return '#8b5cf6';
              if (n.type === 'invariant') return '#10b981';
              if (n.type === 'database') return '#f43f5e';
              return '#525252';
            }}
            position="bottom-right"
          />
        </ReactFlow>
      </div>

      {/* Refal Metasystem Inspector Drawer */}
      <RefalInspector analysis={analysisResult} />

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
