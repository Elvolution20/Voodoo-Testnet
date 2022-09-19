import { useCallback } from 'react';
import useVoodooFinance from './useVoodooFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from '../utils/constants'

const useProvideVoodooEvmosLP = () => {
  const voodooFinance = useVoodooFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideVoodooEvmosLP = useCallback(
    (evmosAmount: string, voodooAmount: string) => {
      const voodooAmountBn = parseUnits(voodooAmount);
      handleTransactionReceipt(
        voodooFinance.provideVoodooEvmosLP(evmosAmount, voodooAmountBn),
        `Provide Voodoo-EVMOS LP ${voodooAmount} ${evmosAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [voodooFinance, handleTransactionReceipt],
  );
  return { onProvideVoodooEvmosLP: handleProvideVoodooEvmosLP };
};

export default useProvideVoodooEvmosLP;
