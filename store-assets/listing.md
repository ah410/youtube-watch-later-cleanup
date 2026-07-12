# Chrome Web Store listing copy

## Title (max ~45 chars)
Watch Later Cleanup for YouTube

## Summary / short description (132-char limit)
Clear your entire YouTube Watch Later playlist in one click, right inside your own logged-in browser tab.

## Detailed description

Watch Later Cleanup removes every video from your YouTube Watch Later playlist
automatically, one at a time, so you don't have to click through hundreds of
"Remove from Watch Later" menus by hand.

**How it works**
1. Open your Watch Later playlist: youtube.com/playlist?list=WL
2. Click the Watch Later Cleanup icon in your toolbar.
3. Press Start. The extension removes videos one by one directly in that tab,
   exactly as if you clicked "Remove from Watch Later" yourself — using
   YouTube's own page, your own logged-in session, and YouTube's own servers.
4. Press Stop at any time to pause; reopen the popup later to check progress.

**Privacy and permissions**
- No data is collected, stored, or sent anywhere by this extension.
- No servers of ours are contacted — it only interacts with the YouTube tab
  you already have open.
- It only runs on the tab you click it on (`activeTab` permission), and only
  when you press Start — never in the background, never on other tabs.
- Fully open source: github.com/ah410/Remove-Watch-Later-Script

This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google.

## Category
Productivity (double-check the current category taxonomy in the live Developer
Dashboard at submission time — Google revises this list periodically).

## Single-purpose statement (Developer Dashboard field, separate from the public description)
Automatically removes all videos from the user's YouTube Watch Later playlist
when the user clicks the toolbar icon and presses Start.

## Permission justifications (Developer Dashboard field)
- `activeTab`: needed to read the current tab's URL (to confirm it's the
  Watch Later playlist) and to inject the removal script only into that tab,
  only when the user invokes the extension.
- `scripting`: needed to inject the removal script into the active tab on demand.
- No `host_permissions`, no remote code, no background collection of any kind.

## Assets to upload
- Store icon: `extension/icons/icon128.png`
- Small promo tile (required): `store-assets/promo-tile-440x280.png`
- Marquee promo tile (optional): `store-assets/marquee-1400x560.png`
- Screenshots: `store-assets/screenshot-1-idle-1280x800.png`,
  `screenshot-2-running-1280x800.png`, `screenshot-3-done-1280x800.png`

(Regenerate any of the above from their `.svg` source via `store-assets/generate.sh`
or `extension/icons/generate.sh`, which both use `rsvg-convert`.)

## Publishing checklist

This is a manual process only you can complete — it needs your own Google Developer
account and payment, which nothing here can do on your behalf.

1. Register a Chrome Web Store Developer account (one-time $5 fee) if you haven't already.
2. From the repo root: `npm run build:extension`, then zip only the runtime files —
   `manifest.json`, `dist/`, `popup/popup.html`, `popup/popup.css`, `icons/*.png`
   (exclude `.ts` sources, `.map` files, `icons/icon.svg`, and `generate.sh`).
3. Chrome Web Store Developer Dashboard → **New Item** → upload the zip.
4. Paste in the title/summary/description from this file; upload the screenshots and
   promo tile (+ marquee if you want one).
5. Fill in the single-purpose statement and permission justifications above; complete
   the data-usage disclosure (declare no data collected or sold).
6. Submit for review (typically hours to a few days).
7. Once approved, no separate Brave submission is needed — Brave installs extensions
   directly from the Chrome Web Store, so this one listing covers Brave, Chrome, and Edge.
8. Optionally add the live Web Store link to the root `README.md`.
