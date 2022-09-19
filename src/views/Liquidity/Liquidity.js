import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png';
import useLpStats from '../../hooks/useLpStats';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import useVoodooStats from '../../hooks/useVoodooStats';
import TokenInput from '../../components/TokenInput';
import useVoodooFinance from '../../hooks/useVoodooFinance';
import { useWallet } from 'use-wallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApproveTaxOffice from '../../hooks/useApproveTaxOffice';
import { ApprovalState } from '../../hooks/useApprove';
import useProvideVoodooEvmosLP from '../../hooks/useProvideVoodooEvmosLP';
import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const ProvideLiquidity = () => {
  const [voodooAmount, setVoodooAmount] = useState(0);
  const [evmosAmount, setEvmosAmount] = useState(0);
  const [lpTokensAmount, setLpTokensAmount] = useState(0);
  const { balance } = useWallet();
  const voodooStats = useVoodooStats();
  const voodooFinance = useVoodooFinance();
  const [approveTaxOfficeStatus, approveTaxOffice] = useApproveTaxOffice();
  const voodooBalance = useTokenBalance(voodooFinance.VOODOO);
  const evmosBalance = (balance / 1e18).toFixed(4);
  const { onProvideVoodooEvmosLP } = useProvideVoodooEvmosLP();
  const voodooEvmosLpStats = useLpStats('VOODOO-EVMOS-LP');

  const voodooLPStats = useMemo(() => (voodooEvmosLpStats ? voodooEvmosLpStats : null), [voodooEvmosLpStats]);
  const voodooPriceInEVMOS = useMemo(() => (voodooStats ? Number(voodooStats.tokenInEvmos).toFixed(2) : null), [voodooStats]);
  const evmosPriceInVOODOO = useMemo(() => (voodooStats ? Number(1 / voodooStats.tokenInEvmos).toFixed(2) : null), [voodooStats]);
  // const classes = useStyles();

  const handleVoodooChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVoodooAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVoodooAmount(e.currentTarget.value);
    const quoteFromSpooky = await voodooFinance.quoteFromSpooky(e.currentTarget.value, 'VOODOO');
    setEvmosAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / voodooLPStats.evmosAmount);
  };

  const handleEvmosChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setEvmosAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setEvmosAmount(e.currentTarget.value);
    const quoteFromSpooky = await voodooFinance.quoteFromSpooky(e.currentTarget.value, 'EVMOS');
    setVoodooAmount(quoteFromSpooky);

    setLpTokensAmount(quoteFromSpooky / voodooLPStats.tokenAmount);
  };
  const handleVoodooSelectMax = async () => {
    const quoteFromSpooky = await voodooFinance.quoteFromSpooky(getDisplayBalance(voodooBalance), 'VOODOO');
    setVoodooAmount(getDisplayBalance(voodooBalance));
    setEvmosAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / voodooLPStats.evmosAmount);
  };
  const handleEvmosSelectMax = async () => {
    const quoteFromSpooky = await voodooFinance.quoteFromSpooky(evmosBalance, 'EVMOS');
    setEvmosAmount(evmosBalance);
    setVoodooAmount(quoteFromSpooky);
    setLpTokensAmount(evmosBalance / voodooLPStats.evmosAmount);
  };
  return (
    <Page>
      <BackgroundImage />
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Provide Liquidity
      </Typography>

      <Grid container justify="center">
        <Box style={{ width: '600px' }}>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '10px' }}>
            <b>This and <a href=""  rel="noopener noreferrer" target="_blank">EVMOS-swap</a> are the only ways to provide Liquidity on VOODOO-EVMOS pair without paying tax.</b>
          </Alert>
          <Grid item xs={12} sm={12}>
            <Paper>
              <Box mt={4}>
                <Grid item xs={12} sm={12} style={{ borderRadius: 15 }}>
                  <Box p={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleVoodooSelectMax}
                          onChange={handleVoodooChange}
                          value={voodooAmount}
                          max={getDisplayBalance(voodooBalance)}
                          symbol={'VOODOO'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleEvmosSelectMax}
                          onChange={handleEvmosChange}
                          value={evmosAmount}
                          max={evmosBalance}
                          symbol={'EVMOS'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <p>1 VOODOO = {voodooPriceInEVMOS} EVMOS</p>
                        <p>1 EVMOS = {evmosPriceInVOODOO} VOODOO</p>
                        <p>LP tokens ≈ {lpTokensAmount.toFixed(2)}</p>
                      </Grid>
                      <Grid xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                        {approveTaxOfficeStatus === ApprovalState.APPROVED ? (
                          <Button
                            variant="contained"
                            onClick={() => onProvideVoodooEvmosLP(evmosAmount.toString(), voodooAmount.toString())}
                            color="primary"
                            style={{ margin: '0 10px', color: '#fff' }}
                          >
                            Supply
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => approveTaxOffice()}
                            color="secondary"
                            style={{ margin: '0 10px' }}
                          >
                            Approve
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};

export default ProvideLiquidity;
