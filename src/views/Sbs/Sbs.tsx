import React, { /*useCallback, useEffect, */useMemo, useState } from 'react';
import Page from '../../components/Page';
import BondRoomImage from '../../assets/img/home.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box,/* Paper, Typography,*/ Button, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useVoodooFinance from '../../hooks/useVoodooFinance';
import { getDisplayBalance/*, getBalance*/ } from '../../utils/formatBalance';
import { BigNumber/*, ethers*/ } from 'ethers';
import useSwapVBondToVShare from '../../hooks/VShareSwapper/useSwapVBondToVShare';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useVShareSwapperStats from '../../hooks/VShareSwapper/useVShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${BondRoomImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Sbs: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const voodooFinance = useVoodooFinance();
  const [vbondAmount, setVbondAmount] = useState('');
  const [vshareAmount, setVshareAmount] = useState('');

  const [approveStatus, approve] = useApprove(voodooFinance.VBOND, voodooFinance.contracts.VShareSwapper.address);
  const { onSwapVShare } = useSwapVBondToVShare();
  const vshareSwapperStat = useVShareSwapperStats(account);

  const vshareBalance = useMemo(() => (vshareSwapperStat ? Number(vshareSwapperStat.vshareBalance) : 0), [vshareSwapperStat]);
  const bondBalance = useMemo(() => (vshareSwapperStat ? Number(vshareSwapperStat.vbondBalance) : 0), [vshareSwapperStat]);

  const handleVBondChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setVbondAmount('');
      setVshareAmount('');
      return
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVbondAmount(e.currentTarget.value);
    const updateVShareAmount = await voodooFinance.estimateAmountOfVShare(e.currentTarget.value);
    setVshareAmount(updateVShareAmount);  
  };

  const handleVBondSelectMax = async () => {
    setVbondAmount(String(bondBalance));
    const updateVShareAmount = await voodooFinance.estimateAmountOfVShare(String(bondBalance));
    setVshareAmount(updateVShareAmount); 
  };

  const handleVShareSelectMax = async () => {
    setVshareAmount(String(vshareBalance));
    const rateVSharePerVoodoo = (await voodooFinance.getVShareSwapperStat(account)).rateVSharePerVoodoo;
    const updateVBondAmount = ((BigNumber.from(10).pow(30)).div(BigNumber.from(rateVSharePerVoodoo))).mul(Number(vshareBalance) * 1e6);
    setVbondAmount(getDisplayBalance(updateVBondAmount, 18, 6));
  };

  const handleVShareChange = async (e: any) => {
    const inputData = e.currentTarget.value;
    if (inputData === '') {
      setVshareAmount('');
      setVbondAmount('');
      return
    }
    if (!isNumeric(inputData)) return;
    setVshareAmount(inputData);
    const rateVSharePerVoodoo = (await voodooFinance.getVShareSwapperStat(account)).rateVSharePerVoodoo;
    const updateVBondAmount = ((BigNumber.from(10).pow(30)).div(BigNumber.from(rateVSharePerVoodoo))).mul(Number(inputData) * 1e6);
    setVbondAmount(getDisplayBalance(updateVBondAmount, 18, 6));
  }

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="VBond -> VShare Swap" subtitle="Swap VBond to VShare" />
            </Route>
            <Box mt={5}>
              <Grid container justify="center" spacing={6}>
                <StyledBoardroom>
                  <StyledCardsWrapper>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>VBonds</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={voodooFinance.VBOND.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleVBondSelectMax}
                                onChange={handleVBondChange}
                                value={vbondAmount}
                                max={bondBalance}
                                symbol="VBond"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${bondBalance} VBOND Available in Wallet`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                    <Spacer size="lg"/>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>VShare</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={voodooFinance.VSHARE.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleVShareSelectMax}
                                onChange={handleVShareChange}
                                value={vshareAmount}
                                max={vshareBalance}
                                symbol="VShare"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${vshareBalance} VSHARE Available in Swapper`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
              
                    </StyledCardWrapper>
                  </StyledCardsWrapper>
                </StyledBoardroom>
              </Grid>
            </Box>

            <Box mt={5}>
              <Grid container justify="center">
                <Grid item xs={8}>
                  <Card>
                    <CardContent>
                      <StyledApproveWrapper>
                      {approveStatus !== ApprovalState.APPROVED ? (
                        <Button
                          disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                          color="primary"
                          variant="contained"
                          onClick={approve}
                          size="medium"
                        >
                          Approve VBOND
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => onSwapVShare(vbondAmount.toString())}
                          size="medium"
                        >
                          Swap
                        </Button>
                      )}
                      </StyledApproveWrapper>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledApproveWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDesc = styled.span``;

export default Sbs;
