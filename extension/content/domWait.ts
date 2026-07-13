export const waitForElement = (selector: string, timeoutMs = 30000): Promise<Element> => {
  const existing = document.querySelector(selector);
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(found);
      }
    });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for selector "${selector}"`));
    }, timeoutMs);

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

// Best-effort: nudges YouTube's infinite-scroll loader and waits for more items to
// appear, but resolves on timeout instead of rejecting since it's optional, not a hard wait.
export const waitForMoreItems = (
  selector: string,
  currentCount: number,
  timeoutMs = 3000,
): Promise<void> => {
  if (document.querySelectorAll(selector).length > currentCount) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(selector).length > currentCount) {
        observer.disconnect();
        clearTimeout(timer);
        resolve();
      }
    });

    const timer = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeoutMs);

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

export const waitForCountBelow = (
  selector: string,
  length: number,
  timeoutMs: number,
): Promise<void> => {
  if (document.querySelectorAll(selector).length < length) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(selector).length < length) {
        observer.disconnect();
        clearTimeout(timer);
        resolve();
      }
    });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for "${selector}" count to drop below ${length}`));
    }, timeoutMs);

    observer.observe(document.body, { childList: true, subtree: true });
  });
};
