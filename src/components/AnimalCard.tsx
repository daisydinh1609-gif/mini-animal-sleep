import { Lock } from 'lucide-react';
import type { Animal } from '../data/animals';

interface AnimalCardProps {
  animal: Animal;
  isActive: boolean;
  onClick: () => void;
}

export default function AnimalCard({ animal, isActive, onClick }: AnimalCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left transition-all duration-300 active:scale-95 focus:outline-none rounded-3xl"
      style={{
        aspectRatio: '4 / 5',
        background: animal.free
          ? `linear-gradient(160deg, rgba(168,85,247,0.18) 0%, rgba(236,72,153,0.12) 60%, rgba(0,0,0,0.2) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: isActive
          ? '2px solid rgba(216,180,254,0.55)'
          : animal.free
            ? '1.5px solid rgba(168,85,247,0.25)'
            : '1.5px solid rgba(255,255,255,0.07)',
        boxShadow: isActive
          ? '0 0 28px 6px rgba(168,85,247,0.22), inset 0 0 30px rgba(168,85,247,0.08)'
          : animal.free
            ? '0 6px 28px rgba(0,0,0,0.5)'
            : '0 4px 16px rgba(0,0,0,0.35)',
      }}
      aria-label={`${animal.name} — ${animal.free ? 'Free' : 'Coming Soon'}`}
    >
      {/* Active shimmer ring */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(216,180,254,0.1), transparent 70%)',
          }}
        />
      )}

      {/* Image background */}
      {animal.imageUrl && (
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{ filter: animal.free ? 'none' : 'grayscale(0.6) brightness(0.5)' }}
        >
          <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)' }} />
        </div>
      )}

      {/* Card inner */}
      <div className="relative flex flex-col items-center justify-between h-full p-4 pt-6">
        {/* Emoji (only when no imageUrl) */}
        {!animal.imageUrl && (
          <div className="flex-1 flex items-center justify-center">
            <div
              className="transition-transform duration-300"
              style={{
                fontSize: '72px',
                lineHeight: 1,
                filter: animal.free
                  ? `drop-shadow(0 0 16px ${animal.colors.glow})`
                  : 'grayscale(0.5) opacity(0.5)',
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              {animal.emoji}
            </div>
          </div>
        )}
        {animal.imageUrl && <div className="flex-1" />}

        {/* Name */}
        <div className="text-center w-full mt-3">
          <div
            className="font-black text-lg leading-tight"
            style={{
              color: animal.free ? '#f0d9ff' : 'rgba(255,255,255,0.3)',
            }}
          >
            {animal.name}
          </div>
          {animal.free && (
            <div
              className="text-xs font-semibold mt-1 leading-tight"
              style={{ color: 'rgba(216,180,254,0.45)' }}
            >
              {animal.tagline}
            </div>
          )}
        </div>
      </div>

      {/* Lock overlay */}
      {!animal.free && (
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-2"
          style={{
            background: 'rgba(2,2,10,0.55)',
            backdropFilter: 'blur(3px)',
          }}
        >
          <Lock size={24} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <span
            className="text-xs font-black tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}
          >
            COMING SOON
          </span>
        </div>
      )}

      {/* Free badge */}
      {animal.free && (
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black"
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.3))',
            color: '#f0d9ff',
            border: '1px solid rgba(216,180,254,0.3)',
          }}
        >
          FREE
        </div>
      )}
    </button>
  );
}
