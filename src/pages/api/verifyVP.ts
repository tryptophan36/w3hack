import { createVc, signVc, verifyVPJwt } from "@/components/onyx";
import { SCHEMA_VERIFIED_CUSTOMER, VERIFIED_CUSTOMER } from "../../config";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  isVerified: boolean;
};

type Error = {
  message: string;
};

// create VC with Schema , with Sign VC , to return JWT & VC
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method === "POST") {
    const VP = req.body.VP;
    const vpJWT = req.body.vpJWT;
    console.log(VP, vpJWT);

    try {
      const result = await verifyVPJwt(VP, vpJWT);
      if (!result) {
        return res.status(400).json({ message: "No Result returned" });
      }

      res.status(200).json({ isVerified: result });
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
