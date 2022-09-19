import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import VoodImage from '../../assets/img/voodoo.png';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useVoodooStats from '../../hooks/useVoodooStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usevShareStats from '../../hooks/usevShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { voodoo as voodooTesting, vShare as vShareTesting } from '../../voodoo-finance/deployments/deployments.testing.json';
import { voodoo as voodooProd, vShare as vShareProd } from '../../voodoo-finance/deployments/deployments.mainnet.json';

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useVoodooFinance from '../../hooks/useVoodooFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;


const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const voodooEvmosLpStats = useLpStats('VOODOO-EVMOS-LP');
  const vShareEvmosLpStats = useLpStats('VSHARE-EVMOS-LP');
  const voodooStats = useVoodooStats();
  const vShareStats = usevShareStats();
  const vBondStats = useBondStats();
  const voodooFinance = useVoodooFinance();

  let voodoo;
  let vShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    voodoo = voodooTesting;
    vShare = vShareTesting;
  } else {
    voodoo = voodooProd;
    vShare = vShareProd;
  }

  const buyVoodooAddress = 'https://spookyswap.finance/swap?outputCurrency=' + voodoo.address;
  const buyVShareAddress = 'https://spookyswap.finance/swap?outputCurrency=' + vShare.address;

  const voodooLPStats = useMemo(() => (voodooEvmosLpStats ? voodooEvmosLpStats : null), [voodooEvmosLpStats]);
  const vshareLPStats = useMemo(() => (vShareEvmosLpStats ? vShareEvmosLpStats : null), [vShareEvmosLpStats]);
  const voodooPriceInDollars = useMemo(
    () => (voodooStats ? Number(voodooStats.priceInDollars).toFixed(2) : null),
    [voodooStats],
  );
  const voodooPriceInEVMOS = useMemo(() => (voodooStats ? Number(voodooStats.tokenInEvmos).toFixed(4) : null), [voodooStats]);
  const voodooCirculatingSupply = useMemo(() => (voodooStats ? String(voodooStats.circulatingSupply) : null), [voodooStats]);
  const voodooTotalSupply = useMemo(() => (voodooStats ? String(voodooStats.totalSupply) : null), [voodooStats]);

  const vSharePriceInDollars = useMemo(
    () => (vShareStats ? Number(vShareStats.priceInDollars).toFixed(2) : null),
    [vShareStats],
  );
  const vSharePriceInEVMOS = useMemo(
    () => (vShareStats ? Number(vShareStats.tokenInEvmos).toFixed(4) : null),
    [vShareStats],
  );
  const vShareCirculatingSupply = useMemo(
    () => (vShareStats ? String(vShareStats.circulatingSupply) : null),
    [vShareStats],
  );
  const vShareTotalSupply = useMemo(() => (vShareStats ? String(vShareStats.totalSupply) : null), [vShareStats]);

  const vBondPriceInDollars = useMemo(
    () => (vBondStats ? Number(vBondStats.priceInDollars).toFixed(2) : null),
    [vBondStats],
  );
  const vBondPriceInEVMOS = useMemo(() => (vBondStats ? Number(vBondStats.tokenInEvmos).toFixed(4) : null), [vBondStats]);
  const vBondCirculatingSupply = useMemo(
    () => (vBondStats ? String(vBondStats.circulatingSupply) : null),
    [vBondStats],
  );
  const vBondTotalSupply = useMemo(() => (vBondStats ? String(vBondStats.totalSupply) : null), [vBondStats]);

  const voodooLpZap = useZap({ depositTokenName: 'VOODOO-EVMOS-LP' });
  const vshareLpZap = useZap({ depositTokenName: 'VSHARE-EVMOS-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
  `;

  const [onPresentVoodooZap, onDissmissVoodooZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        voodooLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissVoodooZap();
      }}
      tokenName={'VOODOO-EVMOS-LP'}
    />,
  );

  const [onPresentVshareZap, onDissmissVshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        vshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissVshareZap();
      }}
      tokenName={'VSHARE-EVMOS-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid container item xs={12} sm={4} justify="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
          <Image color="none" style={{ width: '300px', paddingTop: '0px' }} src={VoodImage} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4}>
              <h2>Welcome to Voodoo Finance</h2>
              <p>The first algorithmic stablecoin on EVMOS Network, pegged to the price of 1 EVMOS via seigniorage.</p>
              <p>
                Stake your VOODOO-EVMOS LP in the FARM to earn VSHARE rewards.
                Then stake your earned VSHARE in the Staking to earn more VOODOO!
              </p>
            </Box>
          </Paper>



        </Grid>

        <Grid container spacing={3}>
        </Grid>

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button color="primary" href="/staking" variant="contained" style={{ marginRight: '10px' }}>
                Stake Now
              </Button>
              <Button href="/farming" variant="contained" style={{ marginRight: '10px' }}>
                Farm Now
              </Button>
              <Button
                color="primary"
                target="_blank"
                href={buyVoodooAddress}
                variant="contained"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy VOODOO
              </Button>
              <Button variant="contained" target="_blank" href={buyVShareAddress} className={classes.button}>
                Buy VSHARE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* VOODOO */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>VOODOO</h2>
              <Button
                onClick={() => {
                  voodooFinance.watchAssetInMetamask('VOODOO');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="VOODOO" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{voodooPriceInEVMOS ? voodooPriceInEVMOS : '-.----'} EVMOS</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${voodooPriceInDollars ? voodooPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(voodooCirculatingSupply * voodooPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {voodooCirculatingSupply} <br />
                Total Supply: {voodooTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* VSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>VSHARE</h2>
              <Button
                onClick={() => {
                  voodooFinance.watchAssetInMetamask('VSHARE');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="VSHARE" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{vSharePriceInEVMOS ? vSharePriceInEVMOS : '-.----'} EVMOS</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${vSharePriceInDollars ? vSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(vShareCirculatingSupply * vSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {vShareCirculatingSupply} <br />
                Total Supply: {vShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* VBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>VBOND</h2>
              <Button
                onClick={() => {
                  voodooFinance.watchAssetInMetamask('VBOND');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="VBOND" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{vBondPriceInEVMOS ? vBondPriceInEVMOS : '-.----'} EVMOS</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${vBondPriceInDollars ? vBondPriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(vBondCirculatingSupply * vBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {vBondCirculatingSupply} <br />
                Total Supply: {vBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
