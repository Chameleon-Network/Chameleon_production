import { CONSTANT_CONFIGS } from '@src/constants';
import { ROUTE_NAMES } from '@src/router';

export const TAB_SIMPLE_ID = '[swap] simple';
export const TAB_PRO_ID = '[swap] pro';
export const ROOT_TAB_ID = 'ROOT_TAB_SWAP';

export const ROOT_TAB_SUB_INFO = 'ROOT_TAB_SUB_INFO';
export const TAB_HISTORY_ID = '[swap_sub_info] history order';

export const ROOT_TAB_SWAP_HISTORY = 'ROOT_TAB_SWAP_HISTORY';
export const TAB_SWAP_HISTORY_ID = 'swap_sub_info] swap history';
export const TAB_REWARD_HISTORY_ID = '[swap_sub_info] reward history';

export const SCREENS_TO_SHOW_REWARD_HISTORY_TAB = [
  ROUTE_NAMES.PrivacyAppsPancake,
  ROUTE_NAMES.PrivacyAppsUni,
  ROUTE_NAMES.PrivacyAppsCurve,
  ROUTE_NAMES.PrivacyAppsSpooky,
];

export const formConfigs = {
  formName: 'FORM_SWAP',
  selltoken: 'selltoken',
  buytoken: 'buytoken',
  slippagetolerance: 'slippagetolerance',
  feetoken: 'feetoken',
};

export const KEYS_PLATFORMS_SUPPORTED = {
  incognito: 'incognito',
  pancake: 'pancake',
  uniswap: 'uniswap',
  uni: 'uni',
  curve: 'curve',
  spooky: 'spooky',
  uniEther: 'uniEther',
  joe: 'joe',
  trisolaris: 'trisolaris',
  interswap: 'interswap',
};

export const KEYS_PLATFORMS_SUPPORTED_NETWORKS = {
  incognito: ['bsc', 'plg', 'eth', 'inc'],
  pancake: ['bsc'],
  uni: ['plg'],
  curve: ['plg'],
};

export const NETWORK_NAME_SUPPORTED = {
  INCOGNITO: 'inc',
  ETHEREUM: 'eth',
  POLYGON: 'plg',
  FANTOM: 'ftm',
  BINANCE_SMART_CHAIN: 'bsc',
  AURORA: 'aurora',
  AVALANCHE: 'avax',
  NEAR: 'near',
  INTER_SWAP: 'interswap',
};

export const PLATFORMS_SUPPORTED = [
  {
    id: KEYS_PLATFORMS_SUPPORTED.incognito,
    title: 'Incognito',
    desc: '',
    visible: true,
    isSelected: true,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.pancake,
    title: 'PancakeSwap',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.uni,
    title: 'Uniswap (Polygon)',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.uniEther,
    title: 'Uniswap (Ethereum)',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.curve,
    title: 'Curve',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.spooky,
    title: 'Spooky',
    desc: '',
    visible: true,
    isSelected: false,
  },

  {
    id: KEYS_PLATFORMS_SUPPORTED.joe,
    title: 'Joe',
    desc: '',
    visible: true,
    isSelected: false,
  },

  {
    id: KEYS_PLATFORMS_SUPPORTED.trisolaris,
    title: 'Trisolaris',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.interswap,
    title: 'Inter-liquidity pools',
    desc: '',
    visible: true,
    isSelected: true,
  },
];

const isMainnet = global.isMainnet;

export const CALL_CONTRACT = {
  UNI_ETH: isMainnet
    ? '0xe38e54B2d6B1FCdfaAe8B674bF36ca62429fdBDe'
    : '0xf31D49B636C24a854Eabe9BB05e85baA7411A380',

  PANCAKE_BSC: isMainnet
    ? '0x95Cd8898917c7216Da0517aAB6A115d7A7b6CA90'
    : '0x0e2923c21E2C5A2BDD18aa460B3FdDDDaDb0aE18',

  CURVE_PLG: isMainnet ? '0x55b08b7c1ecdc1931660b18fe2d46ce7b20613e2' : '',

  UNI_PLG: isMainnet
    ? '0xCC8c88e9Dae72fa07aC077933a2E73d146FECdf0'
    : '0xAe85BB3D2ED209736E4d236DcE24624EA1A04249',

  SPOOKY_FTM: isMainnet
    ? '0x6e6Cc30856eB766557418d58af6ED8eaB767940d'
    : '0x14D0cf3bC307aA15DA40Aa4c8cc2A2a81eF96B3a',

  JOE_AVAX: isMainnet
    ? '0xb247b4ae0a267f30e5de9548ca7bf7ad64f70ed0'
    : '0xd17E836453f7DaF2F2d6F8dFdd56449bc97446F4',

  TRISOLARIS_AURORA: isMainnet
    ? '0x6e6Cc30856eB766557418d58af6ED8eaB767940d'
    : '0xA17b90be4A5F79076c770384332515359D2F6A88',
};

