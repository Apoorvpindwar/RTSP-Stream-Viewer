// This is a placeholder for the WebSocket service that would connect to the Django backend

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface StreamStatus {
  streamId: string;
  status: 'connecting' | 'playing' | 'error' | 'stopped';
  error?: string;
  frameData?: string; // Base64 encoded frame data in production
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 0;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // In production, this would connect to the Django Channels backend
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log('WebSocket connected successfully');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          this.attemptReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            const listeners = this.listeners.get(message.type) || [];
            listeners.forEach(callback => callback(message.payload));
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

      } catch (error) {
        console.error('WebSocket connection failed:', error);
        this.attemptReconnect();
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);
      
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = window.setTimeout(() => {
        this.connect().catch(() => {
          console.log('Reconnection attempt failed');
        });
      }, delay);
    } else {
      console.error('Maximum reconnection attempts reached');
      this.notifyError('connection_failed', 'Failed to establish WebSocket connection');
    }
  }

  private notifyError(type: string, message: string): void {
    const listeners = this.listeners.get('error') || [];
    listeners.forEach(callback => callback({ type, message }));
  }

  subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(eventType, callback);
  }

  unsubscribe(eventType: string, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      this.listeners.set(
        eventType,
        callbacks.filter(cb => cb !== callback)
      );
    }
  }

  send(message: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
      this.notifyError('send_failed', 'WebSocket not connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      clearTimeout(this.reconnectTimeout);
    }
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService('wss://example.com/ws');

export default webSocketService;