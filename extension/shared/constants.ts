export const WATCH_LATER_URL_PATTERN = /^https:\/\/www\.youtube\.com\/playlist\?list=WL/;

export const MSG = {
  PING: 'ping',
  START: 'start',
  STOP: 'stop',
  GET_STATUS: 'getStatus',
  PROGRESS: 'progress',
} as const;

export type RunState = 'idle' | 'running' | 'done' | 'stopped' | 'error';

export interface StatusPayload {
  state: RunState;
  processed: number;
  remaining: number;
  error?: string;
}
