// Create and show the selection popup
function createSelectionPopup(x, y, onSave) {
  const popup = document.createElement("div");
  popup.className = "highlight-popup";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Highlight";
  saveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onSave();
    removeSelectionPopup();
  });

  popup.appendChild(saveBtn);

  // Position the popup near the selection
  popup.style.left = `${x}px`;
  popup.style.top = `${y + window.scrollY + 20}px`;

  // Make sure popup doesn't go off-screen
  setTimeout(() => {
    const rect = popup.getBoundingClientRect();

    if (rect.right > window.innerWidth) {
      popup.style.left = `${window.innerWidth - rect.width - 20}px`;
    }

    if (rect.bottom > window.innerHeight) {
      popup.style.top = `${y + window.scrollY - rect.height - 10}px`;
    }

    // Show the popup with animation
    popup.classList.add("show");
  }, 10);

  return popup;
}

// Remove the selection popup
function removeSelectionPopup() {
  const popup = document.querySelector(".highlight-popup");

  if (popup) {
    popup.classList.remove("show");

    // Wait for animation to complete before removing
    setTimeout(() => {
      popup.remove();
    }, 200);
  }
}

let currentSelection = null;
let selectionPopup = null;

// Listen for text selection
document.addEventListener("mouseup", (event) => {
  // Remove any existing selection popup
  removeSelectionPopup();

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // If there's a valid text selection
  if (selectedText.length > 0) {
    currentSelection = {
      text: selectedText,
      pageUrl: window.location.href,
      pageTitle: document.title,
      timestamp: new Date().toISOString(),
    };

    // Create and show the selection popup
    selectionPopup = createSelectionPopup(event.clientX, event.clientY, () => {
      saveHighlight(currentSelection);
    });

    document.body.appendChild(selectionPopup);
  }
});

// Remove popup when clicking elsewhere
document.addEventListener("mousedown", (event) => {
  // Check if click is outside the popup
  if (selectionPopup && !selectionPopup.contains(event.target)) {
    removeSelectionPopup();
  }
});

// Save highlight to storage
function saveHighlight(highlight) {
  chrome.runtime.sendMessage(
    { action: "saveHighlight", data: highlight },
    (response) => {
      if (response && response.success) {
        showSavedNotification();
      }
    }
  );
}

// Show a brief "Saved!" notification
function showSavedNotification() {
  const notification = document.createElement("div");
  notification.className = "highlight-saved-notification";
  notification.textContent = "Highlight saved!";

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after animation
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}
