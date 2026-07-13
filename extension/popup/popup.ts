import { MSG, WATCH_LATER_URL_PATTERN, type StatusPayload } from '../shared/constants';

const statusEl = document.getElementById('status') as HTMLDivElement;
const statusTextEl = document.getElementById('status-text') as HTMLSpanElement;
const toggleEl = document.getElementById('toggle') as HTMLButtonElement;

let currentTabId: number | undefined;
let currentState: StatusPayload['state'] = 'idle';

const renderWrongPage = () => {
  statusEl.dataset.state = 'idle';
  statusTextEl.textContent = 'Open your Watch Later playlist to use this.';
  toggleEl.disabled = true;
};

const renderStatus = (status: StatusPayload) => {
  currentState = status.state;
  statusEl.dataset.state = status.state;
  toggleEl.disabled = false;

  switch (status.state) {
    case 'idle':
      statusTextEl.textContent = 'Ready';
      toggleEl.textContent = 'Start';
      toggleEl.dataset.running = 'false';
      break;
    case 'running':
      statusTextEl.textContent = `Removing videos… (${status.processed} removed)`;
      toggleEl.textContent = 'Stop';
      toggleEl.dataset.running = 'true';
      break;
    case 'done':
      statusTextEl.textContent = `Done — removed ${status.processed} videos`;
      toggleEl.textContent = 'Start';
      toggleEl.dataset.running = 'false';
      break;
    case 'stopped':
      statusTextEl.textContent = `Stopped — removed ${status.processed} videos so far`;
      toggleEl.textContent = 'Start';
      toggleEl.dataset.running = 'false';
      break;
    case 'error':
      statusTextEl.textContent = `Error: ${status.error ?? 'unknown error'}`;
      toggleEl.textContent = 'Start';
      toggleEl.dataset.running = 'false';
      break;
  }
};

const ensureContentScriptInjected = async (tabId: number) => {
  try {
    await chrome.tabs.sendMessage(tabId, { type: MSG.PING });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['dist/content/content.js'],
    });
  }
};

const init = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url || !WATCH_LATER_URL_PATTERN.test(tab.url)) {
    renderWrongPage();
    return;
  }

  currentTabId = tab.id;
  await ensureContentScriptInjected(tab.id);
  const status = (await chrome.tabs.sendMessage(tab.id, { type: MSG.GET_STATUS })) as StatusPayload;
  renderStatus(status);
};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === MSG.PROGRESS && sender.tab?.id === currentTabId) {
    renderStatus(message.payload as StatusPayload);
  }
});

toggleEl.addEventListener('click', async () => {
  if (currentTabId == null) {
    return;
  }
  const type = currentState === 'running' ? MSG.STOP : MSG.START;
  toggleEl.disabled = true;
  const status = (await chrome.tabs.sendMessage(currentTabId, { type })) as StatusPayload;
  renderStatus(status);
});

init();
