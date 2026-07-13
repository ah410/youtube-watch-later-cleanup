import { firefox } from 'playwright';
import removeYTPremiumPopup from './utils/removeYTPremiumPopup.ts';
import grabCookiesFromLocalStorage from './utils/grabCookiesFromLocalStorage.ts';

const WATCH_LATER_URL = 'https://www.youtube.com/playlist?list=WL';

const removeWatchLaterVideos = async () => {
  const cookies = await grabCookiesFromLocalStorage();

  const [browser, page] = await navigateToWatchLaterPage(cookies);

  await removeWatchLaterVideosFromPage(page);

  await browser.close();
};

const navigateToWatchLaterPage = async (cookies: any[]): Promise<[any, any]> => {
  const browser = await firefox.launch({
    headless: false, // Allows viewing the browser while running the script
  });

  const context = await browser.newContext();
  await context.addCookies(cookies);
  console.log('Added cookies to browser context.');
  const watchLaterPage = await context.newPage();
  await watchLaterPage.goto(WATCH_LATER_URL);
  await watchLaterPage.waitForSelector('ytd-playlist-video-renderer');
  console.log('YouTube Watch Later page fully loaded');

  return [browser, watchLaterPage];
};

const removeWatchLaterVideosFromPage = async (page: any): Promise<void> => {
  let processedVideos = 0;
  while (true) {
    const currentVideos = await page.locator('ytd-playlist-video-renderer').all();
    const length = currentVideos.length;
    if (currentVideos.length < 1) {
      break;
    }

    const currentVideo = currentVideos[processedVideos];
    if (!currentVideo) {
      processedVideos = 0;
      continue;
    }
    console.log(`Processing video ${processedVideos + 1} of ${currentVideos.length}`);

    try {
      const iconButton = currentVideo.locator('yt-icon-button');
      await iconButton.click();
      await page.waitForSelector('tp-yt-paper-listbox[id="items"]');
      console.log(`Menu clicked for video ${processedVideos + 1}, looking for remove option`);

      const removeElement = page.locator('tp-yt-paper-item', {
        hasText: 'Remove from',
      });
      await removeElement.click();
      console.log(`Removed video ${processedVideos + 1}`);

      // Wait until the video count decreases, ensuring video is removed before moving on
      await page.waitForFunction(
        (prevLen) => {
          return document.querySelectorAll('ytd-playlist-video-renderer').length < prevLen;
        },
        length,
        { timeout: 500 },
      );
      console.log(`Finished processing video ${processedVideos + 1}`);

      // Edge case where this likes to pop up for some reason
      await removeYTPremiumPopup(page);
      processedVideos++;
    } catch (error) {
      console.error(error);
    }
  }

  console.log('\nRemoved all videos from Watch Later!\n');
};

// Default profile path getter (not currently working)
// const getFirefoxDefaultProfilePath = (): string => {
//     const firefoxPath = path.join(os.homedir(), '.mozilla', 'firefox');
//     const defaultProfileDir = fs.readdirSync(firefoxPath).filter(name => name.endsWith('.default-release'))[0];
//     if (!defaultProfileDir) {
//         throw new Error(`No Firefox default-release profile found in ${firefoxPath}`);
//     }
//     console.log("Default profile directory found: " + defaultProfileDir.toString());
//     return path.join(firefoxPath, defaultProfileDir.toString());
// }

// Run the program
removeWatchLaterVideos();
