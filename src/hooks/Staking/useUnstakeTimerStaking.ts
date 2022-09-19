import { useEffect, useState } from 'react';
import useVoodooFinance from '../useVoodooFinance';
import { AllocationTime } from '../../voodoo-finance/types';

const useUnstakeTimerStaking = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const voodooFinance = useVoodooFinance();

  useEffect(() => {
    if (voodooFinance) {
      voodooFinance.getUserUnstakeTime().then(setTime);
    }
  }, [voodooFinance]);
  return time;
};

export default useUnstakeTimerStaking;
