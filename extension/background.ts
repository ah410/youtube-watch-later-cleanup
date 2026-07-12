const WATCH_LATER_URL_PATTERN = /^https:\/\/www\.youtube\.com\/playlist\?list=WL/;

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id || !tab.url || !WATCH_LATER_URL_PATTERN.test(tab.url)) {
        chrome.action.setBadgeText({ text: '✗', tabId: tab.id });
        setTimeout(() => chrome.action.setBadgeText({ text: '', tabId: tab.id }), 2000);
        console.warn('Not on the Watch Later page (https://www.youtube.com/playlist?list=WL) - skipping.');
        return;
    }

    chrome.action.setBadgeText({ text: '…', tabId: tab.id });
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['dist/content/content.js'],
        });
    } finally {
        chrome.action.setBadgeText({ text: '', tabId: tab.id });
    }
});
