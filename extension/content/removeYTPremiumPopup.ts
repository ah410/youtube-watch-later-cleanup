const removeYTPremiumPopup = () => {
    document.querySelectorAll("span.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap")
        .forEach(span => {
            if (span.textContent?.trim() === "Not now") {
                (span as HTMLElement).click();
            }
        });
};

export default removeYTPremiumPopup;
