import React, { useEffect, useRef } from 'react';
import { LogEntry, LogLevel } from '../types';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  onClear: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO: return 'text-blue-400';
      case LogLevel.SUCCESS: return 'text-emerald-400';
      case LogLevel.WARNING: return 'text-yellow-400';
      case LogLevel.ERROR: return 'text-red-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-400">
          <TerminalIcon size={16} />
          <span className="text-xs font-mono font-medium uppercase tracking-wider">System Output</span>
        </div>
        <button 
          onClick={onClear}
          className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-red-400 transition-colors"
          title="Clear Logs"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm terminal-scroll bg-black/50 backdrop-blur-sm">
        {logs.length === 0 && (
          <div className="text-gray-600 italic text-center mt-10">
            System ready. Waiting for process to start...
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="mb-1 break-words leading-snug">
            <span className="text-gray-600 select-none mr-3 text-xs">
              [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
            </span>
            <span className={`font-bold mr-2 ${getLevelColor(log.level)}`}>
              {log.level}:
            </span>
            <span className="text-gray-300">
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;