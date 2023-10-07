import React from 'react';
import TableOfContents from '../ui/TableOfContents';
import AppHeader from '../ui/AppHeader';
import Wallet from './cards/UserInfoCard';
import WalletMethods from './cards/WalletMethodsCard';
import SendTransaction from './cards/SendTransactionsCard';
import Links from './Links';
import Spacer from '../ui/Spacer';
import HomePageBackground from 'public/main.svg';
import Navbar from '../navbar/Navbar';
interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Home({ setAccount }: Props) {
  return (
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
  );
}
