import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../voodoo-finance/ERC20';
import useVoodooFinance from './useVoodooFinance';
import config from '../config';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const voodooFinance = useVoodooFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
        try {
            setBalance(await voodooFinance.getBondsPurchasable());
        }
        catch(err) {
            console.error(err);
        }
      }
    fetchBondsPurchasable();
  }, [setBalance, voodooFinance]);

  return balance;
};

export default useBondsPurchasable;
