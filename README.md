# Remove-Watch-Later-Script
Instead of manually removing videos one by one in your watch later, use this script to do it for you!

## Recommended: Browser Extension (Brave / Chrome / Edge)

The extension runs inside your own already-logged-in browser tab, so there's no cookie
scraping or separate automated browser involved.

1. Build it: `npm install` then `npm run build:extension` (outputs to `extension/dist/`).
2. Load it unpacked:
   - Go to `brave://extensions` (or `chrome://extensions` / `edge://extensions`).
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `extension/` folder.
3. Navigate to your [Watch Later playlist](https://www.youtube.com/playlist?list=WL).
4. Click the extension's toolbar icon. It removes videos one at a time until the playlist is empty.
   Progress and any errors are logged to that tab's DevTools console.

The extension only requests `activeTab` + `scripting` permissions — it doesn't read your
cookies or run in the background on pages you haven't clicked it on.

### Why not automate a separate browser instead?

An earlier version of this project scraped Firefox session cookies and drove a
Playwright-controlled browser. That approach is kept in [`legacy/`](legacy/README.md) for
reference, but it doesn't work: Google's login system detects the automated browser and
blocks the sign-in flow with a 403, even with valid cookies injected. Running the removal
logic inside your real browser session (as the extension does) sidesteps that entirely.

## Supported

- **Browser extension**: Brave, Chrome, Edge (Chromium-based, Manifest V3)
- **Legacy CLI**: Linux Firefox (non-functional — see above)
