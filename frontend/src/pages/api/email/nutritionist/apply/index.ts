import { EmailTemplate } from "@/components/NutritionistApplyEmailTemplate";
import { mainHandler, HTTP_METHOD_CB } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
const { RESEND_API_KEY } = process.env;

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
    const { name, email, message, link } = await req.body;
    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: `GreenspaceDAO <mail@devvick.com>`,
      // reply_to: "<apply@greenspacedao.xyz>",
      to: [email],
      subject: "Nutritionist Application",
      text: "",
      react: EmailTemplate({ name, email, message, link }),
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "An error occurred, please try again..." });
  }
};
