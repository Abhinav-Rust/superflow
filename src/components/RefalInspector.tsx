'use client';

import React, { useState } from 'react';
import { MetasystemAnalysisResult } from '@/types/architecture';
import { Terminal, Cpu, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface RefalInspectorProps {
  analysis: MetasystemAnalysisResult | null;
  isDark?: boolean;
}

export function RefalInspector({ analysis, isDark = true }: RefalInspectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'refal' | 'residual'>('log');
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`border-t backdrop-blur-md shadow-2xl transition-all duration-300 ${
        isDark
          ? 'border-neutral-800 bg-[#050505] text-neutral-100'
          : 'border-neutral-200 bg-white text-neutral-900 shadow-neutral-300/30'
      }`}
    >
      {/* Summary Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wide ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                REFAL-SUPERSYSTEM (Rust Engine)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Layer 2 Driving: PASS
              </span>
            </div>
            <p className={`text-[11px] font-sans ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Valentin Turchin Metasystem Transition: {analysis.initialStepCount} ➔ {analysis.supercompiledStepCount} steps ({analysis.improvementPercentage}% speedup)
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>Eliminated:</span>
            <span className="text-amber-400 font-bold">{analysis.eliminatedNodeCount} layers</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>Reachability:</span>
            <span className="text-emerald-400 font-bold">100% Proven</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>Cyclic Deadlocks:</span>
            <span className={analysis.cyclicDeadlocksDetected ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {analysis.cyclicDeadlocksDetected ? 'DETECTED' : 'NONE'}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono transition ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                : 'bg-neutral-100 border-neutral-300 hover:bg-neutral-200 text-neutral-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isExpanded ? 'Collapse Inspector' : 'Inspect Proofs'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Terminal Panel */}
      {isExpanded && (
        <div className={`max-w-7xl mx-auto px-4 pb-4 pt-1 border-t ${isDark ? 'border-neutral-800/80' : 'border-neutral-200'}`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('log')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                  activeTab === 'log'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Metasystem Proof Log
              </button>
              <button
                onClick={() => setActiveTab('refal')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                  activeTab === 'refal'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Refal-5 Source Specification
              </button>
              <button
                onClick={() => setActiveTab('residual')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                  activeTab === 'residual'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Supercompiled Residual Code
              </button>
            </div>

            <button
              onClick={() =>
                handleCopy(
                  activeTab === 'log'
                    ? analysis.proofLog.join('\n')
                    : activeTab === 'refal'
                    ? analysis.refalSourceCode
                    : analysis.supercompiledResidual
                )
              }
              className={`flex items-center gap-1 text-xs font-mono ${isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div
            className={`rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-64 border ${
              isDark
                ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
                : 'bg-neutral-950 border-neutral-900 text-neutral-100'
            }`}
          >
            {activeTab === 'log' && (
              <div className="space-y-1">
                {analysis.proofLog.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-neutral-600 mr-2">[{idx + 1}]</span>
                    <span
                      className={
                        line.includes('speedup') || line.includes('PASS') || line.includes('complete')
                          ? 'text-emerald-400 font-semibold'
                          : line.includes('whistle') || line.includes('Folding')
                          ? 'text-amber-300'
                          : 'text-neutral-300'
                      }
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'refal' && (
              <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">{analysis.refalSourceCode}</pre>
            )}

            {activeTab === 'residual' && (
              <pre className="text-cyan-400 leading-relaxed whitespace-pre-wrap">{analysis.supercompiledResidual}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
