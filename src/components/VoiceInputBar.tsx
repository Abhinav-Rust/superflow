'use client';

import React, { useState } from 'react';
import { Mic, Zap, RefreshCw, FileText, Layers, Sparkles, Sun, Moon } from 'lucide-react';

interface VoiceInputBarProps {
  promptText: string;
  onPromptChange: (text: string) => void;
  onSupercompile: () => void;
  onReset: () => void;
  isResetting?: boolean;
  onOpenBlueprint: () => void;
  onSelectPreset: (presetId: string) => void;
  isSupercompiled: boolean;
  onToggleSupercompileView: () => void;
  isProcessing: boolean;
  currentPresetId: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function VoiceInputBar({
  promptText,
  onPromptChange,
  onSupercompile,
  onReset,
  isResetting = false,
  onOpenBlueprint,
  onSelectPreset,
  isSupercompiled,
  onToggleSupercompileView,
  isProcessing,
  currentPresetId,
  theme,
  onToggleTheme,
}: VoiceInputBarProps) {
  const isDark = theme === 'dark';
  const [isListening, setIsListening] = useState(false);

  // Toggle voice dictation (supports browser Web Speech API & Wispr Flow active visual state)
  const handleVoiceToggle = () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
          (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      if (isListening) {
        setIsListening(false);
      } else {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          setIsListening(true);

          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join('');
            if (transcript) {
              onPromptChange(transcript);
            }
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    } else {
      // Visual state for Wispr Flow dictation hotkey
      setIsListening((prev) => !prev);
      setTimeout(() => setIsListening(false), 4000);
    }
  };

  return (
    <header
      className={`w-full border-b backdrop-blur-xl z-20 shrink-0 select-none transition-colors duration-200 ${
        isDark
          ? 'bg-[#050505] border-neutral-800/80 text-neutral-100'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
      }`}
    >
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 space-y-2.5">
        {/* Brand & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-neutral-950 fill-current" />
              </div>
              <span className={`text-base font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                SuperFlow
              </span>
            </div>

            <div className={`hidden sm:block h-4 w-[1px] ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

            <div className={`hidden md:flex items-center gap-1.5 text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              <span className="font-semibold">Neuro-Symbolic Metasystem</span>
              <span>•</span>
              <span className="font-semibold">Turchin Supercompilation</span>
            </div>
          </div>

          {/* Wispr Flow Status Pill & Controls */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-inner ${
              isDark 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wide">
                Wispr Flow Voice: READY
              </span>
            </div>

            {/* Presets Segmented Control */}
            <div className={`flex items-center p-0.5 rounded-lg border text-xs font-mono ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-300'}`}>
              <button
                onClick={() => onSelectPreset('opspulse-incident-triage')}
                className={`px-3 py-1 rounded-md transition ${
                  currentPresetId === 'opspulse-incident-triage'
                    ? isDark
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                      : 'bg-white text-neutral-950 font-bold shadow-sm'
                    : isDark
                    ? 'text-neutral-400 hover:text-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                Cloud Triage (OpsPulse)
              </button>
              <button
                onClick={() => onSelectPreset('hft-order-flow')}
                className={`px-3 py-1 rounded-md transition ${
                  currentPresetId === 'hft-order-flow'
                    ? isDark
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                      : 'bg-white text-neutral-950 font-bold shadow-sm'
                    : isDark
                    ? 'text-neutral-400 hover:text-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                HFT Order-Flow
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                  : 'bg-neutral-100 border-neutral-300 hover:bg-neutral-200'
              }`}
              title={`Current Theme: ${isDark ? 'Dark (Obsidian)' : 'Light (Pure White)'}. Click to switch.`}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                  <span className="text-[11px] text-neutral-200">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span className="text-[11px] text-neutral-800 font-bold">Light</span>
                </>
              )}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/Abhinav-Rust/superflow"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded-lg border transition ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200'
              }`}
              title="View on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Input Bar & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Main Voice Prompt Input Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mic className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            </div>
            <input
              type="text"
              value={promptText}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Dictate your architecture via Wispr Flow (e.g. 'Build an event-driven payment engine with fraud checks, dead-letter retries, and invariant gates')..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans transition border shadow-inner ${
                isDark
                  ? 'bg-neutral-900/90 border-neutral-700/80 text-neutral-100'
                  : 'bg-white border-slate-300 text-slate-900 font-medium'
              }`}
            />
          </div>

          {/* Dedicated 'Hold Wispr & Speak' Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-200 border shrink-0 shadow-sm ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse ring-2 ring-rose-500/30'
                : isDark
                ? 'bg-neutral-900 hover:bg-neutral-800 border-emerald-500/40 text-emerald-400 hover:border-emerald-400 shadow-emerald-950/20'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900 hover:border-emerald-500'
            }`}
            title="Click to dictate or hold your Wispr Flow hotkey"
          >
            <Mic className={`w-4 h-4 ${isListening ? 'text-rose-500 animate-bounce' : isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span>{isListening ? 'Listening...' : 'Hold Wispr & Speak'}</span>
          </button>

          {/* Supercompile Action Button */}
          <button
            onClick={onSupercompile}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 ${
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
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-mono transition shrink-0 ${
              isSupercompiled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
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
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-mono transition shrink-0 ${
              isDark
                ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800 font-semibold'
            }`}
            title="Export Production Blueprint"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Blueprint</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isResetting}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-mono transition shrink-0 ${
              isDark
                ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800 hover:text-neutral-950 font-semibold'
            }`}
            title="Reset Topology, Layout & Prompt to Default"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isResetting ? 'Resetting...' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
