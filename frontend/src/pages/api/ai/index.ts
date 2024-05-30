import { HTTP_METHOD_CB, mainHandler } from "src/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { initial_condition } from "src/utils/prompts";
import OpenAI from "openai";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    POST,
  });
}

export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const prompt = req.body;
    console.log(prompt);

    const objToString = Object.keys(prompt).reduce(
      (acc, key) => (acc += `${key}: ${prompt[key]}\n`),
      ""
    );
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "assistant", content: initial_condition },
        {
          role: "user",
          content: `Given the following \n
        ${objToString}
         Calculate my rate of aging?
    Ensure to respond with the output option on the initial condition.
    I know you don't have enough data but use your best understanding.
    Respond with either Reverse, Fast, Moderate, or Slow. Remember as a json object.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return res.json({
      data: JSON.parse(completion["choices"][0]["message"].content as string),
      message: "AI message successfully",
    });
  } catch (error) {
    return res.json({ error, message: "Something went wrong" });
  }
};
