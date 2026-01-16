# Gist – An AI Summarizer for Chrome

**Gist** is a privacy-first Chrome Extension that cuts through the noise.  
It uses advanced AI to instantly distill full web pages or highlighted text into clear, actionable bullet points.

Designed with a calming blue interface and a neumorphic aesthetic, Gist helps you capture the essence of any article in seconds using the **Hugging Face Inference API**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)  
![Status](https://img.shields.io/badge/status-active-success)  
![Tech](https://img.shields.io/badge/tech-Chrome_Extension_V3-orange)

---

## 🚀 Features at a Glance

- **Two Summarization Modes**
  - 📄 **Get the Gist:** Scrapes the entire active tab (ignoring ads, nav menus, and fluff).
  - 🔍 **Focus Mode:** Highlight specific text on a page to summarize just that section.

- **Three Depth Levels**
  - **Short:** Executive Brief (2–3 items).
  - **Medium:** Key Takeaways with bold headlines.
  - **Deep:** Comprehensive Deep Dive analysis.

- **Smart Formatting:** Always outputs **bullet points** for instant readability.  
- **Modern UI:** Clean, medical-grade white & calming blue design with smooth animations.  
- **Copy Utility:** One-click copy to notes or docs.  
- **Powered by AI:** Uses `Qwen/Qwen2.5-72B-Instruct` via Hugging Face for intelligent results.

---

## 🖼️ Screenshot

![Gist Summarizer UI](https://raw.githubusercontent.com/ParthaPratimBorah/Gist_Chrome_Extension/refs/heads/main/icons/Screenshot.png)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ParthaPratimBorah/Gist_Chrome_Extension.git
```

## 2. Configure the API Key
Note: Requires a free Hugging Face Access Token.
Get your token from Hugging Face → Settings → Tokens.

Open src/scripts/utils.js and paste your token:
```Javascript
const CONFIG = {
    HF_TOKEN: "hf_PasteYourTokenHere..."
};
```
**Security Reminder: ** 
Never commit your actual API key to GitHub. Use .gitignore or remove the key before pushing

### 3. Load into Chrome

1. Open Chrome → `chrome://extensions/`
2. Toggle **Developer Mode** (top right).
3. Click **Load unpacked**.
4. Select the project root folder (where `manifest.json` is located).

## 📂 Project Structure

```plaintext
Gist_Extension/
├── icons/                  # App icons (16, 48, 128px)
├── src/
│   ├── scripts/
│   │   ├── background.js   # Service worker (API & Context menus)
│   │   ├── content.js      # Page scraper & text highlighter
│   │   └── utils.js        # AI Prompt Logic & API Calls
│   └── sidepanel/
│       ├── sidepanel.html  # Main UI Structure
│       ├── sidepanel.css   # Neumorphic/Minimalist Styling
│       └── sidepanel.js    # UI Logic & Event Listeners
├── manifest.json           # Chrome Extension Configuration
└── README.md               # Documentation
```

## 🐛 Troubleshooting

| Issue                   | Solution                                                                 |
|--------------------------|---------------------------------------------------------------------------|
| **Timeout: API is slow** | Free AI model may be "waking up." Wait ~10 seconds and retry.             |
| **404 Not Found**        | Check your `utils.js` URL → must use `router.huggingface.co`.             |
| **Icon not visible**     | Ensure the `icons` folder is in the root directory, not inside `src`.     |

---

## 🛡️ License

Open-source for **personal and educational use**.  
Created with by **Partha Pratim Borah**.


