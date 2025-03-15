import axios from "axios";

interface ExecutionResult {
  output: string;
  error?: string;
  visualizations?: any[];
}

export async function executeCode(code: string): Promise<ExecutionResult> {
  try {
    const response = await axios.post("http://localhost:5000/api/execute", {
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    return {
      output: "Error executing code",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
