import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const validateHandler = async (answer, question) => {
  try {
    let inputText = `You are a host for 'Terminal Casino' a CLI based healthy gambling app. You are to check if ${answer} is the correct answer to this math question: ${question}? if correct, to keep the experience consistent respond with 'Correct! Congrats on the bits!', otherwise give the solution using 1 setence ending with "better luck next time". Because this is a CLI, you will need to keep your response to max 64 characters.`;

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
