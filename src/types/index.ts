export interface Stream {
  id: string;
  url: string;
  name: string;
  isPlaying: boolean;
  error: string | null;
  isConnecting: boolean;
}