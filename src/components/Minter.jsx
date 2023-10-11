
import { useState,useContext,useEffect } from 'react';
import {Alert,Modal,Box,Button} from '@mui/material';

import styles from '@/styles/Home.module.css'
import { ethers } from "ethers";
import {abi} from "../utils/abi"
import { 

  PaymasterMode
} from "@biconomy/paymaster"


import { useMagicContext } from '@/components/magic/MagicProvider';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

const nftAddress = "0xd5E558E8aDECeD4b48bd58970415720860A21265"

const Minter= (verified) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [verifying,setVerifying]=useState(false)
  const [plVerify,setplVerify]=useState(false)
    const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false);
  const [smartAccount, setSmartAccount] = useState(null);
  const [provider, setProvider] = useState(null)
  const [publicAddress,setPublicAdress]=useState('')
 const {magic} = useMagicContext()
  const bundler= new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster  = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/84531/_C8rl1xGD.77b4a3b2-11ef-40cd-8291-1f015aba2e94"
  })
  useEffect(()=>{
    try {
        const getData = async ()=>{
          
          const web3Provider = new ethers.providers.Web3Provider(
            magic?.rpcProvider,
            "any"
          );
          console.log("provider",web3Provider)
          setProvider(web3Provider);
          const module = await ECDSAOwnershipValidationModule.create({
            signer: web3Provider.getSigner(),
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
            })
            let biconomySmartAccount = await BiconomySmartAccountV2.create({
              chainId: ChainId.BASE_GOERLI_TESTNET,
              bundler: bundler, 
              paymaster: paymaster,
              entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
              defaultValidationModule: module,
              activeValidationModule: module
            })
            console.log(await biconomySmartAccount.getAccountAddress())
            setAddress( await biconomySmartAccount.getAccountAddress())
            setSmartAccount(biconomySmartAccount)
            setLoading(false)
            console.log(biconomySmartAccount)
          }
          getData()
    } catch (error) {
        console.log(error)
    }
  
},[magic])
    const [minted, setMinted] = useState(false)
  const handleMint = async () => {
    const contract = new ethers.Contract(
      nftAddress,
      abi,
      provider,
    )

    try {
      if(verified)
      {
        handleOpen()
      setVerifying(true)
      const minTx = await contract.populateTransaction.PayLater();
      console.log("mint data",minTx.data);
      const tx1 = {
        to: nftAddress,
        data: minTx.data,
      };
      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log({ userOp })
      const biconomyPaymaster =
        smartAccount.paymaster ;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0'
        },
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
        
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      setMinted(true)
      setplVerify(true)
      setVerifying(false)
      setTimeout(()=>
      {setplVerify(false)
       handleClose()
      },10000)

      }
      else{

      }
    } catch (err) {
      console.error(err);
      console.log(err)
    }
  }


    return(
      <>
      {address && <button onClick={handleMint} 
       className={styles.connect}
       style={{border:"2px solid black"}}
      >Pay Later</button>}
      <Modal
  open={open}
  style={{display:"flex",alignItems:"center",justifyContent:"center"}}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={{}}>
  { verifying && <Alert severity="info">verifying your Balance credentials...</Alert>}
    {plVerify && <Alert severity="success"
     sx={{display:"flex",flexDirection:"column"}}
    >
      <h6>Successfully Verified</h6>
      <a 
      target='_blank'
      href={`https://testnets.opensea.io/${address}`} style={{}}>Click To view Your Gasless Transaction</a>
      
      </Alert>}
      <Button sx={{background:"black"}}  onClick={()=>{handleClose()}}>Close</Button>
  </Box>
</Modal>
      </>
    )
  }
  
  export default Minter;