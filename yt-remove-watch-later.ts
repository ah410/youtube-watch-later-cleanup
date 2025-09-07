import { firefox } from 'playwright';
import rawCookies from './cookies.json' with { type: "json" };

const WATCH_LATER_URL = 'https://www.youtube.com/playlist?list=WL';

// Transform cookies to match Playwright's expected format
const transformCookies = (cookies: any[]) => {
  const transformedCookies = cookies.map(cookie => {
    let sameSite = cookie.sameSite;

    if (cookie.sameSite == null || cookie.sameSite == "no_restriction") {
      sameSite = "Lax";
    }

    return {
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expirationDate,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: sameSite
    }
  });

  return transformedCookies;
}
const cookies = transformCookies(rawCookies);

const launchBrowser = async () => {
    // 1. Load the Watch Later page
    const browser = await firefox.launch({
        headless: false, // Shows the browser for debugging
    });

    const context = await browser.newContext();
    await context.addCookies(cookies);

    const page = await context.newPage();
    await page.goto(WATCH_LATER_URL);

    // 2. Grab the set of visible videos (no extra scroll)
    //        Find 'button[aria-label="Action menu"]' within <ytd-playlist-video-renderer> HTML element
    //        Click it


    // 3. Remove them one by one
    //      Find the remove watch later HTML element
    //      Click it


    // 4. Once count < 1, reload the page


    // 5. Repeat until no more videos left
};

// Run the program
launchBrowser().catch(console.error);
