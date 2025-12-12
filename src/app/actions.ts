'use server';

import { createAiPlaylist } from '@/ai/flows/create-ai-playlist';
import { allTracks } from '@/lib/mock-data';

interface PlaylistInput {
  songInput: string;
  moodPrompt: string;
}

export async function generatePlaylistAction(input: PlaylistInput) {
  try {
    const availableSongs = allTracks.map(track => track.title);
    const result = await createAiPlaylist({ ...input, availableSongs });
    return { playlist: result.playlist };
  } catch (error) {
    console.error('Error generating AI playlist:', error);
    return { error: 'Failed to generate playlist. Please try again.' };
  }
}
