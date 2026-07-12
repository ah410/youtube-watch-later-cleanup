import { waitForElement, waitForCountBelow } from './domWait';
import removeYTPremiumPopup from './removeYTPremiumPopup';

const removeWatchLaterVideosFromPage = async (): Promise<void> => {
    let processedVideos = 0;
    while (true) {
        const currentVideos = document.querySelectorAll('ytd-playlist-video-renderer');
        const length = currentVideos.length;
        if (length < 1) {
            break;
        }

        const currentVideo = currentVideos[processedVideos];
        if (!currentVideo) {
            console.log(`Video ${processedVideos + 1} is undefined, skipping`);
            continue;
        }
        console.log(`Processing video ${processedVideos + 1} of ${length}`);

        try {
            const iconButton = currentVideo.querySelector('yt-icon-button');
            (iconButton as HTMLElement)?.click();
            await waitForElement('tp-yt-paper-listbox[id="items"]');
            console.log(`Menu clicked for video ${processedVideos + 1}, looking for remove option`);

            const removeElement = Array.from(document.querySelectorAll('tp-yt-paper-item'))
                .find(el => el.textContent?.includes('Remove from'));
            (removeElement as HTMLElement)?.click();
            console.log(`Removed video ${processedVideos + 1}`);

            // Wait until the video count decreases, ensuring video is removed before moving on
            await waitForCountBelow('ytd-playlist-video-renderer', length, 500);
            console.log(`Finished processing video ${processedVideos + 1}`);

            // Edge case where this likes to pop up for some reason
            removeYTPremiumPopup();
            processedVideos++;
        } catch (error) {
            console.error(error);
        }
    }

    console.log("\nRemoved all videos from Watch Later!\n");
};

export default removeWatchLaterVideosFromPage;
