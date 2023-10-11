import React,{useState,useEffect} from 'react';

import Wallet from './cards/UserInfoCard';

import SendTransaction from './cards/SendTransactionsCard';
import Links from './Links';
import Spacer from '../ui/Spacer';

import Navbar from '../navbar/Navbar';
import { useMagicContext } from '@/components/magic/MagicProvider';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import AppContext from "../../context/AppContext"

interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Home({ setAccount }: Props) {
  const [address, setAddress] = useState<string>("")

  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
  
  const { magic } = useMagicContext();

  const bundler: IBundler = new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: 80001,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/DftNwkHsg.bc57aa1f-951f-4da2-82b3-168a81b27573"
  })
  useEffect(()=>{
    const getData = async ()=>{


    const web3Provider = new ethers.providers.Web3Provider((magic as any).rpcProvider,"any");
    
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

      console.log(smartAccount)
    }
    getData()
  
},[])
  return (
    <AppContext.Provider value={{address,provider,smartAccount}}>
    <div className="home-page">
      <Navbar />
      <Spacer size={205} />
      <Links />
      <Spacer size={120} />
      
      <div className="cards-container">
        <SendTransaction />
        <Wallet setAccount={setAccount} />
        <Spacer size={15} />
        <Links dark />
        <Spacer size={30} />
      </div>
    </div>
    </AppContext.Provider>
  );
}
