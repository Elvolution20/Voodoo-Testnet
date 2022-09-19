import React from 'react';

//Graveyard ecosystem logos
import voodooLogo from '../../assets/img/voodoo_cash.png';
import vShareLogo from '../../assets/img/voodoo_share.png';
import voodooLogoPNG from '../../assets/img/voodoo_cash.png';
import vShareLogoPNG from '../../assets/img/voodoo_share.png';
import vBondLogo from '../../assets/img/voodoo_bond.png';

import voodooEvmosLpLogo from '../../assets/img/voodoo_evmos_lp.png';
import vshareEvmosLpLogo from '../../assets/img/vshare_evmos_lp.png';

import wevmosLogo from '../../assets/img/evmos_logo_blue.svg';
import booLogo from '../../assets/img/spooky.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  VOODOO: voodooLogo,
  VOODOOPNG: voodooLogoPNG,
  VSHAREPNG: vShareLogoPNG,
  VSHARE: vShareLogo,
  VBOND: vBondLogo,
  WEVMOS: wevmosLogo,
  BOO: booLogo,
  SHIBA: shibaLogo,
  ZOO: zooLogo,
  'VOODOO-EVMOS-LP': voodooEvmosLpLogo,
  'VSHARE-EVMOS-LP': vshareEvmosLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
