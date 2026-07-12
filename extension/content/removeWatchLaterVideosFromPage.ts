import { waitForElement, waitForCountBelow, waitForMoreItems } from './domWait';
import removeYTPremiumPopup from './removeYTPremiumPopup';

const VIDEO_SELECTOR = 'ytd-playlist-video-renderer';
// Below this many rendered items, nudge YouTube's infinite-scroll loader in case
// there are more videos than what's currently in the DOM.
const LOW_WATERMARK = 5;

interface RunHandlers {
    shouldStop: () => boolean;
    onProgress: (p: { processed: number; remaining: number }) => void;
}

const removeWatchLaterVideosFromPage = async (handlers: RunHandlers): Promise<'done' | 'stopped'> => {
    let processed = 0;
    while (true) {
        if (handlers.shouldStop()) {
            return 'stopped';
        }

        let currentVideos = document.querySelectorAll(VIDEO_SELECTOR);

        // YouTube only renders a batch of videos at a time and loads more as you
        // scroll. Since we never scroll, nudge it once we're running low so long
        // playlists don't appear to "finish" early.
        if (currentVideos.length <= LOW_WATERMARK) {
            currentVideos[currentVideos.length - 1]?.scrollIntoView({ block: 'end' });
            await waitForMoreItems(VIDEO_SELECTOR, currentVideos.length);
            currentVideos = document.querySelectorAll(VIDEO_SELECTOR);
        }

        const length = currentVideos.length;
        if (length < 1) {
            return 'done';
        }

        // Always remove the top video: since removing one shifts the rest up,
        // the next video to process is always at index 0, not an advancing index.
        const currentVideo = currentVideos[0];
        console.log(`Processing top video (${length} remaining)`);

        try {
            const iconButton = currentVideo.querySelector('yt-icon-button');
            (iconButton as HTMLElement)?.click();
            await waitForElement('tp-yt-paper-listbox[id="items"]');
            if (handlers.shouldStop()) {
                return 'stopped';
            }
            console.log('Menu clicked, looking for remove option');

            const removeElement = Array.from(document.querySelectorAll('tp-yt-paper-item'))
                .find(el => el.textContent?.includes('Remove from'));
            (removeElement as HTMLElement)?.click();
            console.log('Removed top video');

            // Wait until the video count decreases, ensuring video is removed before moving on
            await waitForCountBelow(VIDEO_SELECTOR, length, 500);
            if (handlers.shouldStop()) {
                return 'stopped';
            }

            // Edge case where this likes to pop up for some reason
            removeYTPremiumPopup();
            processed++;
            handlers.onProgress({
                processed,
                remaining: document.querySelectorAll(VIDEO_SELECTOR).length,
            });
        } catch (error) {
            console.error(error);
        }
    }
};

export default removeWatchLaterVideosFromPage;
