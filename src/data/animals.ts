export type SoundType = 'breathing' | 'rain' | 'nature';
export type TimerOption = 15 | 30 | 60 | null;

export interface SoundOption {
  type: SoundType;
  label: string;
  icon: string;
  description: string;
}

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  free: boolean;
  imageUrl?: string;
  videoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    glow: string;
    card: string;
    text: string;
  };
  sounds: SoundOption[];
}

export const SOUND_OPTIONS: SoundOption[] = [
  {
    type: 'breathing',
    label: 'Sleepy Breaths',
    icon: '💤',
    description: 'Soft breathing sounds',
  },
  {
    type: 'rain',
    label: 'Rain Lullaby',
    icon: '🌧️',
    description: 'Breaths + gentle rain',
  },
  {
    type: 'nature',
    label: 'Nature Nap',
    icon: '🌿',
    description: 'Breaths + nature sounds',
  },
];

export const ANIMALS: Animal[] = [
  {
    id: 'hammy',
    name: 'Hammy',
    emoji: '🐹',
    tagline: 'Little cheeks, big dreams',
    free: true,
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      glow: 'rgba(249,115,22,0.4)',
      card: 'from-orange-900/40 to-amber-900/30',
      text: '#fed7aa',
    },
    sounds: SOUND_OPTIONS,
  },
  {
    id: 'froggy',
    name: 'Froggy',
    emoji: '🐸',
    tagline: 'Ribbiting dreams ahead',
    free: true,
    colors: {
      primary: '#22c55e',
      secondary: '#4ade80',
      glow: 'rgba(34,197,94,0.4)',
      card: 'from-green-900/40 to-emerald-900/30',
      text: '#bbf7d0',
    },
    sounds: SOUND_OPTIONS,
  },
  {
    id: 'jellsy',
    name: 'Jellsy',
    emoji: '🪼',
    tagline: 'Floating into dreamland',
    free: true,
    imageUrl: 'https://res.cloudinary.com/jgobov7d/image/upload/v1783423917/8_ei4ja2.jpg',
    videoUrl: 'https://res.cloudinary.com/jgobov7d/video/upload/v1783423954/8_qv6glf.mp4',
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      glow: 'rgba(124,58,237,0.4)',
      card: 'from-violet-900/40 to-purple-900/30',
      text: '#ede9fe',
    },
    sounds: SOUND_OPTIONS,
  },
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    tagline: 'Fluffy hops into slumber',
    free: false,
    colors: {
      primary: '#f472b6',
      secondary: '#fb7185',
      glow: 'rgba(244,114,182,0.4)',
      card: 'from-pink-900/40 to-rose-900/30',
      text: '#fce7f3',
    },
    sounds: SOUND_OPTIONS,
  },
  {
    id: 'duckling',
    name: 'Duckling',
    emoji: '🐥',
    tagline: 'Quack softly, sleep deeply',
    free: false,
    colors: {
      primary: '#eab308',
      secondary: '#facc15',
      glow: 'rgba(234,179,8,0.4)',
      card: 'from-yellow-900/40 to-amber-900/30',
      text: '#fef08a',
    },
    sounds: SOUND_OPTIONS,
  },
  {
    id: 'kitten',
    name: 'Kitten',
    emoji: '🐱',
    tagline: 'Purring you to sleep',
    free: false,
    colors: {
      primary: '#a78bfa',
      secondary: '#c4b5fd',
      glow: 'rgba(167,139,250,0.4)',
      card: 'from-violet-900/40 to-purple-900/30',
      text: '#ede9fe',
    },
    sounds: SOUND_OPTIONS,
  },
  {
    id: 'owly',
    name: 'Owly',
    emoji: '🦉',
    tagline: 'Wise guardian of your sleep',
    free: false,
    colors: {
      primary: '#6366f1',
      secondary: '#818cf8',
      glow: 'rgba(99,102,241,0.4)',
      card: 'from-indigo-900/40 to-slate-900/30',
      text: '#e0e7ff',
    },
    sounds: SOUND_OPTIONS,
  },
];
