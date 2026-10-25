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

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ArchitectureNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<ArchitectureEdgeData>>([]);

  const isDark = theme === 'dark';

  // Synchronize Theme class on root document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize graph
  const loadGraph = useCallback((graph: ArchitectureGraph, supercompiled: boolean, currentTheme: 'dark' | 'light') => {
    const { supercompiledGraph, analysis } = supercompileGraph(graph);
    setAnalysisResult(analysis);

    const targetGraph = supercompiled ? supercompiledGraph : graph;

    const formattedNodes: Node<ArchitectureNodeData>[] = targetGraph.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));

    // Ensure ALL edges have dynamic moving animated connection across the entire flow
    const formattedEdges: Edge<ArchitectureEdgeData>[] = targetGraph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: true, // Guarantees animated pulse on every single connection
      type: 'default',
      data: e.data,
      label: e.data?.label,
      labelStyle: {
        fill: currentTheme === 'dark' ? '#cbd5e1' : '#334155',
        fontSize: 10,
        fontFamily: 'monospace',
        fontWeight: 600,
      },
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [setNodes, setEdges]);

  // Initial load
  useEffect(() => {
    loadGraph(activeGraph, isSupercompiledView, theme);
  }, [theme]);

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    const selected = ARCHITECTURE_PRESETS.find((p) => p.id === presetId) || ARCHITECTURE_PRESETS[0];
    setCurrentPresetId(presetId);
    setActiveGraph(selected);
    setPromptInput(selected.spokenPrompt);
    setIsSupercompiledView(false);
    loadGraph(selected, false, theme);
  };

  // Run Supercompilation & Metasystem Transition
  const handleSupercompile = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const { supercompiledGraph, analysis } = supercompileGraph(activeGraph);
      setAnalysisResult(analysis);
      setIsSupercompiledView(true);
      loadGraph(activeGraph, true, theme);
      setIsProcessing(false);

      // Trigger Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }, 500);
  };

  // Toggle View
  const handleToggleView = () => {
    const nextView = !isSupercompiledView;
    setIsSupercompiledView(nextView);
    loadGraph(activeGraph, nextView, theme);
  };

  // Reset to original
  const handleReset = () => {
    setIsSupercompiledView(false);
    loadGraph(activeGraph, false, theme);
  };

  // Handle Node Click to Expand into Detail Modal
  const handleNodeClick = (_: React.MouseEvent, node: Node<ArchitectureNodeData>) => {
    setSelectedNodeData(node.data);
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'dark bg-neutral-950 text-neutral-100' : 'light bg-white text-neutral-900'
      }`}
    >
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
        currentPresetId={currentPresetId}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Graph Canvas Area */}
      <div
        className={`flex-1 relative w-full select-none transition-colors duration-200 ${
          isDark ? 'bg-neutral-950' : 'bg-white'
        }`}
        style={{ minHeight: '520px', height: 'calc(100vh - 165px)' }}
      >
        {/* Floating Header Tag */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div
            className={`border rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xl transition-colors ${
              isDark ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100' : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono tracking-tight">{activeGraph.name}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isSupercompiledView
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                }`}
              >
                {isSupercompiledView ? '⚡ SUPERCOMPILED RESIDUAL' : 'RAW SPOKEN TOPOLOGY'}
              </span>
            </div>
            <p className={`text-xs mt-0.5 max-w-lg truncate ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {activeGraph.description}
            </p>
          </div>
        </div>

        {/* React Flow Viewport */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          preventScrolling={true}
          panOnDrag={true}
          nodesDraggable={true}
          nodesConnectable={false}
          minZoom={0.5}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color={isDark ? '#262626' : '#e2e8f0'}
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
