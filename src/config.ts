// import { ChainId } from '@pancakeswap-libs/sdk';
import { Configuration } from './voodoo-finance/config';
import { BankInfo } from './voodoo-finance';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: 9000,
    networkName: 'EVMOS Testnet',
    evmosscanUrl: 'https://evm.evmos.dev',
    defaultProvider: 'https://eth.bd.evmos.dev:8545',
    deployments: require('./voodoo-finance/deployments/deployments.testing.json'),
    externalTokens: {
      WEVMOS: ['', 18],
      USDT: ['', 6],
      'USDT-EVMOS-LP': ['', 18],
      'VOODOO-EVMOS-LP': ['', 18],
      'VSHARE-EVMOS-LP': ['', 18],
    },
    baseLaunchDate: new Date('2022-09-18 13:00:00Z'),
    bondLaunchesAt: new Date('2022-09-18T15:00:00Z'),
    stakingLaunchesAt: new Date('2022-09-18T00:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: 9000,
    networkName: 'EVMOS Testnet',
    evmosscanUrl: 'https://evm.evmos.dev',
    defaultProvider: 'https://eth.bd.evmos.dev:8545',
    deployments: require('./voodoo-finance/deployments/deployments.testing.json'),
    externalTokens: {
      WEVMOS: ['', 18],
      USDT: ['', 6],
      'USDT-EVMOS-LP': ['', 18],
      'VOODOO-EVMOS-LP': ['', 18],
      'VSHARE-EVMOS-LP': ['', 18],
    },
    baseLaunchDate: new Date('2022-09-18 13:00:00Z'),
    bondLaunchesAt: new Date('2022-09-18T15:00:00Z'),
    stakingLaunchesAt: new Date('2022-09-18T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding VOODOO
        - 2 = LP asset staking rewarding VSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  VoodooEvmosRewardPool: {
    name: 'Earn VOODOO by EVMOS',
    poolId: 0,
    sectionInUI: 0,
    contract: 'VoodooEvmosRewardPool',
    depositTokenName: 'WEVMOS',
    earnTokenName: 'VOODOO',
    finished: false,
    sort: 1,
    closedForStaking: true,
  },
  
  VoodooEvmosLPVoodooRewardPool: {
    name: 'Earn VOODOO by VOODOO-EVMOS LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'VoodooEvmosLpVoodooRewardPool',
    depositTokenName: 'VOODOO-EVMOS-LP',
    earnTokenName: 'VOODOO',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  VoodooEvmosLPVoodooRewardPoolOld: {
    name: 'Earn VOODOO by VOODOO-EVMOS LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'VoodooEvmosLpVoodooRewardPoolOld',
    depositTokenName: 'VOODOO-EVMOS-LP',
    earnTokenName: 'VOODOO',
    finished: true,
    sort: 9,
    closedForStaking: true,
  },
  VoodooEvmosLPVShareRewardPool: {
    name: 'Earn VSHARE by VOODOO-EVMOS LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'VoodooEvmosLPVShareRewardPool',
    depositTokenName: 'VOODOO-EVMOS-LP',
    earnTokenName: 'VSHARE',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  VshareEvmosLPVShareRewardPool: {
    name: 'Earn VSHARE by VSHARE-EVMOS LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'VshareEvmosLPVShareRewardPool',
    depositTokenName: 'VSHARE-EVMOS-LP',
    earnTokenName: 'VSHARE',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
};

export default configurations[process.env.NODE_ENV || 'development'];
