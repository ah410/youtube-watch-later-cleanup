import { firefox } from 'playwright';
import rawCookies from './cookies.json' with { type: "json" };
import transformCookies from './utils/transformCookies.ts';
import removeYTPremiumPopup from './utils/removeYTPremiumPopup.ts';

const WATCH_LATER_URL = 'https://www.youtube.com/playlist?list=WL';

// Format cookies to the correct format for Playwright
const cookies = transformCookies(rawCookies);

const removeWatchLaterVideos = async () => {
    // 1. Load the Watch Later page along with the proper cookies
    const browser = await firefox.launch({
        headless: false, // Shows the browser for debugging
    });
    console.log("Opened browser");

    const context = await browser.newContext();
    await context.addCookies(cookies);
    console.log("Added cookies");

    const page = await context.newPage();
    await page.goto(WATCH_LATER_URL);
    console.log("Went to watch later page");

    await page.waitForSelector('ytd-playlist-video-renderer');
    console.log("Page fully loaded");

    // 2. Remove your Watch Later videos one by one
    let processedVideos = 0;
    while (true) {
        const currentVideos = await page.locator('ytd-playlist-video-renderer').all();
        const length = currentVideos.length;
        if (currentVideos.length < 1) {
            break;
        }
        
        const currentVideo = currentVideos[processedVideos];
        if (!currentVideo) {
            console.log(`Video ${processedVideos + 1} is undefined, skipping`);
            continue;
        }
        console.log(`Processing video ${processedVideos + 1} of ${currentVideos.length}`);

        try {
            const iconButton = currentVideo.locator('yt-icon-button');
            await iconButton.click();
            await page.waitForSelector('tp-yt-paper-listbox[id="items"]');
            console.log(`Menu clicked for video ${processedVideos + 1}, looking for remove option`);

            // Remove the current video from Watch Later
            const removeElement = page.locator('tp-yt-paper-item', {
                hasText: "Remove from"
            });
            await removeElement.click();
            console.log(`Clicked remove button for video ${processedVideos + 1}`);

            // Wait until the video count decreases, ensuring video is removed before moving on
            await page.waitForFunction((originalCount) => {
                return document.querySelectorAll('ytd-playlist-video-renderer').length < originalCount;
            }, length, { timeout: 5000 });
            console.log(`Finished processing video ${processedVideos + 1}`);

            // Edge case where this likes to pop up for some reason
            removeYTPremiumPopup(page);
            processedVideos++;
        } catch (error) {
            console.error(error);
        }
    }

    console.log("\nRemoved all videos from Watch Later!\n");
};

// Run the program
removeWatchLaterVideos();
