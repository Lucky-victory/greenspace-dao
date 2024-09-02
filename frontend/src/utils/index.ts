import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import generateUniqueId from "generate-unique-id";
import { nanoid } from "nanoid";

export const env = process.env.NODE_ENV || "development";
export const IS_DEV = env === "development";
import slugify from "slugify";
import isEmpty from "just-is-empty";
import { format } from "date-fns";

export function getCallerFunctionName(): string | null {
  const error = new Error();
  const stack = error.stack?.split("\n");

  // Stack trace line format: "at FunctionName (file:line:column)"
  // Skip the first line ("Error") and the second line (this function call)
  if (stack && stack.length > 2) {
    const callerLine = stack[2].trim();
    const functionNameMatch = callerLine.match(/at (\w+)/);

    if (functionNameMatch) {
      return functionNameMatch[1];
    }
  }

  return null;
}
export function logger(data: any, message?: string) {
  console.log(`${getCallerFunctionName()}`, { data }, message);
}
export function filterNullOrEmpty<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined && value !== "")
  );
}
export function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th"; // Covers 11th to 19th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Function to format the date with ordinal
export function formatDateWithOrdinal(date: Date | string) {
  if (isEmpty(date)) return "";
  if (typeof date === "string") {
    date = new Date(date);
  }
  const day = format(new Date(date), "d"); // Get the day of the month as a number
  const ordinalSuffix = getOrdinalSuffix(parseInt(day, 10)); // Get the appropriate suffix
  return `${day}${ordinalSuffix}`; // Combine day and suffix
}

// Example usage
const date = new Date(2024, 4, 19); // May 19, 2024
console.log(formatDateWithOrdinal(date)); // Output: "19th"

export function convertJsDateToMysqlDate<T = Date>(jsDate: Date | string) {
  const date = jsDate instanceof Date ? jsDate : new Date(jsDate);
  return date.toISOString().slice(0, 19).replace("T", " ") as T;
}
export const convertMinutesToMillisececonds = (mins: number) => +mins * 1000 * 60;

export function addMinutesToDate(minutes: number, date: string | Date) {
  // Get the current date and time
  const now = new Date(date);
  // Calculate the new time by adding minutes
  const newTime = new Date(now.getTime() + convertMinutesToMillisececonds(minutes));

  return newTime;
}
export const generateCommunityId = (prefix = "GS") => {
  return generateNumId(prefix, 14, "-");
};
/**
 *
 * @param prefix  prefix f0r the ID
 * @param len length of the ID
 * @param sep separator fop the ID
 * @returns
 */
export const generateNumId = (prefix = "", len = 10, sep = "") => {
  return `${prefix}${sep}${generateUniqueId({
    useLetters: false,
    useNumbers: true,
    length: len
  })}`;
};
export const generateUsername = (prefix = "GH", len = 10) => {
  return generateNumId(prefix, len, "_");
};
export function objectToSearchParams(obj: Record<string, any>) {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }

  return params;
}

export async function successHandlerCallback<T>(
  req: NextApiRequest,
  res: NextApiResponse,
  data: T,
  status = 200
): Promise<void> {
  return res.status(status).json(data);
}
export async function errorHandlerCallback<T>(
  req: NextApiRequest,
  res: NextApiResponse,
  data: T,
  status = 500
): Promise<void> {
  return res.status(status).json(data);
}
export function maskWalletAddress(walletAddress: string, visibleChars: number = 4): string {
  if (!walletAddress || walletAddress.length < visibleChars * 2) {
    return walletAddress;
  }

  const visiblePart = walletAddress.slice(0, visibleChars);
  const hiddenPart = "...";
  const lastVisiblePart = walletAddress.slice(-visibleChars);

  return `${visiblePart}${hiddenPart}${lastVisiblePart}`;
}

export type HTTP_METHOD = "GET" | "PUT" | "POST" | "DELETE";
export type HTTP_METHOD_CB = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export async function mainHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  {
    GET,
    PUT,
    POST,
    DELETE
  }: {
    GET?: HTTP_METHOD_CB;
    POST?: HTTP_METHOD_CB;
    PUT?: HTTP_METHOD_CB;
    DELETE?: HTTP_METHOD_CB;
  }
) {
  const method = req.method as HTTP_METHOD;
  switch (method) {
    case "GET":
      return await GET?.(req, res);
    case "POST":
      return await POST?.(req, res);
    case "PUT":
      return PUT?.(req, res);
    case "DELETE":
      return DELETE?.(req, res);

    default:
      return res.status(405).end();
  }
}
export function generateUrlSafeId(len = 21, prefix = ""): string {
  return prefix + nanoid(len);
}
interface NestedObject {
  [key: string]: any;
}

export function flattenArray<T extends NestedObject, U>(array: T[], callback: (item: T) => U | null): U[] {
  const flattenedArray: U[] = [];

  array.forEach((item) => {
    const flattenedItem = callback(item);
    if (flattenedItem !== null) {
      flattenedArray.push(flattenedItem);
    }
  });

  return flattenedArray;
}
export function isDuplicate<T>(array: T[], property: keyof T, value: string) {
  return array.some((item) => item[property] === value);
}
export function shortenText(text: string, len = 50, end = "..."): string {
  return text?.length > len ? text?.substring(0, len) + end : text;
}
export const replaceCloudflareIpfs = (url: string = "") => {
  if (url?.includes("cloudflare-ipfs.com")) {
    const newUrl = url.replace("cloudflare-ipfs.com", "ipfs.io");
    return newUrl;
  }
  return url;
};
export const apiPost = async (endpoint: string, params: Record<string, any>): Promise<{ message: string }> => {
  const result = await axios.post(`${endpoint}`, params, {
    headers: {
      "content-type": "application/json"
    }
  });
  return { message: result.data };
};
// export const getUserFromDB = async (
//   usernameOrIdOrAddress: string | number,
//   columns = {}
// ) => {
//   const defaultCols = {
//     id: true,
//     address: true,
//     fullName: true,
//     username: true,
//     avatar: true,
//     userType: true,
//     authId: true,
//     role: true,
//   };
//   const cols = { ...defaultCols, ...columns };
//   try {
//     const user = await db.query.users.findFirst({
//       where: or(
//         eq(users.username, usernameOrIdOrAddress as string),
//         eq(users.address, usernameOrIdOrAddress as string),
//         eq(users.authId, usernameOrIdOrAddress as string)
//       ),
//       columns: cols,
//     });
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };
export function selectObjectKeys<T extends object>(obj: T) {
  const resultArray = [];
  if (isEmpty(obj)) return [];
  return Object.keys(obj).map((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const spacedKey = key.replace(/([a-z])([A-Z])/g, "$1 $2");
      const formattedKey = spacedKey.charAt(0).toUpperCase() + spacedKey.slice(1);

      const keyString = `${formattedKey}`;

      return keyString;
    }
  });

  // return resultArray;
}
export const generateSlug = (text: string) =>
  slugify(shortenText(text, 60, "") + "-" + nanoid(6), {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true
  });
export function removeKeyFromObject<T extends object>(arr: T[], keysToRemove: (keyof T)[] = []) {
  if (isEmpty(arr)) return [];
  return arr?.map((obj) => {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (!keysToRemove.includes(key as keyof T)) {
          newObj[key] = obj[key as keyof T];
        }
      }
    });
    // const omits = keysToRemove.join('|') as const;
    return newObj as T;
  });
}
