
import { ethers } from "ethers";
import {abi} from "./abi"

import { useMagicContext } from '@/components/magic/MagicProvider';
import { 
    PaymasterMode
  } from "@biconomy/paymaster"
  import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
const contractAddress = "0x7eC2B88bf05E93dB00281Ea64DE97FEEFa1BAf49"

const bundler= new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster  = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/uOPW_de8t.e3b4e54a-2e31-438a-9cab-057250c4b431"
  })

export const getUnsignedDoc = async (magic,address)=>{
    const provider = new ethers.providers.Web3Provider(
        (magic )?.rpcProvider,
      "any"
    )
    const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider,
      )

    const docs = await contract?.getDocumentsUnSignedByUser(address)
    return docs

}



export const getSignedDoc =async (magic,address)=>{
    const provider = new ethers.providers.Web3Provider(
        (magic )?.rpcProvider,
      "any"
    )
    const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider,
      )

    const docs = await contract?.getDocumentsSignedByUser(address)
    return docs
    
}
export const createDoc =async (magic,_doc,creator)=>{
    const provider = new ethers.providers.Web3Provider(
        (magic )?.rpcProvider,
      "any"
    )
    const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider,
      )
    const smartAccount = await getAccount(magic)
      const minTx = await contract?.populateTransaction.CreateDocument(_doc,creator);
      console.log("create data",minTx.data);
      const tx1 = {
        to: contractAddress,
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


    
}
export const AddSigner = async (magic,_docid,signer)=>{
  const provider = new ethers.providers.Web3Provider(
    (magic )?.rpcProvider,
  "any"
)
const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider,
  )
const smartAccount = await getAccount(magic)
  const minTx = await contract?.populateTransaction.addSigner(_docid,signer);
  console.log("create data",minTx.data);
  const tx1 = {
    to: contractAddress,
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
    
}
export const signDoc = async (magic,_docid)=>{
  const provider = new ethers.providers.Web3Provider(
    (magic )?.rpcProvider,
  "any"
)
const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider,
  )
const smartAccount = await getAccount(magic)
  const minTx = await contract?.populateTransaction.signDocument(_docid);
  console.log("create data",minTx.data);
  const tx1 = {
    to: contractAddress,
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
    
}
export const getDoc = async(magic,id)=>{
  const provider = new ethers.providers.Web3Provider(
    (magic )?.rpcProvider,
  "any"
)
const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider,
  )

const docs = await contract?.getDoc(id)
return docs
    
}


const getAccount = async (magic)=>{
           

    const web3Provider = new ethers.providers.Web3Provider(
      (magic)?.rpcProvider,
      "any"
    );
    console.log("provider",web3Provider)

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
      return biconomySmartAccount
    }
