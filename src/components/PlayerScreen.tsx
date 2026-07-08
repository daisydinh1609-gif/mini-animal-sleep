import { useState, useCallback } from 'react';
import {
  ArrowLeft, Volume2, VolumeX, Timer, Shuffle, Play, Pause,
} from 'lucide-react';
import type { Animal, SoundType, TimerOption } from '../data/animals';
import { SOUND_OPTIONS } from '../data/animals';

interface PlayerScreenProps {
  animal: Animal;
  activeSounds: SoundType[];
  isPlaying: boolean;
  volume: number;
  isMixMode: boolean;
  timerOption: TimerOption;
  timeRemaining: string | null;
  onBack: () => void;
  onToggleSound: (type: SoundType) => void;
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMix: () => void;
  onOpenTimer: () => void;
}

export default function PlayerScreen({
  animal,
  activeSounds,
  isPlaying,
  volume,
  isMixMode,
  timerOption,
  timeRemaining,
  onBack,
  onToggleSound,
  onTogglePlay,
  onVolumeChange,
  onToggleMix,
  onOpenTimer,
}: PlayerScreenProps) {
  const [emojiKey, setEmojiKey] = useState(0);

  const handleSoundPress = useCallback((type: SoundType) => {
    setEmojiKey(k => k + 1);
    onToggleSound(type);
  }, [onToggleSound]);

  const isMuted = volume === 0;
  const timerLabel = timerOption ? `${timerOption}m` : 'Off';

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${animal.colors.glow.replace('0.4', '0.14')} 0%, #04020c 50%, #020208 100%)`,
      }}
    >
      {/* Fullscreen video background */}
      {animal.videoUrl && isPlaying && (
        <video
          key={animal.videoUrl}
          src={animal.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.45 }}
        />
      )}

      {/* Top bar */}
      <div className="safe-top px-4 pt-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-icon w-11 h-11 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.9)' }} />
        </button>

        <div className="text-center">
          <h2 className="text-lg font-black" style={{ color: animal.colors.text }}>{animal.name}</h2>
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {animal.tagline}
          </p>
        </div>

        {/* Timer badge */}
        <button
          onClick={onOpenTimer}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-90"
          style={{
            background: timerOption
              ? `${animal.colors.primary}25`
              : 'rgba(255,255,255,0.08)',
            border: `1px solid ${timerOption ? animal.colors.primary + '40' : 'rgba(255,255,255,0.1)'}`,
          }}
          aria-label="Sleep timer"
        >
          <Timer size={14} style={{ color: timerOption ? animal.colors.text : 'rgba(255,255,255,0.5)' }} />
          <span
            className="text-xs font-bold"
            style={{ color: timerOption ? animal.colors.text : 'rgba(255,255,255,0.5)' }}
          >
            {timeRemaining ?? timerLabel}
          </span>
        </button>
      </div>

      {/* Sound type selector */}
      <div className="px-5 mt-4 flex gap-2">
        {SOUND_OPTIONS.map((opt) => {
          const isActive = activeSounds.includes(opt.type);
          return (
            <button
              key={opt.type}
              onClick={() => handleSoundPress(opt.type)}
              className="flex-1 flex flex-col items-center py-3 px-1 rounded-2xl transition-all duration-200 active:scale-95"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${animal.colors.primary}30, ${animal.colors.secondary}18)`
                  : 'rgba(255,255,255,0.05)',
                border: isActive
                  ? `1.5px solid ${animal.colors.primary}55`
                  : '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? `0 0 16px ${animal.colors.glow.replace('0.4', '0.15')}` : 'none',
              }}
              aria-label={opt.label}
            >
              <span className="text-xl mb-0.5">{opt.icon}</span>
              <span
                className="text-xs font-bold text-center leading-tight"
                style={{ color: isActive ? animal.colors.text : 'rgba(255,255,255,0.4)' }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mix mode hint */}
      {isMixMode && activeSounds.length < 2 && (
        <p className="text-center text-xs mt-2 font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Tap another sound to mix
        </p>
      )}

      {/* Main Animal Display */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Ambient glow ring */}
        <div
          className="absolute w-56 h-56 rounded-full"
          style={{
            background: `radial-gradient(circle, ${animal.colors.glow.replace('0.4', isPlaying ? '0.22' : '0.08')}, transparent 70%)`,
            transition: 'all 0.5s ease',
          }}
        />

        {/* Second glow ring pulse */}
        {isPlaying && (
          <div
            className="absolute w-64 h-64 rounded-full animate-pulse-glow"
            style={{
              border: `1px solid ${animal.colors.primary}20`,
            }}
          />
        )}

        {/* Breathing circles behind animal */}
        {isPlaying && (
          <>
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className="absolute rounded-full"
                style={{
                  width: `${100 + ring * 40}px`,
                  height: `${100 + ring * 40}px`,
                  border: `1px solid ${animal.colors.primary}${Math.floor(18 - ring * 5).toString(16).padStart(2, '0')}`,
                  animation: `breathe ${4.5 + ring * 0.5}s ease-in-out ${ring * 0.3}s infinite`,
                }}
              />
            ))}
          </>
        )}

        {/* Animal media: video > image > emoji (hidden when fullscreen video is playing) */}
        {!(animal.videoUrl && isPlaying) && (animal.videoUrl ? (
          <div
            key={emojiKey}
            className="relative z-10 rounded-3xl overflow-hidden"
            style={{
              width: '200px',
              height: '200px',
              boxShadow: `0 0 ${isPlaying ? '40px' : '16px'} ${animal.colors.glow}`,
              transition: 'box-shadow 0.5s ease',
              animation: isPlaying ? 'breathe 4.5s ease-in-out infinite' : 'float 6s ease-in-out infinite',
            }}
            aria-label={`${animal.name} character`}
          >
            <video
              src={animal.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : animal.imageUrl ? (
          <div
            key={emojiKey}
            className="relative z-10 rounded-3xl overflow-hidden"
            style={{
              width: '200px',
              height: '200px',
              boxShadow: `0 0 ${isPlaying ? '40px' : '16px'} ${animal.colors.glow}`,
              transition: 'box-shadow 0.5s ease',
              animation: isPlaying ? 'breathe 4.5s ease-in-out infinite' : 'float 6s ease-in-out infinite',
            }}
            aria-label={`${animal.name} character`}
          >
            <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            key={emojiKey}
            className="relative z-10"
            style={{
              fontSize: '110px',
              lineHeight: 1,
              filter: `drop-shadow(0 0 ${isPlaying ? '30px' : '10px'} ${animal.colors.glow})`,
              animation: isPlaying ? 'breathe 4.5s ease-in-out infinite' : 'float 6s ease-in-out infinite',
              transition: 'filter 0.5s ease',
            }}
            aria-label={`${animal.name} character`}
          >
            {animal.emoji}
          </div>
        ))}

        {/* Sleeping zzz's when playing */}
        {isPlaying && activeSounds.length > 0 && (
          <div className="absolute top-1/4 right-1/3 pointer-events-none">
            {['z', 'z', 'z'].map((z, i) => (
              <div
                key={i}
                className="absolute font-black"
                style={{
                  fontSize: `${10 + i * 4}px`,
                  color: animal.colors.text,
                  opacity: 0.4,
                  top: `${-i * 18}px`,
                  left: `${i * 10}px`,
                  animation: `twinkle ${2 + i * 0.5}s ease-in-out ${i * 0.7}s infinite`,
                }}
              >
                {z}
              </div>
            ))}
          </div>
        )}

        {/* Status text */}
        <div className="mt-6 text-center">
          <p
            className="text-base font-bold"
            style={{ color: isPlaying ? animal.colors.text : 'rgba(255,255,255,0.3)' }}
          >
            {!isPlaying
              ? 'Tap play to start'
              : activeSounds.length === 0
                ? 'Choose a sound above'
                : activeSounds.length === 2
                  ? 'Mixing 2 sounds...'
                  : `Playing ${SOUND_OPTIONS.find(s => s.type === activeSounds[0])?.label ?? ''}...`}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="px-5 pt-5 pb-1 safe-bottom"
        style={{
          background: 'linear-gradient(to top, rgba(2,2,10,0.97) 70%, transparent)',
        }}
      >
        {/* Volume */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => onVolumeChange(isMuted ? 0.7 : 0)}
            className="btn-icon w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted
              ? <VolumeX size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
              : <Volume2 size={18} style={{ color: 'rgba(255,255,255,0.8)' }} />}
          </button>
          <div className="flex-1 relative">
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none"
              style={{
                width: `${volume * 100}%`,
                background: `linear-gradient(to right, ${animal.colors.primary}, ${animal.colors.secondary})`,
              }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="relative z-10 w-full"
              aria-label="Volume"
              style={{ accentColor: animal.colors.primary }}
            />
          </div>
          <span
            className="text-sm font-bold w-9 text-right flex-shrink-0"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {Math.round(volume * 100)}
          </span>
        </div>

        {/* Main controls row */}
        <div className="flex items-center justify-between mb-2">
          {/* Mix mode toggle */}
          <button
            onClick={onToggleMix}
            className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 active:scale-90"
            style={{
              background: isMixMode
                ? `${animal.colors.primary}20`
                : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${isMixMode ? animal.colors.primary + '50' : 'rgba(255,255,255,0.08)'}`,
            }}
            aria-label={`Mix mode ${isMixMode ? 'on' : 'off'}`}
          >
            <Shuffle
              size={18}
              style={{ color: isMixMode ? animal.colors.text : 'rgba(255,255,255,0.4)' }}
            />
            <span
              className="text-xs font-bold"
              style={{ color: isMixMode ? animal.colors.text : 'rgba(255,255,255,0.35)' }}
            >
              Mix
            </span>
          </button>

          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="btn-icon w-20 h-20 rounded-full transition-all duration-300 active:scale-90"
            style={{
              background: isPlaying
                ? `linear-gradient(135deg, ${animal.colors.primary}, ${animal.colors.secondary})`
                : 'rgba(255,255,255,0.12)',
              border: isPlaying
                ? 'none'
                : '2px solid rgba(255,255,255,0.15)',
              boxShadow: isPlaying
                ? `0 0 30px ${animal.colors.glow}, 0 8px 24px rgba(0,0,0,0.4)`
                : '0 4px 16px rgba(0,0,0,0.3)',
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause size={28} strokeWidth={2.5} fill="white" style={{ color: 'white' }} />
              : <Play size={28} strokeWidth={2.5} fill="white" style={{ color: 'white', marginLeft: '3px' }} />}
          </button>

          {/* Timer shortcut */}
          <button
            onClick={onOpenTimer}
            className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 active:scale-90"
            style={{
              background: timerOption
                ? `${animal.colors.primary}20`
                : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${timerOption ? animal.colors.primary + '50' : 'rgba(255,255,255,0.08)'}`,
            }}
            aria-label="Sleep timer"
          >
            <Timer
              size={18}
              style={{ color: timerOption ? animal.colors.text : 'rgba(255,255,255,0.4)' }}
            />
            <span
              className="text-xs font-bold"
              style={{ color: timerOption ? animal.colors.text : 'rgba(255,255,255,0.35)' }}
            >
              Timer
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
