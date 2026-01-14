
const CONFIG = {
    HF_TOKEN: "huggingface_token_goes_here" // Replace with your actual token
};

async function generateSummary(text, length) {
    if (!CONFIG.HF_TOKEN || CONFIG.HF_TOKEN.includes("PASTE")) {
        return "Error: Token is missing in utils.js";
    }

    //  Clean Text
    const cleanText = text.substring(0, 6000); 

    // This is the modern standard for Hugging Face
    const API_URL = "https://router.huggingface.co/v1/chat/completions";
    
    //  Construct Prompt Chat Style
    const systemInstruction = constructSystemPrompt(length);

    try {
        console.log("Calling Hugging Face Router (Qwen)...");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CONFIG.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: cleanText }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        // 4 Error handling
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Router Error:", errorText);
            try {
                const json = JSON.parse(errorText);
                return `API Error: ${json.error?.message || json.error}`;
            } catch (e) {
                return `API Error: ${response.status} - ${response.statusText}`;
            }
        }

        const data = await response.json();
        
        // 5 Parse result
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            return "Error: Empty response from AI.";
        }

    } catch (error) {
        console.error("Network Exception:", error);
        return `Connection Failed: ${error.message}`;
    }
}

function constructSystemPrompt(length) {
    //  Base Instructions
    const base = `
    You are an advanced AI Summarizer. Your goal is to extract knowledge from web content.
    RULES:
    - Ignore navigation menus, footer text, ads, and "subscribe" pleas.
    - Focus ONLY on the main article content.
    - OUTPUT FORMAT: You must return a valid HTML Unordered List (<ul>...</ul>).
    - Do not write intro/outro text (like "Here is the summary"). Just the list.
    - Use <b>bold tags</b> for emphasis.
    `;

    //  Mode-Specific Personas
    if (length === 'short') {
        return `${base}
        MODE: EXECUTIVE BRIEF (TL;DR)
        - Provide exactly 2-3 concise bullet points.
        - Focus strictly on the "Big Idea" and immediate value.
        - Example:
          <ul>
            <li><b>Core concept:</b> [Brief explanation]</li>
            <li><b>Outcome:</b> [Brief result]</li>
          </ul>`;
    } 
    
    else if (length === 'medium') {
        return `${base}
        MODE: KEY TAKEAWAYS
        - Provide 3-5 high-value bullet points.
        - Start each bullet with a <b>Bold Headline</b> followed by the explanation.
        - Example:
          <ul>
             <li><b>Main Concept:</b> Explanation here.</li>
             <li><b>Key Argument:</b> Explanation here.</li>
          </ul>`;
    } 
    
    else { // 'detail'
        return `${base}
        MODE: DEEP DIVE REPORT
        - Provide a comprehensive list of bullet points (5+).
        - Group them logically (you can use nested lists or just clear ordering).
        - Include specific details like names, dates, and figures using <b>bold text</b>.
        - Structure:
          <ul>
            <li><b>Context:</b> [What is this about?]</li>
            <li><b>Core Analysis:</b> [Point 1]</li>
            <li><b>Core Analysis:</b> [Point 2]</li>
            <li><b>Conclusion:</b> [Final thought]</li>
          </ul>`;
    }
}