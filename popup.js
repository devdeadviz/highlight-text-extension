import { getHighlights, removeHighlight } from './js/storage.js';
import { formatDate, truncateText } from './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const highlightsContainer = document.getElementById('highlights-container');
  const emptyState = document.getElementById('empty-state');
  const loading = document.getElementById('loading');
  const summaryContainer = document.getElementById('summary-container');
  const summaryContent = document.getElementById('summary-content');
  // const summarizeBtn = document.getElementById('summarize-btn');
  const backToHighlightsBtn = document.getElementById('back-to-highlights');
  const apiKeyModal = document.getElementById('api-key-modal');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveApiKeyBtn = document.getElementById('save-api-key');
  const cancelApiKeyBtn = document.getElementById('cancel-api-key');
  
  // State
  let highlights = [];
  let apiKey = '';
  
  // Load highlights when popup opens
  loadHighlights();
  
  // Event listeners
  // summarizeBtn.addEventListener('click', handleSummarize);
  backToHighlightsBtn.addEventListener('click', showHighlights);
  saveApiKeyBtn.addEventListener('click', saveApiKey);
  cancelApiKeyBtn.addEventListener('click', hideApiKeyModal);
  
  // Load saved highlights
  function loadHighlights() {
    loading.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    getHighlights()
      .then(result => {
        highlights = result;
        renderHighlights();
        loading.classList.add('hidden');
        
        if (highlights.length === 0) {
          emptyState.classList.remove('hidden');
        }
      })
      .catch(error => {
        console.error('Error loading highlights:', error);
        loading.classList.add('hidden');
        emptyState.classList.remove('hidden');
      });
  }
  
  // Render all highlights
  function renderHighlights() {
    // Clear previous highlights
    const existingHighlights = highlightsContainer.querySelectorAll('.highlight-card');
    existingHighlights.forEach(el => el.remove());
    
    // Add new highlights
    highlights.forEach(highlight => {
      const card = createHighlightCard(highlight);
      highlightsContainer.appendChild(card);
    });
  }
  
  // Create a single highlight card
  function createHighlightCard(highlight) {
    const card = document.createElement('div');
    card.className = 'highlight-card';
    card.id = `highlight-${highlight.id}`;
    
    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = highlight.text;
    
    const meta = document.createElement('div');
    meta.className = 'meta';
    
    const source = document.createElement('div');
    source.className = 'source';
    source.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      <span title="${highlight.pageTitle}">${truncateText(highlight.pageTitle, 30)}</span>
    `;
    
    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = formatDate(highlight.timestamp);
    
    meta.appendChild(source);
    meta.appendChild(date);
    
    const actions = document.createElement('div');
    actions.className = 'actions';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteBtn.title = 'Delete highlight';
    
    // Delete highlight on click
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteHighlight(highlight.id);
    });
    
    // Open source page on click
    card.addEventListener('click', () => {
      chrome.tabs.create({ url: highlight.pageUrl });
    });
    
    actions.appendChild(deleteBtn);
    
    card.appendChild(text);
    card.appendChild(meta);
    card.appendChild(actions);
    
    return card;
  }
  
  // Handle delete highlight
  function handleDeleteHighlight(id) {
    const card = document.getElementById(`highlight-${id}`);
    
    // Animate removal
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    card.style.height = `${card.offsetHeight}px`;
    
    setTimeout(() => {
      card.style.height = '0';
      card.style.margin = '0';
      card.style.padding = '0';
      
      setTimeout(() => {
        removeHighlight(id)
          .then(() => {
            // Remove from local state
            highlights = highlights.filter(h => h.id !== id);
            
            // Show empty state if no highlights left
            if (highlights.length === 0) {
              emptyState.classList.remove('hidden');
            }
          })
          .catch(error => {
            console.error('Error deleting highlight:', error);
          });
      }, 200);
    }, 100);
  }
  
  // Handle summarize button click
  // function handleSummarize() {
  //   // Check if we have an API key
  //   chrome.storage.local.get(['openaiApiKey'], (result) => {
  //     if (result.openaiApiKey) {
  //       apiKey = result.openaiApiKey;
  //       showSummary();
  //     } else {
  //       showApiKeyModal();
  //     }
  //   });
  // }
  
  // Show API key modal
  function showApiKeyModal() {
    apiKeyModal.classList.add('show');
  }
  
  // Hide API key modal
  function hideApiKeyModal() {
    apiKeyModal.classList.remove('show');
  }
  
  // Save API key
  function saveApiKey() {
    const key = apiKeyInput.value.trim();
    
    if (key) {
      chrome.storage.local.set({ openaiApiKey: key }, () => {
        apiKey = key;
        hideApiKeyModal();
        showSummary();
      });
    }
  }
  
  // Show summary view
  function showSummary() {
    // Hide highlights, show summary
    highlightsContainer.classList.add('hidden');
    summaryContainer.classList.remove('hidden');
    
    // If we have highlights and an API key, get summary
    if (highlights.length > 0 && apiKey) {
      summaryContent.innerHTML = '<p>Generating summary...</p>';
      
      // This would call the OpenAI API if implemented
      // For now, just show a placeholder
      setTimeout(() => {
        summaryContent.innerHTML = '<p>Summary functionality not implemented yet. This would call the OpenAI API to generate a summary of your highlights.</p>';
      }, 1500);
    } else {
      summaryContent.innerHTML = '<p>No highlights to summarize.</p>';
    }
  }
  
  // Show highlights view
  function showHighlights() {
    summaryContainer.classList.add('hidden');
    highlightsContainer.classList.remove('hidden');
  }
});