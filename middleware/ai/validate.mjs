import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const validateHandler = async (answer, question, difficulty) => {
  try {
    let inputText = `{
  "role": "Terminal Casino host",
  "task": "verify answer",
  "answer": "${answer}",
  "question": "${question}",
  "difficulty": "${difficulty}, if easy (use only + and -),  if medium (use only * and /), and if hard (use +, -, *, /)",
  "responsetype": "json object of result: and message:"
  "responsesize": "max 64 characters"
}`;

    // Sending request to validate the user's answer
    let response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: inputText }],
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Analyzing validation response
    const validation = response.choices[0].message.content.trim();
    return validation.toLowerCase();
  } catch (error) {
    console.error("Error fetching data from ChatGPT:", error);
    return { error: "Failed to fetch data from ChatGPT API" };
  }
};

export default validateHandler;
