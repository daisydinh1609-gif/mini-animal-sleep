import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface SplashScreenProps {
  onComplete: () => void;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.7,
  }));
}

const STARS = generateStars(60);

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('opacity-0');
        containerRef.current.style.transition = 'opacity 0.6s ease-out';
      }
      setTimeout(onComplete, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1a0635 0%, #060110 55%, #020208 100%)',
      }}
    >
      {/* Stars */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'white',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Shooting star */}
      <div
        className="absolute w-1 rounded-full"
        style={{
          top: '20%',
          left: '20%',
          height: '60px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), white)',
          transform: 'rotate(45deg)',
          animation: 'slideUp 0.6s ease-out 1.2s both',
          opacity: 0.7,
        }}
      />

      {/* Moon */}
      <div
        className="relative mb-6"
        style={{ animation: 'moonRise 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.3s both' }}
      >
        <div
          className="w-28 h-28 rounded-full relative flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #fff9e6, #f5d97a)',
            boxShadow: '0 0 60px 20px rgba(245,217,122,0.25), 0 0 120px 40px rgba(245,217,122,0.1)',
          }}
        >
          {/* Moon crescent shadow */}
          <div
            className="absolute w-20 h-20 rounded-full"
            style={{
              top: '4px',
              left: '18px',
              background: 'radial-gradient(circle at 40% 40%, #1a1040, #0d0820)',
              opacity: 0.85,
            }}
          />
          {/* Moon face */}
          <div className="relative z-10 flex flex-col items-center" style={{ marginLeft: '-12px' }}>
            <div className="flex gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-800/60" />
              <div className="w-2 h-2 rounded-full bg-amber-800/60" />
            </div>
            <div
              className="w-5 h-2 rounded-full border-b-2 border-amber-800/50"
              style={{ borderRadius: '0 0 50% 50%' }}
            />
          </div>
        </div>

        {/* Orbiting stars */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 2 === 0 ? '5px' : '3px',
              height: i % 2 === 0 ? '5px' : '3px',
              top: `${50 + 55 * Math.sin((deg * Math.PI) / 180)}%`,
              left: `${50 + 55 * Math.cos((deg * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
              opacity: 0.6,
              animation: `twinkle ${1.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div
        className="text-center"
        style={{ animation: 'fadeIn 0.8s ease-out 1s both' }}
      >
        <h1
          className="text-3xl font-black tracking-tight mb-2"
          style={{
            background: 'linear-gradient(135deg, #f0d9ff, #d946ef, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Mini Animal
        </h1>
        <h2
          className="text-3xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #e879f9, #a855f7, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sleep ASMR
        </h2>
        <p
          className="mt-3 text-sm font-medium tracking-wider"
          style={{
            color: 'rgba(216,180,254,0.55)',
            animation: 'fadeIn 0.8s ease-out 1.5s both',
            letterSpacing: '0.15em',
          }}
        >
          SWEET DREAMS BEGIN HERE
        </p>
      </div>

      {/* Bottom dots loader */}
      <div
        className="absolute bottom-16 flex gap-2"
        style={{ animation: 'fadeIn 0.5s ease-out 2s both' }}
      >
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: 'rgba(196,181,253,0.5)',
              animation: `twinkle 1.2s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
