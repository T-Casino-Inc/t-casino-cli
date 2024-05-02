import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mathQuestionHandler = async (level) => {
  let inputText = `You are the host of 'Terminal Casino', a CLI where you enerate an new ${level} arithmetic math question. To keep the interaction consistent, respond with the introduction "Here is your question, good luck!" and then provide the math question with text.`;

  try {
    // Sending request to generate a math question
    let response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: inputText }],
      temperature: 0.5,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const question = response.choices[0].message.content.trim();

    return [
      {
        type: "input",
        name: "question",
        message: question,
      },
    ];
  } catch (error) {
    console.error("Error fetching data from ChatGPT:", error);
    return { error: "Failed to fetch data from ChatGPT API" };
  }
};

export default mathQuestionHandler;
