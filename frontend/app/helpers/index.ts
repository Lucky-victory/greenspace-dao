import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  formatDistance,
  format,
  isToday,
  isYesterday,
  formatDistanceStrict,
} from "date-fns";
import slugify from "slugify";
export function shortenText(text: string, len = 50) {
  return text?.length > len ? text?.substring(0, len) + "..." : text;
}
export const formatChatTimestamp = (timestamp: number | Date) => {
  const currentDate = new Date();
  const messageDate = new Date(timestamp);

  if (isToday(messageDate)) {
    return `Today ${format(messageDate, "h:mm a")}`;
  } else if (isYesterday(messageDate)) {
    return `Yesterday ${format(messageDate, "h:mm a")}`;
  } else {
    return format(messageDate, "yyyy/M/d h:mm a");
  }
};
export function maskHexAddress(address: string) {
  if (typeof address !== "string") {
    return "";
  }

  const visibleLength = 4;
  const maskedPart = "*".repeat(5);

  return `${address.slice(0, visibleLength + 1)}${maskedPart}${address.slice(
    -visibleLength
  )}`;
}

function makeStorageClient() {
  // return new Web3Storage({ token: getAccessToken() as string });
}
export const uploadPromptToIpfs = async (data: any) => {
  const client = makeStorageClient();
  const prompt = {
    template: `
    You are a robot built by RevitalizeAI. Your goal is to predict the rate of aging of users.
    You must respond with the following json output and nothing else. (Reverse, Fast, Moderate, Slow)
    example: {"aging": "Fast"}

    These outputs depend on the input data provided.
    An input data is a json object, with questions as keys and the possible answers as values.
    Note the values are a list of strings.

    example input data in the object below
    
    {
        "What's your date of birth": [],
        "What's your biological sex": ["Male", "Female"],
        "What's your weight?": [],
        "What's your height in inches?": [],
        "Tell us about your diet?": [
            "I eat 5 or more servings of vegetables per day",
            "I eat two or more servings of fruit per day",
            "I have two or more servings of dairy (or equivalent) per day",
            "My cereals are mostly whole grains",
            "I eat fast lean protein every day",
            "I eat fast food once per week or less",
            "I eat pastries or cakes once a week or less",
            "I have less than 1 teaspoon of salt per day",
            "I have 2 or less alcholic drinks on any day",
            "I drink at least 2 litres of water per day",
        ],
        "How active are you on an average week?": [
            "Inactive",
            "active",
            "very active",
        ],
        "How many hours a day are you sitting": [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24,
        ],
        "How much alchohol do you drink": [
            "0 - 10 drinks a week",
            "10 - 20 drinks a week",
            "greater than 20 drinks a week",
        ],
        "Do you smoke?": ["Never smoked", "Ex smoker", "Current smoker"],
        "If you are an ex-smoker, how many months ago did you stop?": [
            "less than 6 months ago",
            "six to twelve months ago",
            "more than twelve months ago",
        ],
        "If you are a current smoker, how many cigarettes do you smoke per day?": [
            "less than 5 cigarettes",
            "5 to 10 cigarettes",
            "11 to 20 cigarettes",
            "above 20 cigarettes",
        ],
        "How many hours of sleep do you get per day?": [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        ],
        "Rate your overall Health": [
            "Excellent",
            "Very good",
            "Good",
            "Fair",
            "Poor",
        ],
    }
    `,
    parameters: `

            {"question: Given the following:
            Date of Birth: ${data?.birthDate} /n
            Sex: ${data?.sex} /n
            Weight: ${data?.weight}/n
            Height: ${data?.height}
            Diet: ${data?.diet} /n
            Physical Activity: ${data?.active}/n
            Hours Sitting Per Day: ${data?.sitting}/n
            Alcohol Rate: ${data?.alcohol}/n
            Smoking: ${data?.smoke} (${data?.smokingLength})/n
            Sleep Per Day: ${data?.sleepLength}/n
            Overall Health Rating: ${data?.overallHealth}/n
        
            Calculate my rate of aging ? /n

            Ensure to respond with the output option on the initial condition./n
            I know you don't have enough data but use your best understanding./n
            Respond with either Reverse, Fast, Moderate, or Slow. Remember as a json object./n
            "}
        `,
  };
};

export const uploadToThirdWeb = async (json: any) => {
  // First, instantiate the thirdweb IPFS storage
  const storage = new ThirdwebStorage({
    secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY as string,
  });

  // Here we get the IPFS URI of where our metadata has been uploaded
  const uri = await storage.upload(json);
  // This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
  console.info("uri:", uri);

  // // Here we a URL with a gateway that we can look at in the browser
  // const url = await storage.resolveScheme(uri);
  // // This will log a URL like https://ipfs.thirdwebstorage.com/ipfs/QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
  // console.info("url:", url);

  // // You can also download the data from the uri
  // const data = await storage.downloadJSON(uri);
  // console.log("data:", data)

  return uri;
};
export function resolveIPFSURI(
  ipfsURI: string,
  addGateWayUrl = true,
  gatewayUrl = "https://cloudflare-ipfs.com/"
): string {
  // Check if the URI starts with 'ipfs://'
  if (ipfsURI.startsWith("ipfs://")) {
    // Remove 'ipfs://' and return the modified URI
    const modifiedURI = ipfsURI.replace("ipfs://", "ipfs/");
    return addGateWayUrl ? gatewayUrl + modifiedURI : modifiedURI;
  } else {
    // If the URI doesn't start with 'ipfs://', return as it is
    return addGateWayUrl ? gatewayUrl + ipfsURI : ipfsURI;
  }
}
