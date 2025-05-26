import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CONSTANT_COMMONS} from '@src/constants';
import {FONTS, COLORS} from '@src/styles';
import {toUpper} from 'lodash';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {
  actionUpdate,
  actionSelectedReceiver,
} from '@src/store/receivers/functions';
import {selectedReceiverSelector} from '@src/store/receivers/selectors';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from '@src/store/getStore';
import ToastService from '@src/services/ToastService';
import Header from '@src/components/Header/Header';
import ScrollView from '@src/components/core/ScrollView/Component';
import {TouchableOpacity} from '@src/components/core';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 42,
  },
  networkName: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
    color: COLORS.colorGreyBold,
  },
  networkNameContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const SelectNetworkName = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {rootNetworkName, address, keySave} = useSelector(
    selectedReceiverSelector,
  );
  const factoriesNetwork = CONSTANT_COMMONS.FACTORIES_EVM_NETWORK;
  const handleChooseNetworkName = async (networkName: string) => {
    await dispatch(
      actionUpdate({
        keySave,
        receiver: {
          address,
          rootNetworkName: networkName,
        },
      }),
    );
    await dispatch(actionSelectedReceiver({keySave, address}));
    ToastService.show('Updated');
    navigation.goBack();
  };

  return (
    <View style={styled.container}>
      <Header title="Select network name" />
      <ScrollView>
        <View style={styled.wrapper}>
          {factoriesNetwork.map(networkName => {
            const selected =
              networkName === rootNetworkName ||
              (factoriesNetwork.includes(networkName) &&
                factoriesNetwork.includes(rootNetworkName));
            return (
              <TouchableOpacity
                key={networkName}
                style={styled.networkNameContainer}
                onPress={() => handleChooseNetworkName(networkName)}>
                <Text
                  style={[
                    styled.networkName,
                    selected ? {color: COLORS.black} : null,
                  ]}>
                  {toUpper(networkName)}
                </Text>
                {selected && (
                  <FeatherIcons name="check" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(SelectNetworkName);
