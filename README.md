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
4. Click the extension's toolbar icon to open the popup, then press **Start**. It removes
   videos one at a time until the playlist is empty, with live progress shown in the popup
   and as a badge on the toolbar icon. Press **Stop** at any time to pause.

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

## Architecture

```
extension/
  manifest.json        MV3 manifest — activeTab + scripting only, no host_permissions
  background.ts        passive relay: reflects progress as a toolbar badge
  content/
    content.ts          message listener + injection guard (entry point)
    removeWatchLaterVideosFromPage.ts   the removal loop
    removeYTPremiumPopup.ts             dismisses the YT Premium upsell popup
    domWait.ts           MutationObserver-based DOM wait helpers
  popup/
    popup.html/css/ts    the toolbar popup UI (Tailwind CSS)
  shared/
    constants.ts         message-type strings + shared types, imported by all three entry points
  icons/                 extension icon (SVG source + generated PNGs)
store-assets/            Chrome Web Store listing images + copy — not shipped in the extension
```

**Why a browser extension at all**: an earlier Playwright-based approach (see
[`legacy/README.md`](legacy/README.md)) drove a separate, automation-controlled browser,
which Google's login system detects and blocks even with valid session cookies. A better 
method is to use the user's own already-authenticated browser via browser extension.

**Messaging**: adding a popup means `chrome.action.onClicked` never fires (a popup takes
over the toolbar click), so the three contexts — popup, background, content — talk over
two separate channels:

- `chrome.tabs.sendMessage` — targeted request/response between the popup and the content
  script: `ping` (is a listener already injected?), `getStatus` (sync the UI on open),
  `start`, `stop`.
- `chrome.runtime.sendMessage` — an untargeted broadcast the content script sends after
  every processed video. The background service worker always receives it (MV3 wakes
  service workers on incoming messages) and updates the toolbar badge; the popup only
  receives it while open, to update its live status line.

`content.ts` guards its own injection with a `window.__watchLaterCleanupInjected` flag, so
if the popup re-injects it (e.g. a ping race) it doesn't register a second competing
listener. The flag naturally resets on every page load/navigation.

**Removal algorithm**: the loop always removes the video at index 0, not an advancing
index. I came across this issue where removing a video keeps going down the visible page, 
eventually going offscreen and stopping at 50 videos removed. Index 0 ensures the next video 
to process is always at the top. YouTube also only renders a batch of the playlist into the DOM at
a time and loads more as you scroll; since the loop never scrolls on its own, it nudges
YouTube's infinite-scroll loader (`waitForMoreItems` in `domWait.ts`) once the rendered
count runs low, so long playlists don't appear to finish early.

**Build**: `npm run build:extension` runs `tsc --noEmit` for type-checking, then esbuild
bundles the three TypeScript entry points (`background.ts`, `content/content.ts`,
`popup/popup.ts`) into `extension/dist/`, then the Tailwind CLI compiles `popup.css`
separately into the same `dist/` tree. `extension/tsconfig.json` is scoped to the DOM lib
and kept separate from the root `tsconfig.json`, which targets Node for the `legacy/` CLI.
