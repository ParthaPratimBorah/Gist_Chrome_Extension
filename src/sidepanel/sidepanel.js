document.addEventListener('DOMContentLoaded', () => {
  const btnFullPage = document.getElementById('btnFullPage');
  const btnSelection = document.getElementById('btnSelection');
  const copyBtn = document.getElementById('copyBtn');
  const outputContent = document.getElementById('outputContent');
  const loader = document.getElementById('loader');
  const statusDot = document.getElementById('statusDot');
  const radioButtons = document.getElementsByName('length');
  
  let loadingTimer = null;

  // --- HANDLER: Summarize Full Page ---
  btnFullPage.addEventListener('click', async () => {
    handleSummarizeClick("summarize_full_page");
  });

  // --- HANDLER: Summarize Selection ---
  btnSelection.addEventListener('click', async () => {
    // We send a request to content script to "get_selection"
    handleSummarizeClick("get_selection_request");
  });

  async function handleSummarizeClick(actionType) {
    let selectedLength = 'short';
    for (const radio of radioButtons) {
      if (radio.checked) selectedLength = radio.value;
    }

    setLoading(true);

    loadingTimer = setTimeout(() => {
        setLoading(false);
        outputContent.innerHTML = `<p style="color:red;">Timeout: API is slow. Try again.</p>`;
    }, 60000);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (actionType === "summarize_full_page") {
        // Tell Background -> Content -> Scrape Page
        chrome.runtime.sendMessage({ 
            action: "summarize_full_page", 
            tabId: tab.id, 
            length: selectedLength 
        });
    } else {
        // Tell Content -> Get Selection
        chrome.tabs.sendMessage(tab.id, { action: "get_selection" });
        // We also save preference in background
        chrome.runtime.sendMessage({ action: "save_pref", length: selectedLength });
    }
  }

  // --- LISTEN FOR RESULTS ---
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "ui_loading") setLoading(true);
    
    if (message.action === "display_summary") {
      clearTimeout(loadingTimer);
      setLoading(false);
      
      if (message.text.startsWith("Error")) {
          outputContent.innerHTML = `<p style="color: #D32F2F;">${message.text}</p>`;
          statusDot.classList.remove('active');
      } else {
          outputContent.innerHTML = message.text.replace(/\n/g, "<br>");
          statusDot.classList.add('active');
      }
    }
  });

  // Copy Button Logic
  copyBtn.addEventListener('click', () => {
    const text = outputContent.innerText;
    if (text && !text.includes("Ready")) {
      navigator.clipboard.writeText(text);
      copyBtn.innerHTML = `<span class="material-icons-round" style="color:#10B981">check</span>`;
      setTimeout(() => { copyBtn.innerHTML = `<span class="material-icons-round">content_copy</span>`; }, 2000);
    }
  });

  function setLoading(isLoading) {
    if (isLoading) {
      loader.classList.remove('hidden');
      btnFullPage.disabled = true;
      btnSelection.disabled = true;
      statusDot.classList.add('active');
    } else {
      loader.classList.add('hidden');
      btnFullPage.disabled = false;
      btnSelection.disabled = false;
    }
  }
});