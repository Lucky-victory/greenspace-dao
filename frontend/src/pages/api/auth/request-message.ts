// import Moralis from "moralis";
// import { NextApiRequest, NextApiResponse } from "next";

// const TIME = new Date();
// const FUTURE = new Date(
//   TIME.getFullYear(),
//   TIME.getMonth(),
//   TIME.getDate() + 7,
//   TIME.getHours(),
//   TIME.getMinutes(),
//   TIME.getSeconds(),
//   TIME.getMilliseconds()
// );
// const DOMAIN = process.env.APP_DOMAIN;
// const STATEMENT = "Please sign this message to confirm your identity.";
// const URI = process.env.NEXTAUTH_URL;
// const EXPIRATION_TIME = FUTURE.toISOString();
// const NOT_BEFORE = TIME.toISOString();
// const TIMEOUT = 60;

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { address, chainId, network, networkType = "evm" } = req.body;

//   if (!Moralis.Core.isStarted)
//     await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

//   try {
//     if (!DOMAIN || !URI) {
//       throw new Error("Please add APP_DOMAIN in the .env.local");
//     }
//     // console.log({
//     //   address: address,
//     //   networkType: networkType as "evm" | "solana" | "aptos",
//     //   network: network,
//     //   domain: DOMAIN!,
//     //   chain,
//     //   statement: STATEMENT,
//     //   uri: URI!,
//     //   expirationTime: EXPIRATION_TIME,
//     //   timeout: TIMEOUT,
//     //   notBefore: NOT_BEFORE,
//     // });
//     const message = await Moralis.Auth.requestMessage({
//       address: address,
//       chain: chainId,
//       // publicKey: address,
//       networkType: networkType as "evm",
//       // network: network,
//       domain: DOMAIN!,
//       statement: STATEMENT,
//       uri: URI!,
//       expirationTime: EXPIRATION_TIME,
//       timeout: TIMEOUT,
//       notBefore: NOT_BEFORE,
//     });
//     res.status(200).json(message);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error });
//   }
// }
