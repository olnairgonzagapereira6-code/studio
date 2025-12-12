"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Track, Download } from '@/lib/types';
import { allTracks } from '@/lib/mock-data';
import { generatePlaylistAction } from '@/app/actions';
import { TrackCard } from '@/components/TrackCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Music, Search, Download as DownloadIcon, Sparkles, Loader2, Pause, Play } from 'lucide-react';

const playlistFormSchema = z.object({
  songInput: z.string().min(2, { message: 'Please enter a song or artist.' }),
  moodPrompt: z.string().min(5, { message: 'Please describe the mood.' }),
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [aiPlaylist, setAiPlaylist] = useState<Track[]>([]);
  const [isPlaylistLoading, startPlaylistTransition] = useTransition();
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults(allTracks.slice(0, 12));
    } else {
      const results = allTracks.filter(
        track =>
          track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prevDownloads =>
        prevDownloads
          .map(d => {
            if (d.progress < 100) {
              const newProgress = Math.min(d.progress + Math.random() * 20, 100);
              if (newProgress >= 100 && d.status !== 'completed') {
                toast({
                  title: "Download Complete",
                  description: `"${d.track.title}" has been downloaded.`,
                });
                return { ...d, progress: 100, status: 'completed' as const };
              }
              return { ...d, progress: newProgress };
            }
            return d;
          })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleDownload = (track: Track) => {
    if (downloads.some(d => d.track.id === track.id)) {
      toast({
        title: "Already in Downloads",
        description: `"${track.title}" is already in your download queue.`,
        variant: "default",
      });
      return;
    }
    setDownloads(prev => [...prev, { track, progress: 0, status: 'downloading' }]);
    toast({
      title: "Download Started",
      description: `Downloading "${track.title}"...`,
    });
  };

  const handlePlay = (track: Track) => {
    if (audioRef.current) {
      if (nowPlaying?.id === track.id) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } else {
        setNowPlaying(track);
        audioRef.current.src = track.previewUrl;
        audioRef.current.play();
      }
    }
  };

  const handleAudioPlayState = () => {
    if (audioRef.current && audioRef.current.paused) {
      setNowPlaying(null);
    }
  };

  const form = useForm<z.infer<typeof playlistFormSchema>>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: { songInput: '', moodPrompt: '' },
  });

  const onPlaylistSubmit = (values: z.infer<typeof playlistFormSchema>) => {
    startPlaylistTransition(async () => {
      const result = await generatePlaylistAction(values);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        setAiPlaylist([]);
      } else {
        const playlistTracks = allTracks.filter(track => result.playlist?.includes(track.title));
        setAiPlaylist(playlistTracks);
        if (playlistTracks.length === 0) {
          toast({
            title: "No Playlist Generated",
            description: "We couldn't generate a playlist with that criteria. Try being more specific.",
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">
              TuneDrop
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
            <TabsTrigger value="search"><Search className="mr-2" />Search</TabsTrigger>
            <TabsTrigger value="ai-playlist"><Sparkles className="mr-2" />AI Playlist</TabsTrigger>
            <TabsTrigger value="downloads"><DownloadIcon className="mr-2" />My Downloads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or artist..."
                className="pl-10 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {searchResults.map(track => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onDownload={handleDownload}
                  onPlay={handlePlay}
                  isPlaying={nowPlaying?.id === track.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-playlist" className="mt-6">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/>AI Playlist Creator</CardTitle>
                <CardDescription>Let AI build the perfect playlist for your mood.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onPlaylistSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="songInput"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starting Song or Artist</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'Daft Punk' or 'Get Lucky'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="moodPrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe the Mood</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., 'Uplifting electronic music for a summer drive'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPlaylistLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {isPlaylistLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                      Generate Playlist
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
             {isPlaylistLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : aiPlaylist.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {aiPlaylist.map(track => (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    onDownload={handleDownload}
                    onPlay={handlePlay}
                    isPlaying={nowPlaying?.id === track.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {downloads.length > 0 ? (
                downloads.map(d => (
                  <TrackCard 
                    key={d.track.id} 
                    track={d.track} 
                    onDownload={handleDownload}
                    onPlay={handlePlay}
                    isPlaying={nowPlaying?.id === d.track.id}
                    downloadProgress={d.progress}
                    downloadStatus={d.status}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">Your downloaded songs will appear here.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <audio 
        ref={audioRef}
        onPlay={() => {}}
        onPause={handleAudioPlayState}
        onEnded={handleAudioPlayState}
      />
    </div>
  );
}
