import { eq, sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "src/db";
import { supplements, supplementAttributes, supplementRecommendations, supplementExperts } from "src/db/schema";
import { Supplement } from "src/types";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    GET,
    POST,
    DELETE,
  });
}

export const getAllSupplements = async () => {
  const allSupplements = await db.select().from(supplements);
  const allSupplementsAttributes = await db.select().from(supplementAttributes);
  const allSupplementsRecommendations = await db.select().from(supplementRecommendations);
  const allSupplementsExperts = await db.select().from(supplementExperts);
  const data = allSupplements.reduce((acc, curr) => {
    const supplementId = curr.id;
    const attributes = allSupplementsAttributes
      .filter((item) => item.supplementId === supplementId)
      .map((item) => item.attribute);
    let recommendations = allSupplementsRecommendations
      .filter((item) => item.supplementId === supplementId)
      .map((item) => ({ expertId: item.expertId, doseage: item.doseage }));
    const experts = allSupplementsExperts.filter((item) => recommendations.some((rec) => rec.expertId === item.id));

    recommendations = recommendations.map((item) => {
      // @ts-ignore
      const expert = experts.find((expert) => expert.id === item.expertId);

      return { ...item, ...expert };
    });
    // @ts-ignore
    acc.push({ ...curr, attributes, recommendations });
    return acc;
  }, []);
  return JSON.parse(JSON.stringify(data)) as Supplement[];
};

export const GET: HTTP_METHOD_CB = async (req, res) => {
  try {  
    return successHandlerCallback(req, res, {
      message: "supplements retrieved successfully",
      data: await getAllSupplements(),
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
interface SupplimentBody {
  title: string;
  intro: string;
  link: string;
  attributes: string[];
  recommendations: { expertId: number; doseage: string }[];
}
export const POST: HTTP_METHOD_CB = async (req, res) => {
  try {
    const { title, intro, link, attributes, recommendations } = req.body as SupplimentBody;
    const supplementExists = await db.query.supplements.findFirst({
      where: eq(supplements.title, title),
    });
    if (supplementExists) {
      return successHandlerCallback(req, res, {
        message: "supplement already exists",
        data: supplementExists,
      });
    }
    const [{ insertId: supplementId }] = await db.insert(supplements).values({
      title,
      intro,
      link,
    });

    await db.insert(supplementAttributes).values(
      attributes.map((item) => ({
        supplementId,
        attribute: item,
      }))
    );

    await db.insert(supplementRecommendations).values(
      recommendations.map((item) => ({
        supplementId,
        expertId: item.expertId,
        doseage: item.doseage,
      }))
    );

    return successHandlerCallback(req, res, {
      message: "supplement created successfully",
      data: { supplementId },
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};

export const DELETE: HTTP_METHOD_CB = async (req, res) => {
  try {
    const { supplementId } = req.body;
    await db.delete(supplements).where(eq(supplements.id, supplementId));
    return successHandlerCallback(req, res, {
      message: "supplement deleted successfully",
      data: { supplementId },
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};

// await db.execute(sql`
//         CREATE TABLE IF NOT EXISTS Supplements (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             title VARCHAR(120) NOT NULL,
//             intro VARCHAR(255),
//             link LONGTEXT,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         );`);
//         await db.execute(sql`
//         CREATE TABLE IF NOT EXISTS SupplementAttributes (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             supplementId INT NOT NULL,
//             attribute VARCHAR(120),
//             FOREIGN KEY (supplementId) REFERENCES Supplements(id)
//         );

//         `);
//         await db.execute(sql`CREATE TABLE IF NOT EXISTS SupplementExperts (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             name VARCHAR(120),
//             image VARCHAR(255),
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         );

//         `);
//         await db.execute(sql`CREATE TABLE IF NOT EXISTS SupplementRecommendations (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             doseage VARCHAR(255),
//             supplementId INT,
//             expertId INT,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (supplementId) REFERENCES Supplements(id),
//             FOREIGN KEY (expertId) REFERENCES SupplementExperts(id)
//         );`);
//         return;
