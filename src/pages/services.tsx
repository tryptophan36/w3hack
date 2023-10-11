import React from "react";
import { useEffect, useState } from "react";
import ShopProduct from "../components/productcard/ShopProduct";
import Navbar from "../components/navbar/Navbar";
import SendTransaction from "@/components/magic/cards/SendTransactionsCard";

import { Box, Container } from "@mui/material";
import axios from 'axios';
import { createAndSignPresentationJWT, EthrDIDMethod } from "@jpmorganchase/onyx-ssi-sdk"

function Services() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      fetch("https://fakestoreapi.com/products?limit=6")
        .then((res) => res.json())
        .then((data) =>{ 
          console.log(data)
          setProducts(data)});
     
    };
    fetchAllData();
  }, []);

  const [verified,setVerified]= useState(false)
  React.useEffect(()=>{
    const config = {
      "privateKey": "0x53533b6a0ca8969a63537adbb8f12e6cb76c03aae063d3768079a290d2e02ebd",
      "vcs": ["eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpZWRDdXN0b21lciJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiTmF0YWxpZSBHYXJjaWEifX0sInN1YiI6ImRpZDpldGhyOm1hdGljbXVtOjB4QzU0N0QxNjI1ZjQzYmExM2RDY2NiQjhCMzVENTViMmZCOTdiMjczNCIsImp0aSI6ImRpZDpldGhyOm1hdGljbXVtOjB4MDQyNDdiNDg4QTg4MjY2OTI0MjRiNmZkZmIzOTFmRjhkYmYwMWYyZSIsIm5iZiI6MTY5NjU5NDY3MCwiaXNzIjoiZGlkOmV0aHI6bWF0aWNtdW06MHhlNjlkQ2Y4OWY4NTBiNTY2YTY1NDdjMDU5ZDIzMTVmN2E2ZUYwMkNhIn0.KI793-0_HOnD4HKS2UlnYROd98tloGrBFmszfZS6PrvuhbohymyhrkvpZyXBi2K92a3DjpevFCP2tPBqEJJ--Q"],
      "verifierUrl": "http://localhost:4000",
      "web3": {
          "web3HttpProvider": "https://rpc-mumbai.maticvigil.com/",
          "didRegistryAddress": "0x33C695F89ab8F8f169fa652AD9a896C4e4AD34eb",
          "name": "maticmum"
      }
  }
    async function setup() {
      try {
        const configaxios = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        };
        
          console.log("Creating Verifiable Presentation...");
          const signingKey = config.privateKey
          const vcs = config.vcs
  
          //get DID (did:ethr) from configured private key
          const ethrDID = new EthrDIDMethod({
              name: config.web3.name,
              registry: config.web3.didRegistryAddress,
              rpcUrl: config.web3.web3HttpProvider
          })
          const subjectDID = await ethrDID.generateFromPrivateKey(signingKey)
  
          //create VP
          const vp = await createAndSignPresentationJWT(subjectDID, vcs)
  
          
          //Hit claim endpoint of Onyx Issuance Service
          console.log(`Sending Verifiable Presentation to Verifier at ${config.verifierUrl}`)
          const verificationResponse = await axios.post(`${config.verifierUrl}/verify`, 
          {presentation: vp},configaxios)
          const verified = verificationResponse.data;
  
          //Log out relevant information
          console.log(`Verification Result: ${verified}`)
          return verified
  
      } catch (err) {
          console.log(`Error encountered during setup. Aborting...`, err);
          
      }
  
  }
  setup().then(v=>setVerified(v))

  },[verified])

  return (
    <>
      <Navbar />
      <div className="home-page">
        <Box m="2.5rem">
          <SendTransaction />
        </Box>
        <Box
          sx={{
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"center"
          }}
        >
          {products.map((p) => {
            
            return <ShopProduct shopData={p} verified={verified}/>;
          })}

         
        </Box>
        
      </div>
      <Box></Box>
    </>
  );
}

export default Services;
