'use client';

import React from 'react';
import { ArchitectureNodeData } from '@/types/architecture';
import { X, Server, Database, Layers, ShieldCheck, Radio, Zap, Clock, Activity, CheckCircle, Code } from 'lucide-react';

interface NodeDetailModalProps {
  nodeData: ArchitectureNodeData | null;
  onClose: () => void;
  isDark: boolean;
}

const TYPE_CONFIG = {
  gateway: {
    icon: Radio,
    color: 'from-blue-600 to-indigo-700',
    badge: 'Ingestion Gateway',
    accent: 'text-blue-400',
    bgBadge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  },
  queue: {
    icon: Layers,
    color: 'from-amber-600 to-orange-700',
    badge: 'Transient Queue',
    accent: 'text-amber-400',
    bgBadge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  },
  service: {
    icon: Server,
    color: 'from-purple-600 to-violet-700',
    badge: 'Core Service',
    accent: 'text-purple-400',
    bgBadge: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  },
  invariant: {
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-700',
    badge: 'Turchin Invariant Gate',
    accent: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
  database: {
    icon: Database,
    color: 'from-rose-600 to-pink-700',
    badge: 'State Ledger',
    accent: 'text-rose-400',
    bgBadge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  },
};

export function NodeDetailModal({ nodeData, onClose, isDark }: NodeDetailModalProps) {
  if (!nodeData) return null;

  const config = TYPE_CONFIG[nodeData.type] || TYPE_CONFIG.service;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900 shadow-neutral-400/20'
        }`}
      >
        {/* Header Banner */}
        <div className={`p-6 bg-gradient-to-r ${config.color} text-white flex items-start justify-between`}>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                {config.badge}
              </span>
              <h2 className="text-xl font-extrabold tracking-tight mt-0.5">{nodeData.label}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
              Role & Responsibility
            </h4>
            <p className="text-sm leading-relaxed text-neutral-300 font-sans">
              {nodeData.description}
            </p>
          </div>

          {/* Refal-5 Term Expression */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wide text-neutral-400">
                  Refal-5 Expression Space
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Formal Invariant
              </span>
            </div>
            <pre className="font-mono text-sm text-emerald-400 font-semibold overflow-x-auto p-2 rounded bg-black/40">
              {nodeData.refalTerm}
            </pre>
          </div>

          {/* Performance Envelopes */}
          {nodeData.metrics && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2.5">
                Runtime Performance Envelope
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {nodeData.metrics.latency && (
                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-[10px] font-mono uppercase text-neutral-500">Target Latency</div>
                      <div className="text-sm font-mono font-bold text-cyan-400">{nodeData.metrics.latency}</div>
                    </div>
                  </div>
                )}
                {nodeData.metrics.throughput && (
                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-[10px] font-mono uppercase text-neutral-500">Throughput Capacity</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">{nodeData.metrics.throughput}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guaranteed Invariants */}
          {nodeData.invariants && nodeData.invariants.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2.5">
                Formally Proven Invariants
              </h4>
              <div className="space-y-2">
                {nodeData.invariants.map((inv, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-sans leading-relaxed ${
                      isDark
                        ? 'bg-neutral-950/60 border-neutral-800/80 text-neutral-200'
                        : 'bg-emerald-50/50 border-emerald-200/60 text-neutral-800'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supercompilation Status */}
          {nodeData.isEliminatedBySupercompile && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Supercompiled & Inlined:</span> Turchin&apos;s driving algorithm proved this intermediate buffer can be evaluated at compile time, eliminating an asynchronous round-trip in the residual execution path.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
