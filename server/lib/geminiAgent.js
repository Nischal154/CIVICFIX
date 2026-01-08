const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeComplaint = async (title, description) => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
            console.warn("⚠️ Gemini API Key missing or invalid. Using fallback mock logic.");
            return mockAnalysis(title, description);
        }

        const model = genAI.getGenerativeModel({ model: "models/gemini-3-pro-preview" });

        const prompt = `
        Analyze the following citizen complaint:
        Title: ${title}
        Description: ${description}

        Unstructured text can be messy. Please extract:
        1. Category (e.g., Electricity, Water, Road, Waste, Traffic, Fire, Medical, Police)
        2. Priority (Low, Medium, High, Emergency)
        3. Department (The government department responsible)
        4. Summary (One sentence summary)
        5. IsEmergency (Boolean - true if life/property threatening immediately like fire, gas leak, accident)

        Return response as valid JSON only.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return mockAnalysis(title, description);
    }
};

const mockAnalysis = (title, description) => {
    const text = (title + " " + description).toLowerCase();
    let category = "General";
    let priority = "Low";
    let isEmergency = false;

    if (text.includes("fire") || text.includes("explosion") || text.includes("blood")) {
        category = "Emergency Services";
        priority = "Emergency";
        isEmergency = true;
    } else if (text.includes("light") || text.includes("electric") || text.includes("pole")) {
        category = "Electricity";
        priority = "Medium";
    } else if (text.includes("water") || text.includes("leak") || text.includes("pipe")) {
        category = "Water";
        priority = "Medium";
    } else if (text.includes("road") || text.includes("pothole")) {
        category = "Roads";
        priority = "Medium";
    }

    return {
        category,
        priority,
        department: category + " Dept",
        summary: title,
        isEmergency
    };
};

module.exports = { analyzeComplaint };
