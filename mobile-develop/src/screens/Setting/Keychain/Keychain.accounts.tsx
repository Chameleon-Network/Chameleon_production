import {ArrowRightGreyIcon, RatioIcon} from '@components/Icons';
import {DeleteFillIcon} from '@components/Icons/icon.delete';
import {Text} from '@src/components/core';
import {Text3} from '@src/components/core/Text';
import {Row} from '@src/components/Row';
import {navigateToExportAccount} from '@src/router/NavigationServices';
import {ExHandler} from '@src/services/exception';
import ToastService from '@src/services/ToastService';
import {actionSwitchAccount, removeAccount} from '@src/store/account/functions';
import {
  defaultAccountSelector,
  listAccountSelector,
} from '@src/store/account/selectors';
import {settingSelector} from '@src/store/setting/selectors';
import {onClickView} from '@src/utils/ViewUtil';
import React, {memo} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';
import {itemStyled} from './keychain.styled';
import {isNodeAccount} from './Keychain.ultil';

const Item = React.memo(
  ({account, handleDelete, handleSwitchAccount, handleExportKey, isLast}) => {
    const defaultAccount = useSelector(defaultAccountSelector);
    const isActive = React.useMemo(
      () => account?.paymentAddress === defaultAccount?.paymentAddress,
      [account?.paymentAddress, defaultAccount?.paymentAddress],
    );
    const theme = useTheme();

    return <></>
    //TODO: fix swipeout
    // return (
    //   <Swipeout
    //     style={[
    //       itemStyled.wrap,
    //       itemStyled.shadow,
    //       isLast && {marginBottom: 50},
    //       {borderColor: theme.border1},
    //     ]}
    //     right={[
    //       ...(handleDelete
    //         ? [
    //             {
    //               component: (
    //                 <View style={itemStyled.wrapBin}>
    //                   <DeleteFillIcon />
    //                 </View>
    //               ),
    //               backgroundColor: 'transparent',
    //               onPress: () => handleDelete(account),
    //             },
    //           ]
    //         : []),
    //     ]}>
    //     <TouchableOpacity
    //       style={itemStyled.wrapContent}
    //       onPress={() => handleExportKey(account)}>
    //       <Row centerVertical spaceBetween>
    //         <Row centerVertical>
    //           <TouchableOpacity
    //             style={{paddingRight: 16}}
    //             onPress={() => handleSwitchAccount(account)}>
    //             <RatioIcon selected={isActive} />
    //           </TouchableOpacity>
    //           <Text style={itemStyled.mediumBlack}>{account.name}</Text>
    //         </Row>
    //         <ArrowRightGreyIcon style={itemStyled.arrow} />
    //       </Row>
    //       <Text3
    //         style={itemStyled.mediumGrey}
    //         ellipsizeMode="middle"
    //         numberOfLines={1}>
    //         {account.paymentAddress}
    //       </Text3>
    //     </TouchableOpacity>
    //   </Swipeout>
    // );
  },
);

const Accounts = () => {
  const [removing, setRemove] = React.useState(false);
  const defaultAccount = useSelector(defaultAccountSelector);
  const handleSwitchAccount = onClickView(async account => {
    try {
      if (defaultAccount?.name === account?.name) {
        ToastService.show(`Your current keychain is "${account?.name}"`);
        return;
      }
      await actionSwitchAccount(account?.accountName || account?.name);
    } catch (e) {
      new ExHandler(
        e,
        `Can not switch to keychain "${account?.name}", please try again.`,
      ).showErrorToast();
    }
  });
  const handleExportKey = account => {
    navigateToExportAccount({account});
  };
  const handleDelete = async account => {
    Alert.alert(
      `Delete keychain "${account?.name}"?`,
      'Add it again using its private key or associated master key.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK, delete it',
          onPress: async () => {
            try {
              await setRemove(true);
              await removeAccount(account);
              ToastService.show('Keychain removed.');
            } catch (e) {
              new ExHandler(
                e,
                `Can not delete keychain ${account?.name}, please try again.`,
              ).showErrorToast();
            } finally {
              await setRemove(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const listAccount = useSelector(listAccountSelector);
  const {devices} = useSelector(settingSelector);

  const renderItem = (account, index) => {
    const isDeletable =
      listAccount.length > 1 && !isNodeAccount(account?.accountName, devices);
    return (
      <Item
        account={account}
        key={account.ValidatorKey}
        handleDelete={isDeletable && handleDelete}
        handleSwitchAccount={handleSwitchAccount}
        handleExportKey={handleExportKey}
        isLast={index === listAccount.length - 1}
      />
    );
  };
  return <>{listAccount.map(renderItem)}</>;
};

export default memo(Accounts);
