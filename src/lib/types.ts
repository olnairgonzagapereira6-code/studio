export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  artworkHint: string;
  previewUrl: string;
}

export interface Download {
  track: Track;
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'error';
}
