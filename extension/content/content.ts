import removeWatchLaterVideosFromPage from './removeWatchLaterVideosFromPage';
import { MSG, type RunState, type StatusPayload } from '../shared/constants';

declare global {
  interface Window {
    __watchLaterCleanupInjected?: boolean;
  }
}

if (!window.__watchLaterCleanupInjected) {
  window.__watchLaterCleanupInjected = true;

  let runState: RunState = 'idle';
  let processed = 0;
  let remaining = 0;
  let stopRequested = false;
  let errorMessage: string | undefined;

  const getStatus = (): StatusPayload => ({
    state: runState,
    processed,
    remaining,
    error: errorMessage,
  });

  const broadcastProgress = () => {
    chrome.runtime.sendMessage({ type: MSG.PROGRESS, payload: getStatus() }).catch(() => {});
  };

  const runLoop = async () => {
    try {
      runState = await removeWatchLaterVideosFromPage({
        shouldStop: () => stopRequested,
        onProgress: (p) => {
          processed = p.processed;
          remaining = p.remaining;
          broadcastProgress();
        },
      });
    } catch (e) {
      runState = 'error';
      errorMessage = e instanceof Error ? e.message : String(e);
    }
    broadcastProgress();
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message?.type) {
      case MSG.PING:
        sendResponse({ alive: true });
        return;
      case MSG.GET_STATUS:
        sendResponse(getStatus());
        return;
      case MSG.STOP:
        stopRequested = true;
        sendResponse(getStatus());
        return;
      case MSG.START:
        if (runState === 'running') {
          sendResponse(getStatus());
          return;
        }
        runState = 'running';
        processed = 0;
        stopRequested = false;
        errorMessage = undefined;
        remaining = document.querySelectorAll('ytd-playlist-video-renderer').length;
        sendResponse(getStatus());
        runLoop();
        return;
    }
  });
}
