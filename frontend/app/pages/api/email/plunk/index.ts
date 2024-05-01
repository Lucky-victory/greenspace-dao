// This will be replaced with plunk api

import { EmailTemplate } from "@/components/EmailTemplate";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
const { RESEND_API_KEY } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, email, message, link } = await req.body;
    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: `GreenspaceDAO <mail@devvick.com>`,
      to: [email],
      subject: "Meeting Invitation",
      text: "",
      react: EmailTemplate({ name, email, message, link }),
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "An error occurred, please try again..." });
  }
}
