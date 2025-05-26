import BtnQRCode from '@src/components/Button/BtnQRCode';
import CopiableText from '@src/components/CopiableText';
import {Text, TouchableOpacity, View} from '@src/components/core';
import Button from '@src/components/core/Button';
import {ScrollViewBorder} from '@src/components/core/ScrollView';
import {Text4} from '@src/components/core/Text';
import Header from '@src/components/Header/Header';
import {ArrowRightGreyIcon} from '@src/components/Icons';
import IconCopy from '@src/components/Icons/icon.copy';
import {CONSTANT_KEYS} from '@src/constants';
import {navigateToExportAccountModal} from '@src/router/NavigationServices';
import ClipboardService from '@src/services/ClipboardService';
import {ExHandler} from '@src/services/exception';
import {storage} from '@src/services/storage';
import {loadListAccount} from '@src/services/wallet/WalletService';
import {useSelector} from '@src/store/getStore';
import {
  masterlessWalletSelector,
  noMasterLessSelector,
} from '@src/store/masterKey/selectors';
import {debounce, isEmpty} from 'lodash';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Platform, Share} from 'react-native';
import {useTheme} from 'styled-components/native';
import style from './BackupKeys.styled';
import rnfs from 'react-native-fs';
import SimpleInfo from '@src/components/SimpleInfo';

const srcQrCodeLight = require('../../assets/images/icons/qr_code_light.png');
const srcQrCode = require('../../assets/images/icons/qr_code.png');

const getNameKey = obj => {
  const name = Object.keys(obj)[0];
  const key = Object.values(obj)[0];

  return [name, key];
};

const convertToString = (masterless, noMasterless) => {
  let backupString = '';
  if (noMasterless?.length > 0) {
    backupString += '------MASTER KEYS------\n\n';
    backupString +=
      noMasterless
        ?.map(pair => {
          const [name, key] = getNameKey(pair);
          return `AccountName: ${name}\nPhrase: ${key}`;
        })
        ?.join('\n\n') || '';
  }
  if (masterless?.length > 0) {
    backupString += '\n\n------MASTERLESS------\n\n';
    backupString +=
      masterless
        ?.map(pair => {
          const [name, key] = getNameKey(pair);
          return `AccountName: ${name}\nPrivateKey: ${key}`;
        })
        ?.join('\n\n') || '';
  }
  return backupString;
};

const getBackupData = (accounts, masterKeys) => {
  try {
    const masterless = [];
    const noMasterless = [];
    if (accounts instanceof Array) {
      for (let account of accounts) {
        masterless.push({
          [account?.name || account?.AccountName]: account?.PrivateKey,
        });
      }
    }

    if (masterKeys instanceof Array) {
      for (let masterKey of masterKeys) {
        if (masterKey.name) {
          noMasterless.push({[masterKey.name]: masterKey?.mnemonic});
        }
      }
    }
    return {
      masterless,
      noMasterless,
      backupDataStr: convertToString(masterless, noMasterless),
    };
  } catch (e) {
    new ExHandler(e, 'Please try again').showErrorToast();
  }
};

interface IBackupKeysProps {
  listAccount: any[];
  onNext: () => void;
  onBack: () => void;
}

