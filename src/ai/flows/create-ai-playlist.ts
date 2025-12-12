'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating AI-powered playlists based on user prompts.
 *
 * The flow takes a song input and a prompt describing the desired mood or feeling of the playlist,
 * then uses AI to suggest a potential playlist from available songs.
 *
 * @exports {createAiPlaylist} - The main function to create an AI playlist.
 * @exports {CreateAiPlaylistInput} - The input type for the createAiPlaylist function.
 * @exports {CreateAiPlaylistOutput} - The output type for the createAiPlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateAiPlaylistInputSchema = z.object({
  songInput: z.string().describe('A song title or artist to start the playlist from.'),
  moodPrompt: z.string().describe('A description of the desired mood or feeling for the playlist.'),
  availableSongs: z.array(z.string()).describe('A list of available songs to include in the playlist.'),
});
export type CreateAiPlaylistInput = z.infer<typeof CreateAiPlaylistInputSchema>;

const CreateAiPlaylistOutputSchema = z.object({
  playlist: z.array(z.string()).describe('A list of songs suggested for the playlist.'),
});
export type CreateAiPlaylistOutput = z.infer<typeof CreateAiPlaylistOutputSchema>;

export async function createAiPlaylist(input: CreateAiPlaylistInput): Promise<CreateAiPlaylistOutput> {
  return createAiPlaylistFlow(input);
}

const createAiPlaylistPrompt = ai.definePrompt({
  name: 'createAiPlaylistPrompt',
  input: {schema: CreateAiPlaylistInputSchema},
  output: {schema: CreateAiPlaylistOutputSchema},
  prompt: `You are a playlist creation expert. Given a starting song and a mood prompt, create a playlist of songs from the available songs that matches the mood.

Starting Song: {{{songInput}}}
Mood Prompt: {{{moodPrompt}}}
Available Songs: {{#each availableSongs}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Create a playlist of songs that fits the mood, using only songs from the available songs list. Do not include songs that are not in the available songs list.

Output the playlist as a list of song titles.
`,
});

const createAiPlaylistFlow = ai.defineFlow(
  {
    name: 'createAiPlaylistFlow',
    inputSchema: CreateAiPlaylistInputSchema,
    outputSchema: CreateAiPlaylistOutputSchema,
  },
  async input => {
    const {output} = await createAiPlaylistPrompt(input);
    return output!;
  }
);
