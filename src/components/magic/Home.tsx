import React,{useState,useEffect} from 'react';
import Wallet from './cards/UserInfoCard';
import SendTransaction from './cards/SendTransactionsCard';
import Links from './Links';
import Spacer from '../ui/Spacer';
import Navbar from '../navbar/Navbar';
interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Home({ setAccount }: Props) {
 

  return (
    <>
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
    </>
  );
}
