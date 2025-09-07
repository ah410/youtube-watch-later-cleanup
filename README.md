# Remove-Watch-Later-Script
Instead of manually removing videos one by one in your watch later, use this script to do it for you!

## Before Installation
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

## Potential Improvements
I had tried to make it so the script just grabs your user directory for Chrome so you didn't have to do any manual work for getting your authentication setup in the Playwright browser but I just couldn't get it to work so that's why there is a little manual work at the beginnging to get your cookies setup. Eventually, the plan is to make this as seamless as possible where it automatically checks your system for installed browsers and grabs the cookies from your filesystem.