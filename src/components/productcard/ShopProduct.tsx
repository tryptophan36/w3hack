import * as React from "react";
import { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CircularLoader from "../CircularLoader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {getDoc,signDoc} from "../../utils/contractMethods.js"
import { useMagicContext } from '@/components/magic/MagicProvider';
import axios from "axios";
import {
  createAndSignPresentationJWT,
  EthrDIDMethod,
} from "@jpmorganchase/onyx-ssi-sdk";
// import CircularProgress from "@mui/material/CircularProgress";
// import Minter from "../Minter";
// const bull = (
//   <Box
//     component="span"
//     sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
//   >
//     •
//   </Box>
// );

export default function BasicCard(props:any){
console.log("id",props.id)
  const { magic } = useMagicContext();

  // const [title,setTitle] = useState("")
  // const [image,setImage] = useState("")
  // const [isSigned,setIsSigned] = useState(false)
  const [doc,setDoc] = useState<any>(null)
    
  useEffect(()=>{
    const getDocument = async()=>{
      const doc = await getDoc(magic,props.id)
      return doc


    }



    getDocument().then(v=>setDoc(v))
  },[])

  console.log("doc",doc)

  // const [verifiedSign, setVerifiedSign] = useState(false);
  const config = {
    privateKey:
      "0x53533b6a0ca8969a63537adbb8f12e6cb76c03aae063d3768079a290d2e02ebd",
    vcs: [
"eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpZWRDdXN0b21lciJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiTmF0YWxpZSBHYXJjaWEifX0sInN1YiI6ImRpZDpldGhyOm1hdGljbXVtOjB4QzU0N0QxNjI1ZjQzYmExM2RDY2NiQjhCMzVENTViMmZCOTdiMjczNCIsImp0aSI6ImRpZDpldGhyOm1hdGljbXVtOjB4MDQyNDdiNDg4QTg4MjY2OTI0MjRiNmZkZmIzOTFmRjhkYmYwMWYyZSIsIm5iZiI6MTY5NjU5NDY3MCwiaXNzIjoiZGlkOmV0aHI6bWF0aWNtdW06MHhlNjlkQ2Y4OWY4NTBiNTY2YTY1NDdjMDU5ZDIzMTVmN2E2ZUYwMkNhIn0.KI793-0_HOnD4HKS2UlnYROd98tloGrBFmszfZS6PrvuhbohymyhrkvpZyXBi2K92a3DjpevFCP2tPBqEJJ--Q"    ],
    verifierUrl: "http://localhost:4000",
    web3: {
      web3HttpProvider: "https://rpc-mumbai.maticvigil.com/",
      didRegistryAddress: "0x33C695F89ab8F8f169fa652AD9a896C4e4AD34eb",
      name: "maticmum",
    },
  };
  async function Verify() {
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

  const sign = async()=>{
    console.log("sign")
    const verified = await Verify()
    if(verified){
      await signDoc(magic,props.id)


    }
    else{
      console.log("not verified")
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
          padding="0.5rem"
        >
          <Typography variant="h6"
           sx={{ fontSize: 14,
             textOverflow:"auto"
           }} color="black" gutterBottom>
            {doc?.creator}
          </Typography>
          <img
            style={{ height: "13rem", width: "11rem", margin: "0" }}
            src={doc?.documentMetaData}
            alt=""
          />
          <Box>
              {props.isPending && <Button onClick={()=>sign()} size="small">
               sign
              </Button>}
          </Box>
     { !doc?.isSigned &&  <Typography margin="0.5rem" color="red">Not Signed By All Signers</Typography>}
     {doc?.isSigned && <Typography margin="0.5rem" color="green">Signed By All Signers</Typography> }
        </Box>
      </CardContent>
    </Card>
  );
}