import { MSG, type StatusPayload } from './shared/constants';

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== MSG.PROGRESS) {
    return;
  }
  const tabId = sender.tab?.id;
  if (tabId == null) {
    return;
  }

  const { state, remaining } = message.payload as StatusPayload;
  switch (state) {
    case 'running':
      chrome.action.setBadgeBackgroundColor({ color: '#1a73e8', tabId });
      chrome.action.setBadgeText({ text: String(remaining), tabId });
      break;
    case 'done':
      chrome.action.setBadgeBackgroundColor({ color: '#188038', tabId });
      chrome.action.setBadgeText({ text: '✓', tabId });
      setTimeout(() => chrome.action.setBadgeText({ text: '', tabId }), 3000);
      break;
    case 'stopped':
      chrome.action.setBadgeText({ text: '', tabId });
      break;
    case 'error':
      chrome.action.setBadgeBackgroundColor({ color: '#d93025', tabId });
      chrome.action.setBadgeText({ text: '!', tabId });
      break;
  }
});
