export type NodeType = 'service' | 'queue' | 'database' | 'gateway' | 'invariant';

export interface ArchitectureNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  description: string;
  refalTerm: string;
  isEliminatedBySupercompile?: boolean;
  isInlined?: boolean;
  invariants?: string[];
  metrics?: {
    latency?: string;
    throughput?: string;
    stateCount?: number;
  };
}

export interface ArchitectureEdgeData extends Record<string, unknown> {
  label?: string;
  protocol?: 'sync' | 'async' | 'grpc' | 'event';
  isSupercompiled?: boolean;
  whistleEvidence?: string;
}

export interface ArchitectureGraph {
  id: string;
  name: string;
  description: string;
  spokenPrompt: string;
  nodes: {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: ArchitectureNodeData;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    data?: ArchitectureEdgeData;
    style?: Record<string, string | number>;
  }[];
}

export interface MetasystemAnalysisResult {
  graphId: string;
  initialStepCount: number;
  supercompiledStepCount: number;
  improvementPercentage: number;
  eliminatedNodeCount: number;
  stronglyConnectedComponents: string[][];
  reachabilityVerified: boolean;
  cyclicDeadlocksDetected: boolean;
  turchinLoopEdges: string[];
  refalSourceCode: string;
  supercompiledResidual: string;
  proofLog: string[];
}
