'use client';

import React, { useState } from 'react';
import { Mic, Zap, RefreshCw, FileText, Sparkles, Layers } from 'lucide-react';

interface VoiceInputBarProps {
  promptText: string;
  onPromptChange: (text: string) => void;
  onSupercompile: () => void;
  onReset: () => void;
  onOpenBlueprint: () => void;
  onSelectPreset: (presetId: string) => void;
  isSupercompiled: boolean;
  onToggleSupercompileView: () => void;
  isProcessing: boolean;
}

export function VoiceInputBar({
  promptText,
  onPromptChange,
  onSupercompile,
  onReset,
  onOpenBlueprint,
  onSelectPreset,
  isSupercompiled,
  onToggleSupercompileView,
  isProcessing,
}: VoiceInputBarProps) {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="w-full bg-neutral-900/95 border-b border-neutral-800 p-4 backdrop-blur-md sticky top-0 z-20 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-emerald-400">
                Wispr Flow Receptacle: READY
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <span>Hold Wispr Hotkey & Speak</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px]">
                Ctrl / Push-to-Talk
              </kbd>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono hidden md:inline">Presets:</span>
            <button
              onClick={() => onSelectPreset('opspulse-incident-triage')}
              className="text-xs px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 transition"
            >
              Cloud Incident Triage (OpsPulse)
            </button>
            <button
              onClick={() => onSelectPreset('hft-order-flow')}
              className="text-xs px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 transition"
            >
              HFT Order-Flow Machine
            </button>
          </div>
        </div>

        {/* Input Bar & Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mic className={`w-4 h-4 ${isListening ? 'text-rose-500 animate-pulse' : 'text-neutral-500'}`} />
            </div>
            <textarea
              rows={2}
              value={promptText}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Dictate your system architecture using Wispr Flow (e.g. 'Build an event-driven payment ledger with fraud checks, dead-letter retries, and invariant gates')..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Supercompile Action Button */}
            <button
              onClick={onSupercompile}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all ${
                isSupercompiled
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 shadow-emerald-500/30'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isProcessing ? 'Driving Tree...' : 'Supercompile & Verify'}</span>
            </button>

            {/* Toggle Graph Mode */}
            <button
              onClick={onToggleSupercompileView}
              className={`flex items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-mono transition ${
                isSupercompiled
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
              }`}
              title="Toggle between raw spoken graph and supercompiled residual"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSupercompiled ? 'View: Supercompiled' : 'View: Raw Spoken'}
              </span>
            </button>

            {/* Blueprint Export */}
            <button
              onClick={onOpenBlueprint}
              className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-mono transition"
              title="Export Production Blueprint"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Blueprint</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 hover:text-neutral-200 transition"
              title="Reset Graph"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
