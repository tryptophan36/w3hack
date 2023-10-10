
import { useState,useContext,useEffect } from 'react';
import styles from '@/styles/Home.module.css'
import { ethers } from "ethers";
import abi from "../utils/abi.json"
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

const nftAddress = "0x0a7755bDfb86109D9D403005741b415765EAf1Bc"

const Minter= () => {
    const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false);
  const [smartAccount, setSmartAccount] = useState(null);
  const [provider, setProvider] = useState(null)
  const [publicAddress,setPublicAdress]=useState('')
 const magic = useMagicContext()
  const bundler= new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: 80001,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster  = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/DftNwkHsg.bc57aa1f-951f-4da2-82b3-168a81b27573"
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
          
          const magic = new Magic('pk_live_F8BA0E6996209A77', {
            network: {
                rpcUrl: 'https://goerli.base.org', // or https://matic-mumbai.chainstacklabs.com for testnet
                chainId: 84531 // or 80001 for polygon testnet
            }
          });
          const web3Provider = await magic.wallet.getProvider()
          setProvider(web3Provider);
          const module = await ECDSAOwnershipValidationModule.create({
            signer: web3Provider.getSigner(),
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
            })
            let biconomySmartAccount = await BiconomySmartAccountV2.create({
              chainId: ChainId.POLYGON_MUMBAI,
              bundler: bundler, 
              paymaster: paymaster,
              entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
              defaultValidationModule: module,
              activeValidationModule: module
            })
            setAddress( await biconomySmartAccount.getAccountAddress())
            setSmartAccount(biconomySmartAccount)
            setLoading(false)
            console.log(smartAccount)
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
      console.log(minTx.data);
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