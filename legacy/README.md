# Legacy: Playwright + cookie-scraping approach

This was the original automation approach: scrape session cookies out of the
user's local Firefox profile (`utils/grabCookiesFromLocalStorage.ts` →
`utils/transformCookies.ts`) and inject them into a fresh Playwright-controlled
Firefox instance (`ytWatchLaterPlaylistCleanup.ts`), then drive the removal
loop via Playwright locators.

It's kept here for reference, but **it doesn't work**: cookie injection itself
succeeds (the real session cookies land in the browser context correctly), but
Google's login system detects the Playwright-driven browser as automated
(`navigator.webdriver === true`, plus deeper TLS/fingerprint signals) and
refuses to treat the injected session as logged in. YouTube redirects to
Google's sign-in flow, which Google then hard-blocks with a 403. Patching
`navigator.webdriver` didn't help, and reusing the real Firefox profile via
`launchPersistentContext` fails outright because Playwright's bundled Firefox
build refuses to open a profile "last used with a newer version of this
application."

The working approach is the browser extension in [`../extension`](../extension) —
see the root [README](../README.md).
