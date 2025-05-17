export interface Stream {
  id: number;
  name: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_error: string | null;
  reconnection_attempts: number;
  isPlaying: boolean;
  error: string | null;
  isConnecting: boolean;
  severity?: 'info' | 'warning' | 'error';
} 