// Generate a unique ID for each highlight
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Store a highlight in chrome.storage.local
export async function storeHighlight(highlight) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || [];
      
      // Add ID and timestamp if not present
      const newHighlight = {
        ...highlight,
        id: highlight.id || generateId(),
        timestamp: highlight.timestamp || new Date().toISOString()
      };
      
      // Add to beginning of array
      highlights.unshift(newHighlight);
      
      // Save updated highlights
      chrome.storage.local.set({ highlights }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(newHighlight);
        }
      });
    });
  });
}

// Get all highlights from storage
export async function getHighlights() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['highlights'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.highlights || []);
      }
    });
  });
}

// Remove a highlight by ID
export async function removeHighlight(id) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || [];
      
      // Filter out the highlight to remove
      const updatedHighlights = highlights.filter(h => h.id !== id);
      
      // Save updated highlights
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
}