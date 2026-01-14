chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // 1. Logic to Scrape the WHOLE Page
  if (message.action === "scrape_page") {
    const clone = document.body.cloneNode(true);
    const junkSelectors = ['script', 'style', 'noscript', 'iframe', 'nav', 'footer', 'header', 'aside'];
    junkSelectors.forEach(sel => clone.querySelectorAll(sel).forEach(el => el.remove()));
    
    let cleanText = clone.innerText || "";
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    chrome.runtime.sendMessage({
      action: "trigger_summary",
      text: cleanText.substring(0, 8000), // Cap length
      source: "full_page"
    });
  }

  // 2. Logic to Get SELECTED Text (New Feature)
  if (message.action === "get_selection") {
    const selection = window.getSelection().toString().trim();
    
    if (selection.length > 0) {
      chrome.runtime.sendMessage({
        action: "trigger_summary",
        text: selection,
        source: "selection"
      });
    } else {
      // Tell Side Panel that nothing was selected
      chrome.runtime.sendMessage({
        action: "display_summary",
        text: "Error: No text selected. Please highlight some text on the webpage first."
      });
    }
  }
});