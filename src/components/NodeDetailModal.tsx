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
  },
  queue: {
    icon: Layers,
    color: 'from-amber-600 to-orange-700',
    badge: 'Transient Queue',
  },
  service: {
    icon: Server,
    color: 'from-purple-600 to-violet-700',
    badge: 'Core Service',
  },
  invariant: {
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-700',
    badge: 'Turchin Invariant Gate',
  },
  database: {
    icon: Database,
    color: 'from-rose-600 to-pink-700',
    badge: 'State Ledger',
  },
};

export function NodeDetailModal({ nodeData, onClose, isDark }: NodeDetailModalProps) {
  if (!nodeData) return null;

  const config = TYPE_CONFIG[nodeData.type] || TYPE_CONFIG.service;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl rounded-2xl border-2 shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
            : 'bg-white border-slate-300 text-slate-950 shadow-slate-900/30'
        }`}
      >
        {/* Header Banner */}
        <div className={`p-6 bg-gradient-to-r ${config.color} text-white flex items-start justify-between shadow-sm`}>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                {config.badge}
              </span>
              <h2 className="text-xl font-extrabold tracking-tight mt-0.5">{nodeData.label}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className={`text-xs font-mono uppercase tracking-wider font-extrabold mb-1.5 ${isDark ? 'text-neutral-400' : 'text-slate-800'}`}>
              Role & Responsibility
            </h4>
            <p className={`text-sm leading-relaxed font-sans ${isDark ? 'text-neutral-200 font-normal' : 'text-slate-900 font-semibold'}`}>
              {nodeData.description}
            </p>
          </div>

          {/* Refal-5 Term Expression Space (High-contrast code terminal in both themes) */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wide text-slate-300">
                  Refal-5 Expression Space
                </span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Formal Invariant
              </span>
            </div>
            <pre className="font-mono text-sm text-emerald-400 font-bold overflow-x-auto p-3 rounded-lg bg-black/70 border border-emerald-950/60 leading-relaxed">
              {nodeData.refalTerm}
            </pre>
          </div>

          {/* Performance Envelopes */}
          {nodeData.metrics && (
            <div>
              <h4 className={`text-xs font-mono uppercase tracking-wider font-extrabold mb-2.5 ${isDark ? 'text-neutral-400' : 'text-slate-800'}`}>
                Runtime Performance Envelope
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {nodeData.metrics.latency && (
                  <div className={`p-4 rounded-xl border-2 flex items-center gap-3.5 ${
                    isDark 
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-100' 
                      : 'bg-blue-50/90 border-blue-200 text-slate-950 shadow-sm'
                  }`}>
                    <Clock className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-700'}`} />
                    <div>
                      <div className={`text-[10px] font-mono uppercase font-bold ${isDark ? 'text-neutral-400' : 'text-blue-900'}`}>Target Latency</div>
                      <div className={`text-sm font-mono font-extrabold ${isDark ? 'text-cyan-400' : 'text-blue-900'}`}>{nodeData.metrics.latency}</div>
                    </div>
                  </div>
                )}
                {nodeData.metrics.throughput && (
                  <div className={`p-4 rounded-xl border-2 flex items-center gap-3.5 ${
                    isDark 
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-100' 
                      : 'bg-emerald-50/90 border-emerald-200 text-slate-950 shadow-sm'
                  }`}>
                    <Activity className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                    <div>
                      <div className={`text-[10px] font-mono uppercase font-bold ${isDark ? 'text-neutral-400' : 'text-emerald-900'}`}>Throughput Capacity</div>
                      <div className={`text-sm font-mono font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>{nodeData.metrics.throughput}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guaranteed Invariants */}
          {nodeData.invariants && nodeData.invariants.length > 0 && (
            <div>
              <h4 className={`text-xs font-mono uppercase tracking-wider font-extrabold mb-2.5 ${isDark ? 'text-neutral-400' : 'text-slate-800'}`}>
                Formally Proven Invariants
              </h4>
              <div className="space-y-2">
                {nodeData.invariants.map((inv, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-xs font-sans leading-relaxed ${
                      isDark
                        ? 'bg-neutral-950/60 border-neutral-800/80 text-neutral-200'
                        : 'bg-slate-50 border-slate-200 text-slate-900 font-semibold shadow-sm'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={isDark ? 'text-neutral-200' : 'text-slate-900'}>{inv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supercompilation Status */}
          {nodeData.isEliminatedBySupercompile && (
            <div className={`p-4 rounded-xl border-2 text-xs flex items-center gap-3 ${
              isDark 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : 'bg-amber-50 border-amber-300 text-amber-950 font-semibold shadow-sm'
            }`}>
              <Zap className={`w-5 h-5 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <div>
                <span className="font-extrabold">Supercompiled & Inlined:</span> Turchin&apos;s driving algorithm proved this intermediate buffer can be evaluated at compile time, eliminating an asynchronous round-trip in the residual execution path.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition shadow-md ${
              isDark 
                ? 'bg-neutral-800 hover:bg-neutral-700 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
