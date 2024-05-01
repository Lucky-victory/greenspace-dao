import OpenAI from 'openai';
require("dotenv").config();


import {initial_condition, prompt1} from "./prompts"
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // defaults to process.env["OPENAI_API_KEY"]
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'assistant', content: initial_condition },
      { role: 'user', content: prompt1 },
    ],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion['choices'][0]['message']);
}

main();