const BackupKeys = memo((props: IBackupKeysProps) => {
  const {listAccount, onNext, onBack} = props;
  const masterKeys = useSelector(noMasterLessSelector);
  const masterlessWallet = useSelector(masterlessWalletSelector);

  const [state, setState] = useState({
    masterless: [],
    noMasterless: [],
    backupDataStr: '',
  });

  let masterlessAccounts = listAccount;

  const {masterless, noMasterless, backupDataStr} = state;

  const loadMasterlessAccounts = async () => {
    if (isEmpty(masterlessAccounts) && masterlessWallet) {
      masterlessAccounts = (await loadListAccount(masterlessWallet)) || [];
    }
    setState({...state, ...getBackupData(masterlessAccounts, masterKeys)});
  };

  useEffect(() => {
    loadMasterlessAccounts().then();
  }, [masterlessWallet]);

  const markBackedUp = () => {
    storage.setItem(CONSTANT_KEYS.IS_BACKEDUP_ACCOUNT, JSON.stringify(true));
  };

  const handleSaveFile = async () => {
    const time = moment().format('DD_MM_YYYY_HH_mm');

    const dir =
      Platform.OS === 'android'
        ? rnfs.ExternalDirectoryPath
        : rnfs.DocumentDirectoryPath;
    const path = `${dir}/incognito_${time}.txt`;

    await rnfs.writeFile(path, backupDataStr, 'utf8');

    const shared = await Share.share({
      message: backupDataStr,
      url: path,
      title: 'Backup your accounts',
    });
    const isShared = shared?.action === Share.sharedAction;

    if (isShared) {
      markBackedUp();
    }

    return {path, shared, isShared};
  };

  const handleCopyAll = useCallback(() => {
    ClipboardService.set(backupDataStr, {copiedMessage: 'All keys copied'});
    markBackedUp();
  }, [backupDataStr]);

  const theme = useTheme();

  const onNavigateToQrPage = useCallback((label: string, value: string) => {
    navigateToExportAccountModal({
      params: {
        value,
        label,
      },
    });
  }, []);

  const renderAccountItem = useCallback(
    (name, key) => {
      return (
        <CopiableText
          key={name}
          text={`${name}: ${key}`}
          copiedMessage={`"${name}" private key was copied`}
          style={style.accountItemContainer}>
          <>
            <View style={style.accountItemHeader}>
              <Text style={style.title}>{name}</Text>
              <BtnQRCode
                style={style.qrCode}
                onPress={() => onNavigateToQrPage(name, key)}
                source={srcQrCodeLight}
              />
              <IconCopy />
            </View>
            <Text4 style={style.desc}>{key}</Text4>
          </>
        </CopiableText>
      );
    },
    [onNavigateToQrPage, style],
  );

  const handleCopy = useCallback(() => {
    debounce(handleCopyAll, 300);

    if (onNext) {
      onNext();
    }
  }, [handleCopyAll, onNext]);

  if (noMasterless?.length === 0 && masterless?.length === 0) {
    return (
      <SimpleInfo
        text="No account to backup"
        subtext="Your wallet have no account to backup"
      />
    );
  }
  return (
    <>
      <Header title="Back up private keys" onGoBack={onBack} />
      <ScrollViewBorder>
        <View>
          <Text style={style.titleGroup}>Master keys</Text>
          {noMasterless.length > 0 &&
            noMasterless?.map(pair => {
              const [name, key] = getNameKey(pair);
              return renderAccountItem(name, key);
            })}
        </View>
        <View style={style.topGroup}>
          <Text style={style.titleGroup}>Masterless</Text>
          {masterless?.map(pair => {
            const [name, key] = getNameKey(pair);
            return renderAccountItem(name, key);
          })}
        </View>
        <View>
          <Text style={style.title}>Back up all keys</Text>
          <TouchableOpacity onPress={debounce(handleSaveFile, 300)}>
            <View style={style.saveAsBtn}>
              <Text style={style.desc}>Choose back up option</Text>
              <ArrowRightGreyIcon />
            </View>
          </TouchableOpacity>
          <View style={style.bottomGroup}>
            <BtnQRCode
              style={[style.btnQRCode, {backgroundColor: theme.background5}]}
              onPress={() =>
                onNavigateToQrPage('Back up private keys', backupDataStr)
              }
              source={srcQrCode}
            />
            <Button
              buttonStyle={[style.copyAllButton, !!onNext && style.copyNext]}
              title={
                !!onNext
                  ? 'Copy all keys and\n\ncontinue to new update'
                  : 'Copy all keys'
              }
              onPress={handleCopy}
            />
          </View>
        </View>
      </ScrollViewBorder>
    </>
  );
});

export default BackupKeys;
