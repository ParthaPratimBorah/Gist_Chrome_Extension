document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const outputContent = document.getElementById('outputContent');
  const radioButtons = document.getElementsByName('length');

  // 1. Handle "Summarize Page" Click
  summarizeBtn.addEventListener('click', async () => {
    let selectedLength = 'short';
    for (const radio of radioButtons) {
      if (radio.checked) {
        selectedLength = radio.value;
        break;
      }
    }

    updateUIState('loading');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.runtime.sendMessage({ 
      action: "summarize_full_page", 
      tabId: tab.id,
      length: selectedLength 
    }, (response) => {
        if (chrome.runtime.lastError) {
            updateUIState('error', "Error: Could not connect to page. Try refreshing the webpage.");
        }
    });
  });

  // 2. Listen for Incoming Summaries
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // A. Trigger from Background/Content (Selected Text or Scraped Page)
    if (message.action === "trigger_summary") {
      
      updateUIState('loading');
      
      let selectedLength = 'short';
      for (const radio of radioButtons) {
        if (radio.checked) selectedLength = radio.value;
      }
      
      // Call the AI (from utils.js)
      try {
        const summaryText = await generateSummary(message.text, selectedLength);
        
        // Show result
        updateUIState('success', summaryText);
      } catch (err) {
        updateUIState('error', "AI Error: " + err.message);
      }
    }
  });

  // Helper: Manage UI States
  function updateUIState(state, text = "") {
    if (state === 'loading') {
      summarizeBtn.disabled = true;
      summarizeBtn.querySelector('.btn-text').textContent = "Processing...";
      outputContent.innerHTML = `<p style="color:var(--text-muted); text-align:center;">Analyzing content...</p>`;
    } else if (state === 'success') {
      summarizeBtn.disabled = false;
      summarizeBtn.querySelector('.btn-text').textContent = "Summarize Page";
      outputContent.innerHTML = `<p>${text}</p>`; 
    } else if (state === 'error') {
      summarizeBtn.disabled = false;
      summarizeBtn.querySelector('.btn-text').textContent = "Summarize Page";
      outputContent.innerHTML = `<p style="color:red;">${text}</p>`;
    }
  }
});