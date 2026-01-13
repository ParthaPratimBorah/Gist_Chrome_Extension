/**
 * CONFIGURATION
 * Get your key here: https://aistudio.google.com/app/apikey
 */
const CONFIG = {
    // Paste your Gemini API Key inside the quotes below
    GEMINI_API_KEY: "AIzaSyDD44qMXyUpq4E7YfrI_qlR1oxZY_p7Mow"
};

/**
 * Main entry point called by sidepanel.js
 */
async function generateSummary(text, length) {
    const systemPrompt = constructPrompt(length);
    
    try {
        return await callGemini(text, systemPrompt);
    } catch (error) {
        console.error("Gemini Error:", error);
        return `Error: ${error.message}. Please check your API Key.`;
    }
}

function constructPrompt(length) {
    const base = "You are a helpful browser assistant. Summarize the following text.";
    if (length === 'short') {
        return `${base} Provide a concise 1-2 sentence summary.`;
    } else if (length === 'medium') {
        return `${base} Provide a 3-bullet point summary.`;
    } else {
        return `${base} Provide a detailed summary formatted with HTML (use <b>bold</b> and <br>).`;
    }
}

/**
 * GOOGLE GEMINI INTEGRATION
 * Fixed Model Name: gemini-1.5-flash
 */
async function callGemini(text, instructions) {
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.includes("AIzaSyDD44qMXyUpq4E7YfrI_qlR1oxZY_p7Mow")) {
        throw new Error("Missing Gemini API Key");
    }

    // FIX: Ensure no spaces in the model name and use the correct URL structure
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
    
    const payload = {
        contents: [{
            parts: [{
                text: `${instructions}\n\nInput Text:\n${text}`
            }]
        }]
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.json();
        // Return a clearer error message
        throw new Error(`Gemini API Error (${response.status}): ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Gemini blocked the response (Safety Filter).");
    }
}