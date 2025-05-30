import {CONSTANT_CONFIGS} from '@src/constants';
import {split, get} from 'lodash';

export const HOME_CONFIGS = {
  categories: [
    {
      id: 1,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      sortId: 1,
      title: 'Go incognito',
      desc: '',
      buttons: [
        {
          id: 1,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 1,
          sortId: 12,
          key: 'trade',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Trade.png',
          title: 'Trade',
          desc: 'Buy crypto anonymously',
          route: 'Trade',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 2,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 1,
          sortId: 2,
          key: 'wallet',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Assets.png',
          title: 'Assets',
          desc: 'Shield, send & receive',
          route: 'Wallet',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 6,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 1,
          sortId: 6,
          key: 'isssue_a_coin',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Mint.png',
          title: 'Mint',
          desc: 'Issue a privacy coin',
          route: 'CreateToken',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
      ],
    },
    {
      id: 2,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      sortId: 2,
      title: 'Power privacy',
      desc: '',
      buttons: [
        {
          id: 4,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 2,
          sortId: 5,
          key: 'stake_prv',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Stake.png',
          title: 'Provide',
          desc: 'Grow liquidity',
          route: 'Stake',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 12,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 2,
          sortId: 7,
          key: 'node',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Power.png',
          title: 'Power',
          desc: 'Run a Node',
          route: 'Node',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 13,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 2,
          sortId: 6,
          key: 'invest',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Invest.png',
          title: 'Add',
          desc: 'List a pair',
          route: 'Dex',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 18,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 2,
          sortId: 7,
          key: 'community',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Connect.png',
          title: 'Community',
          desc: 'Create conversations',
          route: 'Community',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
      ],
    },
    {
      id: 3,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      sortId: 3,
      title: 'More',
      desc: '',
      buttons: [
        {
          id: 10,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 3,
          sortId: 10,
          key: 'explorer',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Explorer.png',
          title: 'Explorer',
          desc: 'Discover the network',
          route: 'https://explorer.incognito.org/',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 14,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 3,
          sortId: 10,
          key: 'pApp',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Browser.png',
          title: 'Browser',
          desc: 'Search privacy-first apps',
          route: 'pApp',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 15,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 3,
          sortId: 9,
          key: 'keychain',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Keychain.png',
          title: 'Keychain',
          desc: 'Manage keys',
          route: 'Keychain',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
        {
          id: 16,
          createdAt: '2020-04-27T04:17:27Z',
          updatedAt: '2020-04-27T04:17:27Z',
          deletedAt: null,
          appGroupId: 3,
          sortId: 8,
          key: 'setting',
          icoUrl:
            'https://incognito-org.s3.amazonaws.com/wallet/icons6/Settings.png',
          title: 'Settings',
          desc: 'Customize preferences',
          route: 'Setting',
          message: '',
          toolTip: {
            id: 0,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            appConfigId: 0,
            title: '',
            message: '',
          },
        },
      ],
    },
  ],
  headerTitle: {
    id: 1,
    createdAt: '2020-04-27T10:19:18Z',
    updatedAt: '2020-04-27T10:19:18Z',
    deletedAt: null,
    title: 'Incognito mode\\nfor your crypto',
    desc: '',
  },
};

export const checkOutdatedVersion = (
  appVersion: string,
  packageVersion = CONSTANT_CONFIGS.BUILD_VERSION,
) => {
  const currentAppVersion = split(packageVersion, '.').map(item =>
    Number(item),
  );
  const newAppVersions = split(appVersion, '.').map(item => Number(item));
  for (
    let index = 0;
    index < Math.max(currentAppVersion.length, newAppVersions.length);
    index++
  ) {
    const iCurr = get(currentAppVersion, index, 0);
    const iNew = get(newAppVersions, index, 0);

    if (iCurr > iNew) {
      return false;
    }

    if (iCurr < iNew) {
      return true;
    }
  }
  return false;
};
