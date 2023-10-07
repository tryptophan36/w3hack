import React, { useCallback, useState } from 'react';
import Loading from 'public/loading.svg';
import ErrorText from '../../ui/Error';
import Spacer from '../../ui/Spacer';
import { useMagicContext } from '@/components/magic/MagicProvider';
import Image from 'next/image';
import {Typography} from '@mui/material'
const ShowUI = () => {
  const { magic } = useMagicContext();
  const [disabled, setDisabled] = useState(false);
  const [showUIError, setShowUIError] = useState(false);

  const showUI = useCallback(async () => {
    if (!magic) return;
    try {
      setShowUIError(false);
      const { walletType } = await magic.wallet.getInfo();
      if (walletType !== 'magic') {
        return setShowUIError(true);
      }
      setDisabled(true);
      await magic.wallet.showUI();
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic]);

  return (
    <div className="wallet-method-container">
      <button className="wallet-method" onClick={showUI} disabled={disabled}>
        {disabled ? (
          <div className="loading-container min-w-[76px]">
            <Image className="loading" alt="loading" src={Loading} />
          </div>
        ) : <p style={{fontWeight:"700"}}> View Profile</p>}
      </button>
      {showUIError ? (
        <div className="mb-[-10px]">
          <Spacer size={20} />
          <ErrorText>Method not supported for third party wallets.</ErrorText>
        </div>
      ) : null}
    </div>
  );
};

export default ShowUI;
