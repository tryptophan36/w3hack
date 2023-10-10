
import { useState,useContext,useEffect } from 'react';
import styles from '@/styles/Home.module.css'
import { ethers } from "ethers";
import {abi} from "../utils/abi"
import { 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from "@biconomy/paymaster"
import { BiconomySmartAccount } from "@biconomy/account"
import AppContext from '../context/AppContext';
import { toast, ToastContainer } from "react-toastify";
import { Magic } from 'magic-sdk';
import { useMagicContext } from '@/components/magic/MagicProvider';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

const nftAddress = "0xc8f929C3e35F5b7761fC5F169215f02AA06B4C5B"

const Minter= () => {
    const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false);
  const [smartAccount, setSmartAccount] = useState(null);
  const [provider, setProvider] = useState(null)
  const [publicAddress,setPublicAdress]=useState('')
 const magic = useMagicContext()
  const bundler= new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster  = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/84531/6I1OwIMmr.0c5f6fb5-0857-4fe1-a613-4ffe5e799b03"
  })
  useEffect(()=>{
    try {
        const getData = async ()=>{
            const getLocal = async ()=>{
              const publicAddress =  localStorage.getItem('user');
              setPublicAdress(publicAddress)
            }
            getLocal()
            console.log("home")
          const userAddress = publicAddress;
          
          const magic2 = new Magic('pk_live_555823115CD31C6D', {
            network: {
                rpcUrl: 'https://goerli.base.org', // or https://matic-mumbai.chainstacklabs.com for testnet
                chainId: ChainId.BASE_GOERLI_TESTNET // or 80001 for polygon testnet
            }
          });
          const web3Provider = new ethers.providers.Web3Provider(
            magic2.rpcProvider,
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
        toast.info('Minting your NFT...', {
            position: "top-right",
            autoClose: 15000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });

      const minTx = await contract.populateTransaction.safeMint(address);
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
    toast.success(`Success! Here is your transaction:${receipt.transactionHash} `, {
      position: "top-right",
      autoClose: 18000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
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
      >Mint NFT</button>}
  {minted && <a href={`https://testnets.opensea.io/${address}`}> Click to view minted nfts for smart account</a>}
  <ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  />
      </>
    )
  }
  
  export default Minter;