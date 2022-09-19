import React, { useState, useMemo } from 'react';

import { Button, Select, MenuItem, InputLabel, Typography, withStyles } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useVoodooFinance from '../../../hooks/useVoodooFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { VOODOO_TICKER, VSHARE_TICKER, EVMOS_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string) => void;
  tokenName?: string;
  decimals?: number;
}

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18 }) => {
  const voodooFinance = useVoodooFinance();
  const { balance } = useWallet();
  const evmosBalance = (Number(balance) / 1e18).toFixed(4).toString();
  const voodooBalance = useTokenBalance(voodooFinance.VOODOO);
  const vshareBalance = useTokenBalance(voodooFinance.VSHARE);
  const [val, setVal] = useState('');
  const [zappingToken, setZappingToken] = useState(EVMOS_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(evmosBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be EVMOS in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  const voodooEvmosLpStats = useLpStats('VOODOO-EVMOS-LP');
  const vShareEvmosLpStats = useLpStats('VSHARE-EVMOS-LP');
  const voodooLPStats = useMemo(() => (voodooEvmosLpStats ? voodooEvmosLpStats : null), [voodooEvmosLpStats]);
  const vshareLPStats = useMemo(() => (vShareEvmosLpStats ? vShareEvmosLpStats : null), [vShareEvmosLpStats]);
  const evmosAmountPerLP = tokenName.startsWith(VOODOO_TICKER) ? voodooLPStats?.evmosAmount : vshareLPStats?.evmosAmount;
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
    setZappingTokenBalance(evmosBalance);
    if (event.target.value === VSHARE_TICKER) {
      setZappingTokenBalance(getDisplayBalance(vshareBalance, decimals));
    }
    if (event.target.value === VOODOO_TICKER) {
      setZappingTokenBalance(getDisplayBalance(voodooBalance, decimals));
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    const estimateZap = await voodooFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const estimateZap = await voodooFinance.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  return (
    <Modal>
      <ModalTitle text={`Zap in ${tokenName}`} />
      <Typography variant="h6" align="center">
        Powered by{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://mlnl.finance">
          mlnl.finance
        </a>
      </Typography>

      <StyledActionSpacer />
      <InputLabel style={{ color: '#2c2560' }} id="label">
        Select asset to zap with
      </InputLabel>
      <Select
        onChange={handleChangeAsset}
        style={{ color: '#2c2560' }}
        labelId="label"
        id="select"
        value={zappingToken}
      >
        <StyledMenuItem value={EVMOS_TICKER}>EVMOS</StyledMenuItem>
        <StyledMenuItem value={VSHARE_TICKER}>VSHARE</StyledMenuItem>
        {/* Voodoo as an input for zapping will be disabled due to issues occuring with the Gatekeeper system */}
        {/* <StyledMenuItem value={VOODOO_TICKER}>VOODOO</StyledMenuItem> */}
      </Select>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <Label text="Zap Estimations" />
      <StyledDescriptionText>
        {' '}
        {tokenName}: {Number(estimate.token0) / Number(evmosAmountPerLP)}
      </StyledDescriptionText>
      <StyledDescriptionText>
        {' '}
        ({Number(estimate.token0)} {EVMOS_TICKER} / {Number(estimate.token1)}{' '}
        {tokenName.startsWith(VOODOO_TICKER) ? VOODOO_TICKER : VSHARE_TICKER}){' '}
      </StyledDescriptionText>
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : onConfirm(zappingToken, tokenName, val)
          }
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Let's go"}
        </Button>
      </ModalActions>

      <StyledActionSpacer />
      <Alert variant="filled" severity="warning">
        Beta feature. Use at your own risk!
      </Alert>
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#2c2560',
    '&:hover': {
      backgroundColor: 'grey',
      color: '#2c2560',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
