chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scrape_page") {
    
    // Clone body to act safely
    const clone = document.body.cloneNode(true);

    // Remove Noise
    const junkSelectors = [
      'script', 'style', 'noscript', 'iframe', 
      'nav', 'footer', 'header', 'aside', 
      '[aria-hidden="true"]'
    ];
    
    junkSelectors.forEach(selector => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Extract & Clean Text
    let cleanText = clone.innerText || "";
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    // Send back to Extension (Side Panel)
    chrome.runtime.sendMessage({
      action: "trigger_summary",
      text: cleanText.substring(0, 10000), // Cap at 10k chars for API limits
      source: "full_page"
    });
  }
});