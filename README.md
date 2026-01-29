# Remove-Watch-Later-Script
Instead of manually removing videos one by one in your watch later, use this script to do it for you!

## Before Installation (Optional for Linux Firefox Users)
1. Export your cookies from [YouTube.com](https://www.youtube.com) to a `cookies.json` file
- I used this [extension](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) from the Firefox extensions store so I didn't have to make my own exporter
- If you find another way to grab your cookies, make sure you are getting your cookies from https://www.youtube.com and not https://accounts.youtube.com. Both of these show up under Inspect -> Storage -> Cookies so you want to grab the correct cookies.
2. Place your `cookies.json` file in the root directory after you `git clone` this repo. Follow the installation steps below.

## Installation
```
git clone https://github.com/ah410/remove-watch-later-script.git
npm install
npm start
```

## Improvements

Working toward automatic cookie scraping so users no longer need to manually place `cookies.json` in the project root.

### Supported
- **Linux** - Firefox

### Planned
- **Linux** - Google Chrome, Brave  
- **Windows** - Firefox, Google Chrome, Brave

## Automatic cookie-scraping (high-level)
1. If `cookies.json` exists, use it and skip scraping.  
2. Locate the Firefox profile and `cookies.sqlite`.  
3. Query `moz_cookies` for YouTube rows.  
4. Convert rows to Playwright cookie format.  
5. Launch the browser and add cookies to the context.  
6. Navigate to the Watch Later page (`https://www.youtube.com/playlist?list=WL`).  
7. Iterate playlist items and remove videos one-by-one.  
8. Close the browser.
