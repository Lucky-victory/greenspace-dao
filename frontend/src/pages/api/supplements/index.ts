import { eq, sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "src/db";
import { supplements, supplementAttributes, supplementRecommendations, supplementExperts } from "src/db/schema";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    GET,
    //   POST,
  });
}

export const GET: HTTP_METHOD_CB = async (req, res) => {
  try {
    const supplementsWithDetails = await db
      .select({
        supplement: supplements,
        attributes: supplementAttributes,
        recommendations: supplementRecommendations,
        experts: supplementExperts,
      })
      .from(supplements)
      .leftJoin(supplementAttributes, eq(supplementAttributes.supplementId, supplements.id))
      .leftJoin(supplementRecommendations, eq(supplementRecommendations.supplementId, supplements.id))
      .leftJoin(supplementExperts, eq(supplementExperts.id, supplementRecommendations.expertId));
    return successHandlerCallback(req, res, {
      message: "supplements retrieved successfully",
      data: supplementsWithDetails || null,
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
