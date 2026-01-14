try {
    importScripts('utils.js'); 
} catch (e) {
    console.error(e);
}

//  Setup Context Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarize-selection",
        title: "Summarize this selection",
        contexts: ["selection"]
    });
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

//  Handle Rightclick
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarize-selection" && info.selectionText) {
        chrome.sidePanel.open({ tabId: tab.id });
        handleSummaryRequest(info.selectionText, "short");
    }
});

//  MAIN MESSAGE HANDLER
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    // Case A: Side Panel wants to scrape the page
    if (message.action === "summarize_full_page") {
        // Save the user's length preference for later
        chrome.storage.local.set({ 'preferredLength': message.length });

        chrome.scripting.executeScript({
            target: { tabId: message.tabId },
            files: ["src/scripts/content.js"]
        }, () => {
            chrome.tabs.sendMessage(message.tabId, { action: "scrape_page" });
        });
        return true; 
    }

    // Case B: Content Script returns the text
    if (message.action === "trigger_summary") {
        
        // Retrieve the length preference we saved earlier
        chrome.storage.local.get(['preferredLength'], (result) => {
            const length = result.preferredLength || "medium";
            handleSummaryRequest(message.text, length);
        });
        return true;
    }
});

//  API Handler
async function handleSummaryRequest(text, length) {
    // Tell Side Panel to show "Loading..."
    chrome.runtime.sendMessage({ action: "ui_loading" }).catch(() => {});

    try {
        const result = await generateSummary(text, length);
        
        // Send Result to Side Panel
        chrome.runtime.sendMessage({ 
            action: "display_summary", 
            text: result 
        }).catch((err) => {
            console.log("Side panel might be closed, could not display result.");
        });

    } catch (error) {
        console.error(error);
    }
}