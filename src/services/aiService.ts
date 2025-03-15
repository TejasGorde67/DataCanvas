import axios from "axios";

export async function getCodeSuggestion(prompt: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:5000/api/ai/suggest", {
      prompt,
    });
    return response.data.suggestion;
  } catch (error) {
    console.error("Error getting AI suggestion:", error);
    throw error;
  }
}

export async function completeCode(code: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:5000/api/ai/complete", {
      code,
    });
    return response.data.completion;
  } catch (error) {
    console.error("Error completing code:", error);
    throw error;
  }
}

export async function explainCode(code: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:5000/api/ai/explain", {
      code,
    });
    return response.data.explanation;
  } catch (error) {
    console.error("Error explaining code:", error);
    throw error;
  }
}
