'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ArchitectureNodeData } from '@/types/architecture';
import { Server, Database, Layers, ShieldCheck, Radio, Zap, Sparkles } from 'lucide-react';

interface CustomNodeProps {
  data: ArchitectureNodeData;
  isConnectable?: boolean;
}

const TYPE_CONFIG = {
  gateway: {
    icon: Radio,
    color: 'from-blue-600 to-indigo-700',
    border: 'border-blue-500/50',
    badge: 'INGESTION GATEWAY',
    glow: 'shadow-blue-500/20',
  },
  queue: {
    icon: Layers,
    color: 'from-amber-600 to-orange-700',
    border: 'border-amber-500/50',
    badge: 'TRANSIENT QUEUE',
    glow: 'shadow-amber-500/20',
  },
  service: {
    icon: Server,
    color: 'from-purple-600 to-violet-700',
    border: 'border-purple-500/50',
    badge: 'CORE SERVICE',
    glow: 'shadow-purple-500/20',
  },
  invariant: {
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-500/50',
    badge: 'TURCHIN INVARIANT GATE',
    glow: 'shadow-emerald-500/20',
  },
  database: {
    icon: Database,
    color: 'from-rose-600 to-pink-700',
    border: 'border-rose-500/50',
    badge: 'STATE LEDGER',
    glow: 'shadow-rose-500/20',
  },
};

export const CustomNode = memo(({ data }: CustomNodeProps) => {
  const config = TYPE_CONFIG[data.type] || TYPE_CONFIG.service;
  const Icon = config.icon;
  const isEliminated = data.isEliminatedBySupercompile;

  return (
    <div
      className={`relative min-w-[280px] max-w-[340px] rounded-2xl border backdrop-blur-xl p-4 shadow-xl transition-all duration-200 cursor-pointer group select-none ${
        isEliminated
          ? 'opacity-40 border-neutral-700 scale-95 grayscale'
          : `${config.border} ${config.glow} hover:scale-102 hover:shadow-2xl hover:border-neutral-300`
      } bg-neutral-900/95 dark:bg-neutral-900/95 text-neutral-100`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-neutral-900"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${config.color} text-white shadow-md`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-wider font-bold text-neutral-400 uppercase">
              {config.badge}
            </span>
            <h3 className="text-sm font-bold text-neutral-100 leading-tight group-hover:text-emerald-400 transition">
              {data.label}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-300 mb-3 leading-relaxed line-clamp-2">
        {data.description}
      </p>

      {/* Invariants and Refal Term */}
      <div className="space-y-1.5 pt-2.5 border-t border-neutral-800/80 font-mono text-[11px]">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-neutral-500">Refal Term:</span>
          <span className="text-emerald-400 truncate max-w-[170px] font-semibold" title={data.refalTerm}>
            {data.refalTerm}
          </span>
        </div>

        {data.metrics?.latency && (
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-neutral-500">Latency:</span>
            <span className="text-cyan-400 font-semibold">{data.metrics.latency}</span>
          </div>
        )}
      </div>

      {/* Click hint footer */}
      <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300 transition">
        <span>Click to inspect details</span>
        <Sparkles className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
      </div>

      {/* Supercompiled Pill Overlay */}
      {isEliminated && (
        <div className="absolute inset-x-0 -bottom-3 flex justify-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm backdrop-blur-sm">
            <Zap className="w-3 h-3 text-amber-400" />
            Inlined via Supercompilation
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-neutral-900"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
