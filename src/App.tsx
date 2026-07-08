import { useState, useCallback, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import PlayerScreen from './components/PlayerScreen';
import TimerModal from './components/TimerModal';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useSleepTimer } from './hooks/useSleepTimer';
import type { Animal, SoundType } from './data/animals';

type Screen = 'splash' | 'home' | 'player';

const MAX_MIX_SOUNDS = 2;

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [activeSounds, setActiveSounds] = useState<SoundType[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMixMode, setIsMixMode] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const { play, stop, stopAll, setVolume } = useAudioEngine();

  const handleTimerExpire = useCallback(() => {
    stopAll();
    setActiveSounds([]);
    setIsPlaying(false);
  }, [stopAll]);

  const { timerOption, setTimer, clearTimer, formattedTime } = useSleepTimer(handleTimerExpire);

  // Sync volume changes to audio engine
  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

  const handleSelectAnimal = useCallback((animal: Animal) => {
    if (selectedAnimal?.id !== animal.id) {
      stopAll();
      setActiveSounds([]);
      setIsPlaying(false);
    }
    setSelectedAnimal(animal);
    setScreen('player');
  }, [selectedAnimal, stopAll]);

  const handleBack = useCallback(() => {
    stopAll();
    setActiveSounds([]);
    setIsPlaying(false);
    clearTimer();
    setScreen('home');
  }, [stopAll, clearTimer]);

  const handleToggleSound = useCallback((type: SoundType) => {
    if (!isPlaying) return;

    setActiveSounds(prev => {
      const isActive = prev.includes(type);
      if (isActive) {
        // Deactivate
        stop(`${selectedAnimal?.id}-${type}`);
        return prev.filter(s => s !== type);
      }
      // Activate
      if (!isMixMode) {
        // Single mode: stop all current, play only new
        prev.forEach(s => stop(`${selectedAnimal?.id}-${s}`));
        if (selectedAnimal) play(`${selectedAnimal.id}-${type}`, type);
        return [type];
      }
      // Mix mode: add up to max
      if (prev.length >= MAX_MIX_SOUNDS) {
        // Replace oldest
        const oldest = prev[0];
        stop(`${selectedAnimal?.id}-${oldest}`);
        if (selectedAnimal) play(`${selectedAnimal.id}-${type}`, type);
        return [...prev.slice(1), type];
      }
      if (selectedAnimal) play(`${selectedAnimal.id}-${type}`, type);
      return [...prev, type];
    });
  }, [isPlaying, isMixMode, selectedAnimal, play, stop]);

  const handleTogglePlay = useCallback(() => {
    if (!selectedAnimal) return;

    if (isPlaying) {
      // Pause: stop all active sounds
      activeSounds.forEach(s => stop(`${selectedAnimal.id}-${s}`));
      setIsPlaying(false);
    } else {
      // Play: resume active sounds or start default
      setIsPlaying(true);
      if (activeSounds.length === 0) {
        // Auto-start first sound
        play(`${selectedAnimal.id}-breathing`, 'breathing');
        setActiveSounds(['breathing']);
      } else {
        activeSounds.forEach(s => play(`${selectedAnimal.id}-${s}`, s));
      }
    }
  }, [isPlaying, selectedAnimal, activeSounds, play, stop]);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolumeState(vol);
  }, []);

  const handleToggleMix = useCallback(() => {
    setIsMixMode(prev => {
      if (prev && activeSounds.length > 1 && selectedAnimal) {
        // Turning off mix: keep only first sound
        const toRemove = activeSounds.slice(1);
        toRemove.forEach(s => stop(`${selectedAnimal.id}-${s}`));
        setActiveSounds(curr => curr.slice(0, 1));
      }
      return !prev;
    });
  }, [activeSounds, selectedAnimal, stop]);

  const handleTimerSelect = useCallback((option: typeof timerOption) => {
    setTimer(option);
  }, [setTimer]);

  return (
    <div className="font-nunito">
      {screen === 'splash' && (
        <SplashScreen onComplete={() => setScreen('home')} />
      )}

      {screen === 'home' && (
        <HomeScreen
          activeAnimalId={selectedAnimal?.id ?? null}
          onSelectAnimal={handleSelectAnimal}
        />
      )}

      {screen === 'player' && selectedAnimal && (
        <PlayerScreen
          animal={selectedAnimal}
          activeSounds={activeSounds}
          isPlaying={isPlaying}
          volume={volume}
          isMixMode={isMixMode}
          timerOption={timerOption}
          timeRemaining={formattedTime}
          onBack={handleBack}
          onToggleSound={handleToggleSound}
          onTogglePlay={handleTogglePlay}
          onVolumeChange={handleVolumeChange}
          onToggleMix={handleToggleMix}
          onOpenTimer={() => setIsTimerOpen(true)}
        />
      )}

      <TimerModal
        isOpen={isTimerOpen}
        currentTimer={timerOption}
        timeRemaining={formattedTime}
        onSelect={handleTimerSelect}
        onClose={() => setIsTimerOpen(false)}
      />
    </div>
  );
}
