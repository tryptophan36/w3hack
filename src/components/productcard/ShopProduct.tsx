import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CircularLoader from "../CircularLoader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  createAndSignPresentationJWT,
  EthrDIDMethod,
} from "@jpmorganchase/onyx-ssi-sdk";
import CircularProgress from "@mui/material/CircularProgress";
import Minter from "../Minter";
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function BasicCard({
  cardData,
  verified
}: {
  cardData: any;
  verified: boolean;
}) {
  const {
    title,
    image,
    address,
  }: {
    title: string;
    image: string;
    address:string;
  } = cardData;
  const [verifiedBal, setVerifiedBal] = useState(false);
  const config = {
    privateKey:
      "0x880eeca6e82a3f4a0a4855efac038315a8a9ec4d80b2a7990b1b7c5768267ab0",
    vcs: [
      "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiQmFsYW5jZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6Ik5hdGFsaWUgR2FyY2lhIiwiYmFsYW5jZSI6IiQ2LDAwMCJ9fSwic3ViIjoiZGlkOmV0aHI6bWF0aWNtdW06MHhkNzIxNWMxZTM5ZDA1ODI5OURmQTFiNDI4RDc5ZTVCNjNjRTE1ZGRBIiwianRpIjoiZGlkOmV0aHI6bWF0aWNtdW06MHg2M0M1MDYzMzc4NDQ1MjYxNzA1MjFhMzcwNTBEM0U5QjJmNTNiQ0UwIiwibmJmIjoxNjk2NTk0ODE2LCJpc3MiOiJkaWQ6ZXRocjptYXRpY211bToweGU2OWRDZjg5Zjg1MGI1NjZhNjU0N2MwNTlkMjMxNWY3YTZlRjAyQ2EifQ.2ASWeESQvazO1dlThyXVgs3DGXeoWTdzA4fB5N4l0E5cLAGomj-GChQkk54GFKOzIUuYov3jeAGry1iMEjZdmA",
    ],
    verifierUrl: "http://localhost:4000",
    web3: {
      web3HttpProvider: "https://rpc-mumbai.maticvigil.com/",
      didRegistryAddress: "0x33C695F89ab8F8f169fa652AD9a896C4e4AD34eb",
      name: "maticmum",
    },
  };
  async function setup() {
    try {
      const configaxios = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      };

      console.log("Creating Verifiable Presentation...");
      const signingKey = config.privateKey;
      const vcs = config.vcs;

      //get DID (did:ethr) from configured private key
      const ethrDID = new EthrDIDMethod({
        name: config.web3.name,
        registry: config.web3.didRegistryAddress,
        rpcUrl: config.web3.web3HttpProvider,
      });
      const subjectDID = await ethrDID.generateFromPrivateKey(signingKey);

      //create VP
      const vp = await createAndSignPresentationJWT(subjectDID, vcs);

      //Hit claim endpoint of Onyx Issuance Service
      console.log(
        `Sending Verifiable Presentation to Verifier at ${config.verifierUrl}`
      );
      const verificationResponse = await axios.post(
        `${config.verifierUrl}/verify`,
        { presentation: vp },
        configaxios
      );
      const verified = verificationResponse.data;

      //Log out relevant information
      console.log(`Verification Result: ${verified}`);
      return verified;
    } catch (err) {
      console.log(`Error encountered during setup. Aborting...`, err);
    }
  }

  return (
    <Card sx={{ width: "25%", margin: "1rem", Height: "200px" }}>
      <CardContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Typography sx={{ fontSize: 14 }} color="black" gutterBottom>
            {title}
          </Typography>
          <img
            style={{ height: "10rem", width: "10 rem", margin: "1rem 0" }}
            src={image}
            alt=""
          />
          <Box>
              {!verified && <Button onClick={()=>setup()} size="small">
               sign
              </Button>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
