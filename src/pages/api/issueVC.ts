import { createVc, signVc } from "@/components/onyx";
import { SCHEMA_VERIFIED_CUSTOMER, VERIFIED_CUSTOMER } from "@/config";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  vc: string;
  vcJwt: string;
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
    const holderAddress = req.body.address;
    const schemaURL = req.body.schemaURL;
    const subjectData = req.body.subjectData;
    const credentialType = req.body.credentialType;

    try {
      const vc = await createVc(
        holderAddress,
        schemaURL,
        subjectData,
        credentialType
      );

      if (!vc) {
        return res.status(400).json({ message: "CAN NOT CREATE VC" });
      }

      const vcJwt = await signVc(vc);
      console.log(vcJwt);

      if (!vcJwt) {
        return res.status(400).json({ message: "CAN NOT CREATE SIGNED VC " });
      }

      res.status(200).json({ vc, vcJwt });
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
