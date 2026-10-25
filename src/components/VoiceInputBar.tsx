'use client';

import React from 'react';
import { Mic, Zap, RefreshCw, FileText, Layers, Sparkles } from 'lucide-react';

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
  currentPresetId: string;
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
  currentPresetId,
}: VoiceInputBarProps) {
  return (
    <header className="w-full bg-neutral-950/90 border-b border-neutral-800/80 backdrop-blur-xl z-20 shrink-0 select-none">
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 space-y-2.5">
        {/* Brand & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-neutral-950 fill-current" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white font-mono">
                SuperFlow
              </span>
            </div>

            <div className="hidden sm:block h-4 w-[1px] bg-neutral-800" />

            <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
              <span>Neuro-Symbolic Metasystem</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-500">Turchin Supercompilation</span>
            </div>
          </div>

          {/* Wispr Flow Status Pill & Presets */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wide">
                Wispr Flow Voice: READY
              </span>
            </div>

            {/* Presets Segmented Control */}
            <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <button
                onClick={() => onSelectPreset('opspulse-incident-triage')}
                className={`px-3 py-1 rounded-md transition ${
                  currentPresetId === 'opspulse-incident-triage'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Cloud Triage (OpsPulse)
              </button>
              <button
                onClick={() => onSelectPreset('hft-order-flow')}
                className={`px-3 py-1 rounded-md transition ${
                  currentPresetId === 'hft-order-flow'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                HFT Order-Flow
              </button>
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/Abhinav-Rust/superflow"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="View on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Input Bar & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mic className="w-4 h-4 text-emerald-400/80" />
            </div>
            <input
              type="text"
              value={promptText}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Dictate your architecture via Wispr Flow (e.g. 'Build an event-driven payment engine with fraud checks, dead-letter retries, and invariant gates')..."
              className="w-full pl-10 pr-28 py-2.5 bg-neutral-900/90 border border-neutral-700/80 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500 shadow-inner font-sans transition"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[11px] font-mono text-neutral-500">
              Hold Wispr Key & Speak
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Supercompile Action Button */}
            <button
              onClick={onSupercompile}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                isSupercompiled
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-extrabold shadow-lg shadow-emerald-500/20'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isProcessing ? 'Driving...' : 'Supercompile & Verify'}</span>
            </button>

            {/* Toggle Graph Mode */}
            <button
              onClick={onToggleSupercompileView}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-mono transition ${
                isSupercompiled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
              title="Toggle between raw spoken graph and supercompiled minimal graph"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">
                {isSupercompiled ? 'Residual View' : 'Spoken View'}
              </span>
            </button>

            {/* Blueprint Export */}
            <button
              onClick={onOpenBlueprint}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-mono transition"
              title="Export Production Blueprint"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Blueprint</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition"
              title="Reset Topology"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
