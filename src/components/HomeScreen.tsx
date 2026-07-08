import { Moon } from 'lucide-react';
import AnimalCard from './AnimalCard';
import { ANIMALS } from '../data/animals';
import type { Animal } from '../data/animals';

interface HomeScreenProps {
  activeAnimalId: string | null;
  onSelectAnimal: (animal: Animal) => void;
}

// Deterministic star positions for consistent rendering
const STARS = [
  { x: 5,  y: 4,  s: 3, d: 0,    dur: 2.4 },
  { x: 14, y: 18, s: 2, d: 0.6,  dur: 3.1 },
  { x: 22, y: 7,  s: 1, d: 1.2,  dur: 2.8 },
  { x: 31, y: 25, s: 4, d: 0.3,  dur: 3.5 },
  { x: 38, y: 11, s: 2, d: 1.8,  dur: 2.2 },
  { x: 46, y: 3,  s: 3, d: 0.9,  dur: 3.8 },
  { x: 53, y: 19, s: 1, d: 0.4,  dur: 2.6 },
  { x: 61, y: 8,  s: 2, d: 2.1,  dur: 3.2 },
  { x: 68, y: 28, s: 3, d: 0.7,  dur: 2.9 },
  { x: 74, y: 14, s: 1, d: 1.5,  dur: 3.6 },
  { x: 82, y: 5,  s: 4, d: 0.2,  dur: 2.3 },
  { x: 89, y: 22, s: 2, d: 1.9,  dur: 3.0 },
  { x: 95, y: 10, s: 3, d: 0.8,  dur: 2.7 },
  { x: 9,  y: 35, s: 2, d: 2.4,  dur: 3.3 },
  { x: 17, y: 42, s: 1, d: 1.0,  dur: 2.5 },
  { x: 27, y: 38, s: 3, d: 0.5,  dur: 3.7 },
  { x: 35, y: 48, s: 2, d: 1.7,  dur: 2.1 },
  { x: 43, y: 33, s: 4, d: 2.6,  dur: 3.4 },
  { x: 50, y: 45, s: 1, d: 0.1,  dur: 2.8 },
  { x: 58, y: 37, s: 3, d: 1.3,  dur: 3.1 },
  { x: 66, y: 50, s: 2, d: 2.0,  dur: 2.4 },
  { x: 72, y: 41, s: 1, d: 0.6,  dur: 3.9 },
  { x: 79, y: 32, s: 4, d: 1.4,  dur: 2.2 },
  { x: 87, y: 46, s: 2, d: 2.3,  dur: 3.5 },
  { x: 93, y: 36, s: 3, d: 0.9,  dur: 2.7 },
  { x: 3,  y: 55, s: 1, d: 1.6,  dur: 3.0 },
  { x: 12, y: 62, s: 2, d: 0.3,  dur: 3.6 },
  { x: 20, y: 70, s: 3, d: 2.2,  dur: 2.3 },
  { x: 29, y: 58, s: 1, d: 1.1,  dur: 3.8 },
  { x: 40, y: 67, s: 4, d: 0.7,  dur: 2.5 },
  { x: 48, y: 75, s: 2, d: 1.8,  dur: 3.2 },
  { x: 56, y: 63, s: 3, d: 2.5,  dur: 2.9 },
  { x: 64, y: 72, s: 1, d: 0.4,  dur: 3.4 },
  { x: 71, y: 57, s: 2, d: 1.2,  dur: 2.6 },
  { x: 80, y: 68, s: 4, d: 2.8,  dur: 3.7 },
  { x: 91, y: 60, s: 3, d: 0.8,  dur: 2.1 },
  { x: 97, y: 74, s: 1, d: 1.5,  dur: 3.3 },
  { x: 7,  y: 82, s: 2, d: 0.2,  dur: 2.8 },
  { x: 16, y: 88, s: 3, d: 2.0,  dur: 3.5 },
  { x: 24, y: 80, s: 1, d: 1.3,  dur: 2.4 },
  { x: 33, y: 90, s: 4, d: 0.6,  dur: 3.1 },
  { x: 44, y: 85, s: 2, d: 2.7,  dur: 2.7 },
  { x: 52, y: 93, s: 3, d: 1.0,  dur: 3.8 },
  { x: 62, y: 87, s: 1, d: 0.5,  dur: 2.2 },
  { x: 70, y: 95, s: 2, d: 1.7,  dur: 3.6 },
  { x: 78, y: 83, s: 4, d: 2.4,  dur: 2.5 },
  { x: 85, y: 91, s: 3, d: 0.9,  dur: 3.0 },
  { x: 92, y: 79, s: 1, d: 1.6,  dur: 2.9 },
  { x: 98, y: 86, s: 2, d: 2.1,  dur: 3.4 },
  { x: 2,  y: 96, s: 3, d: 0.4,  dur: 2.6 },
];

export default function HomeScreen({ activeAnimalId, onSelectAnimal }: HomeScreenProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col animate-fade-in relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a0a3a 0%, #06040f 40%, #020208 100%)',
      }}
    >
      {/* Stars layer — full screen fixed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.s}px`,
              height: `${star.s}px`,
              animation: `twinkle ${star.dur}s ease-in-out ${star.d}s infinite`,
              opacity: star.s >= 3 ? 0.75 : 0.45,
            }}
          />
        ))}
        {/* Milky way-ish faint glow band */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent 20%, rgba(139,92,246,0.04) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 safe-top px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(216,180,254,0.15)', border: '1px solid rgba(216,180,254,0.25)' }}
            >
              <Moon size={20} style={{ color: '#e9d5ff' }} />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight" style={{ color: '#f0d9ff' }}>
                Sleep ASMR
              </h1>
              <p className="text-xs font-semibold" style={{ color: 'rgba(216,180,254,0.5)' }}>
                Mini Animal
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))',
              border: '1px solid rgba(216,180,254,0.25)',
            }}
          >
            <span className="text-xs">✨</span>
            <span className="text-xs font-bold" style={{ color: '#e9d5ff' }}>Premium</span>
          </div>
        </div>

        <p className="text-sm font-semibold mt-4 mb-1" style={{ color: 'rgba(216,180,254,0.45)' }}>
          Choose your sleep companion
        </p>
      </div>

      {/* Animal Grid */}
      <div className="relative z-10 flex-1 px-4 pb-8">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {ANIMALS.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isActive={activeAnimalId === animal.id}
              onClick={() => animal.free && onSelectAnimal(animal)}
            />
          ))}
        </div>

        {/* Info hint */}
        <div
          className="mt-5 mx-auto max-w-sm px-4 py-3 rounded-2xl text-center"
          style={{
            background: 'rgba(168,85,247,0.06)',
            border: '1px solid rgba(168,85,247,0.12)',
          }}
        >
          <p className="text-xs font-semibold" style={{ color: 'rgba(216,180,254,0.35)' }}>
            Tap a free animal to start playing relaxing sounds
          </p>
        </div>
      </div>
    </div>
  );
}
