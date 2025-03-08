import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyB7bVRDaE4CAhlsCdi2rR9LWNQZMwpXqnU";// #TODO put in env file

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function calculateDocumentSimilarity(doc1: string, doc2: string): Promise<number | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Compare the following two documents and provide a percentage similarity score (0-100) based on their content.

      Document 1:
      ${doc1}

      Document 2:
      ${doc2}

      Similarity Percentage:
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract the percentage from the response
    const percentageMatch = responseText.match(/(\d+)%/);

    if (percentageMatch && percentageMatch[1]) {
      const percentage = parseInt(percentageMatch[1], 10);
      if (percentage >= 0 && percentage <= 100) {
        return percentage;
      }else{
        return null;
      }
    } else {
      console.error("Could not extract similarity percentage from response:", responseText);
      return null;
    }
  } catch (error) {
    console.error("Error calculating document similarity:", error);
    return null;
  }
}
