import type { Page } from "playwright";

const removeYTPremiumPopup = async (page: Page) => {
    await page.evaluate(() => {
        document.querySelectorAll("span.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap")
            .forEach(span => {
                if (span.textContent.trim() === "Not now") {
                    (span as HTMLElement).click()
                }
            });
        console.log('Removed YouTube Premium popup from DOM');
    });
}

export default removeYTPremiumPopup;