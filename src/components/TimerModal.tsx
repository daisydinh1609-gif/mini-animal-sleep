import { useEffect, useRef } from 'react';
import type { TimerOption } from '../data/animals';

interface TimerModalProps {
  isOpen: boolean;
  currentTimer: TimerOption;
  timeRemaining: string | null;
  onSelect: (option: TimerOption) => void;
  onClose: () => void;
}

const TIMER_OPTIONS: { value: TimerOption; label: string; icon: string }[] = [
  { value: null, label: 'Off', icon: '∞' },
  { value: 15, label: '15 min', icon: '🌙' },
  { value: 30, label: '30 min', icon: '🌛' },
  { value: 60, label: '1 hour', icon: '⭐' },
];

export default function TimerModal({ isOpen, currentTimer, timeRemaining, onSelect, onClose }: TimerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl p-6 safe-bottom animate-slide-up"
        style={{
          background: 'linear-gradient(180deg, #110825 0%, #08031a 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
        }}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }} />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black" style={{ color: 'white' }}>Sleep Timer</h2>
          {timeRemaining && (
            <div
              className="px-3 py-1.5 rounded-full text-sm font-bold"
              style={{
                background: 'rgba(167,139,250,0.15)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#c4b5fd',
              }}
            >
              {timeRemaining} left
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TIMER_OPTIONS.map(({ value, label, icon }) => {
            const isSelected = currentTimer === value;
            return (
              <button
                key={String(value)}
                onClick={() => { onSelect(value); onClose(); }}
                className="relative flex flex-col items-center justify-center py-5 px-4 rounded-2xl transition-all duration-200 active:scale-95"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(196,181,253,0.15))'
                    : 'rgba(255,255,255,0.05)',
                  border: isSelected
                    ? '2px solid rgba(167,139,250,0.5)'
                    : '2px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? '0 0 20px rgba(167,139,250,0.15)' : 'none',
                }}
              >
                <span className="text-3xl mb-2">{icon}</span>
                <span
                  className="text-base font-black"
                  style={{ color: isSelected ? '#e9d5ff' : 'rgba(255,255,255,0.7)' }}
                >
                  {label}
                </span>
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(167,139,250,0.4)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs font-medium mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Audio fades out gently when timer ends
        </p>
      </div>
    </div>
  );
}
