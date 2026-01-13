// 1. Setup Context Menu & Panel Behavior
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-selection",
    title: "Summarize this selection",
    contexts: ["selection"]
  });
  
  // Force click on icon to open Side Panel
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// 2. Handle Right-Click Event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-selection" && info.selectionText) {
    
    // Open the Side Panel
    chrome.sidePanel.open({ tabId: tab.id });
    
    // Send text to Side Panel (with delay to ensure panel opens)
    setTimeout(() => {
        chrome.runtime.sendMessage({
            action: "trigger_summary",
            text: info.selectionText,
            source: "selection"
        });
    }, 500);
  }
});

// 3. Handle "Full Page" Request from Side Panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarize_full_page") {
    
    // Inject content script to read page
    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      files: ["src/scripts/content.js"]
    }, () => {
        // Ask content script to scrape
        chrome.tabs.sendMessage(message.tabId, { action: "scrape_page" });
    });
  }
});