import { storeHighlight, getHighlights, removeHighlight } from './js/storage.js';

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'saveHighlight':
      storeHighlight(request.data)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Indicates async response

    case 'getHighlights':
      getHighlights()
        .then(highlights => sendResponse({ highlights }))
        .catch(error => sendResponse({ error: error.message }));
      return true; // Indicates async response

    case 'removeHighlight':
      removeHighlight(request.id)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Indicates async response

    case 'summarizeHighlights':
      // This would call the OpenAI API if implemented
      sendResponse({ message: 'Summarization not implemented yet' });
      return false;
  }
});