export const getExchangeDataWithCallContract = ({
  callContract,
  pAppNetwork,
}) => {
  let name = 'Incognito';
  let exchangeScan = CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL;
  if (pAppNetwork) {
    name = 'Inter-liquidity pools';
    switch (pAppNetwork) {
      case NETWORK_NAME_SUPPORTED.ETHEREUM:
        exchangeScan = CONSTANT_CONFIGS.ETHERSCAN_URL;
        break;
      case NETWORK_NAME_SUPPORTED.BINANCE_SMART_CHAIN:
        exchangeScan = CONSTANT_CONFIGS.BSCSCAN_URL;
        break;
      case NETWORK_NAME_SUPPORTED.POLYGON:
        exchangeScan = CONSTANT_CONFIGS.POLYGONSCAN_URL;
        break;
      case NETWORK_NAME_SUPPORTED.FANTOM:
        exchangeScan = CONSTANT_CONFIGS.FANTOMSCAN_URL;
        break;
      case NETWORK_NAME_SUPPORTED.AVALANCHE:
        exchangeScan = CONSTANT_CONFIGS.AVAXSCAN_URL;
        break;
      case NETWORK_NAME_SUPPORTED.AURORA:
        exchangeScan = CONSTANT_CONFIGS.AURORASCAN_URL;
        break;
    }
  } else {
    if (CALL_CONTRACT.UNI_ETH.includes(callContract)) {
      name = 'Uniswap (ETH)';
      exchangeScan = CONSTANT_CONFIGS.ETHERSCAN_URL;
    } else if (CALL_CONTRACT.PANCAKE_BSC.includes(callContract)) {
      name = 'Pancake';
      exchangeScan = CONSTANT_CONFIGS.BSCSCAN_URL;
    } else if (CALL_CONTRACT.UNI_PLG.includes(callContract)) {
      name = 'Uniswap (PLG)';
      exchangeScan = CONSTANT_CONFIGS.POLYGONSCAN_URL;
    } else if (CALL_CONTRACT.SPOOKY_FTM.includes(callContract)) {
      name = 'Spooky';
      exchangeScan = CONSTANT_CONFIGS.FANTOMSCAN_URL;
    } else if (CALL_CONTRACT.CURVE_PLG.includes(callContract)) {
      name = 'Curve';
      exchangeScan = CONSTANT_CONFIGS.POLYGONSCAN_URL;
    } else if (CALL_CONTRACT.JOE_AVAX.includes(callContract)) {
      name = 'Joe';
      exchangeScan = CONSTANT_CONFIGS.AVAXSCAN_URL;
    } else if (CALL_CONTRACT.TRISOLARIS_AURORA.includes(callContract)) {
      name = 'Trisolaris';
      exchangeScan = CONSTANT_CONFIGS.AURORASCAN_URL;
    }
  }

  return { name, exchangeScan };
};

export const RULE_SORT = {
  key: ['isPRV', 'isPUnifiedToken', 'network', 'symbol'],
  value: ['desc', 'desc', 'asc', 'asc'],
};

export const RULE_SEARCH = ['displayName', 'name', 'symbol', 'pSymbol'];
// milliseconds * seconds * minutes * hours = 1 day
export const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day
// export const ONE_DAY = 1 * 60 * 1000; //1 minute

export const ESTIMATE_COUNT_MAX = 2;

export const SWAP_DEFAULT_FAIR = {
  INCOGNITO: {
    selltoken:
      '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229', // USDT_UNIFIED
    buytoken:
      '0000000000000000000000000000000000000000000000000000000000000004', // PRV
    // selltoken: '26df4d1bca9fd1a8871a24b9b84fc97f3dd62ca8809975c6d971d1b79d1d9f31', // MATIC_UNIFIED
    // buytoken: 'c01e7dc1d1aba995c19b257412340b057f8ad1482ccb6a9bb0adce61afbf05d4', // XMR
  },
  PANCAKE: {
    selltoken:
      '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
    buytoken:
      'e5032c083f0da67ca141331b6005e4a3740c50218f151a5e829e9d03227e33e2', //BNB (BSC)
  },
  UNISWAP: {
    selltoken:
      '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
    buytoken:
      '3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e', //ETH (UT)
  },
  CURVE: {
    selltoken:
      '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
    buytoken:
      '076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229', //ETH (UT)
  },
  SPOOKY: {
    selltoken:
      '545ef6e26d4d428b16117523935b6be85ec0a63e8c2afeb0162315eb0ce3d151', //USDC (UT)
    buytoken:
      '6eed691cb14d11066f939630ff647f5f1c843a8f964d9a4d295fa9cd1111c474', //FTM
  },
  JOE: {
    selltoken:
      '9624c2357d9be1cb0136e2743d891382e754cc82b53bc249a22fb890e62cf3a6', //USDC (Avalanche)
    buytoken:
      'c469fb02623a023b469c81e1564193da7d85fe918cd4a4fdd2c64f97f59f60f5', //AVAX
  },
  TRISOLARIS: {
    selltoken:
      '9641025869e7e98e72fa746cba0c3b3dc205c743528f7c978c5b6dd8433472d9', //AURORA
    buytoken:
      '96de12b4e6ede8795e1938b47fc12da2c5983722e731d2ada185641dd494cd78', //USDC (Aurora)
  },
};
