import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mathQuestionHandler = async (level) => {
  let inputText = `{
  "role": "Terminal Casino host",
  "task": "create math question and answer",
  "difficulty": "${level}, if easy use only addition and subtraction, if medium use multiplication and division, and if hard addition, subtraction, multiplication, and division",
  "responsetype": "valid Javascript object of problem: and answer: in double quotes"
  "responsesize": "max 64 characters"
}`;

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

    console.log("FROM THE GPT", response.choices[0].message.content);
    let question = response.choices[0].message.content.trim();
    return [
      {
        type: "input",
        name: "question",
        message: JSON.parse(question).problem,
        answer: JSON.parse(question).answer,
      },
    ];
  } catch (error) {
    console.error("Error fetching data from ChatGPT:", error);
    return { error: "Failed to fetch data from ChatGPT API" };
  }
};

export default mathQuestionHandler;
