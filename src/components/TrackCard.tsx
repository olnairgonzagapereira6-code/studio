import Image from 'next/image';
import type { Track } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Download, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onDownload: (track: Track) => void;
  isPlaying: boolean;
  downloadProgress?: number;
  downloadStatus?: 'downloading' | 'completed' | 'paused' | 'error';
}

export function TrackCard({
  track,
  onPlay,
  onDownload,
  isPlaying,
  downloadProgress,
  downloadStatus,
}: TrackCardProps) {
  const isDownloading = downloadStatus === 'downloading';
  const isCompleted = downloadStatus === 'completed';

  return (
    <Card className="group relative overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={track.artworkUrl}
            alt={`${track.album} album art`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={track.artworkHint}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <Button
            size="icon"
            variant="default"
            onClick={() => onPlay(track)}
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-14 w-14 opacity-0 scale-75 transition-all group-hover:opacity-100 group-hover:scale-100",
              isPlaying && "opacity-100 scale-100"
            )}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-headline font-semibold truncate">{track.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {downloadStatus ? (
          <div className="w-full space-y-2">
            <Progress value={downloadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {isCompleted ? 'Downloaded' : `Downloading... ${Math.round(downloadProgress ?? 0)}%`}
            </p>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full" onClick={() => onDownload(track)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </CardFooter>
      {isCompleted && (
        <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-green-500 text-white">
          <CheckCircle className="h-4 w-4" />
        </div>
      )}
    </Card>
  );
}
