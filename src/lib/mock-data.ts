import type { Track } from './types';
import { PlaceHolderImages } from './placeholder-images';

function getImageUrl(id: string) {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? image.imageUrl : 'https://picsum.photos/seed/fallback/200/200';
}
function getImageHint(id: string) {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? image.imageHint : 'image';
}

export const allTracks: Track[] = [
  {
    id: '1',
    title: 'Future Funk',
    artist: 'Cosmic Groove',
    album: 'Galaxy Beats',
    artworkUrl: getImageUrl('album-art-1'),
    artworkHint: getImageHint('album-art-1'),
    previewUrl: 'https://cdn.pixabay.com/audio/2022/01/24/audio_b79c32a59d.mp3',
  },
  {
    id: '2',
    title: 'Retro Wave',
    artist: 'Neon Dreams',
    album: 'Sunset Drive',
    artworkUrl: getImageUrl('album-art-2'),
    artworkHint: getImageHint('album-art-2'),
    previewUrl: 'https://cdn.pixabay.com/audio/2023/05/20/audio_5514f84c47.mp3',
  },
  {
    id: '3',
    title: 'Minimal Echoes',
    artist: 'Mono-Pulse',
    album: 'Soundscapes',
    artworkUrl: getImageUrl('album-art-3'),
    artworkHint: getImageHint('album-art-3'),
    previewUrl: 'https://cdn.pixabay.com/audio/2022/02/07/audio_f523d463ac.mp3',
  },
  {
    id: '4',
    title: 'Color Trip',
    artist: 'Kaleidoscope',
    album: 'Vivid',
    artworkUrl: getImageUrl('album-art-4'),
    artworkHint: getImageHint('album-art-4'),
    previewUrl: 'https://cdn.pixabay.com/audio/2023/04/05/audio_2dc99a2a7a.mp3',
  },
  {
    id: '5',
    title: 'Morning Mist',
    artist: 'Serenity',
    album: 'Quiet Places',
    artworkUrl: getImageUrl('album-art-5'),
    artworkHint: getImageHint('album-art-5'),
    previewUrl: 'https://cdn.pixabay.com/audio/2024/05/10/audio_f31c26127e.mp3',
  },
  {
    id: '6',
    title: 'Lo-Fi Sunday',
    artist: 'Chill Cat',
    album: 'Tape Deck',
    artworkUrl: getImageUrl('album-art-6'),
    artworkHint: getImageHint('album-art-6'),
    previewUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_18088ee67a.mp3',
  },
  {
    id: '7',
    title: 'Cyber City',
    artist: 'Grid Runner',
    album: 'Metropolis',
    artworkUrl: getImageUrl('album-art-7'),
    artworkHint: getImageHint('album-art-7'),
    previewUrl: 'https://cdn.pixabay.com/audio/2023/11/17/audio_b29c9b986f.mp3',
  },
  {
    id: '8',
    title: 'Cartoon Chase',
    artist: 'The Doodles',
    album: 'Sketches',
    artworkUrl: getImageUrl('album-art-8'),
    artworkHint: getImageHint('album-art-8'),
    previewUrl: 'https://cdn.pixabay.com/audio/2023/09/24/audio_a7e2ed371c.mp3',
  },
  {
    id: '9',
    title: 'Jazz Club',
    artist: 'Night Owls',
    album: 'Spinning Vinyl',
    artworkUrl: getImageUrl('album-art-9'),
    artworkHint: getImageHint('album-art-9'),
    previewUrl: 'https://cdn.pixabay.com/audio/2024/05/10/audio_f31c26127e.mp3',
  },
  {
    id: '10',
    title: 'Cosmic Drift',
    artist: 'Stargazer',
    album: 'Nebula',
    artworkUrl: getImageUrl('album-art-10'),
    artworkHint: getImageHint('album-art-10'),
    previewUrl: 'https://cdn.pixabay.com/audio/2023/05/20/audio_5514f84c47.mp3',
  },
  {
    id: '11',
    title: 'Ivory Keys',
    artist: 'Piano Man',
    album: 'Sonatas',
    artworkUrl: getImageUrl('album-art-11'),
    artworkHint: getImageHint('album-art-11'),
    previewUrl: 'https://cdn.pixabay.com/audio/2022/01/24/audio_b79c32a59d.mp3',
  },
  {
    id: '12',
    title: 'Street Beat',
    artist: 'Urban Flow',
    album: 'Concrete Jungle',
    artworkUrl: getImageUrl('album-art-12'),
    artworkHint: getImageHint('album-art-12'),
    previewUrl: 'https://cdn.pixabay.com/audio/2022/02/07/audio_f523d463ac.mp3',
  },
];
