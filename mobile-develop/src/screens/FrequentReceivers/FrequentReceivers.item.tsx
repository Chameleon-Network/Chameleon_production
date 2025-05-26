import BtnDelete from '@src/components/Button/BtnDelete';
import {Text, TouchableOpacity, View} from '@src/components/core';
import {Text4} from '@src/components/core/Text';
import {ExHandler} from '@src/services/exception';
import {actionDelete} from '@src/store/receivers/functions';
import {isKeychainAddressSelector} from '@src/store/receivers/selectors';
import {FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {useDispatch, useSelector} from 'react-redux';

const itemStyled = StyleSheet.create({
  hook: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 25,
  },
  name: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
    marginBottom: 15,
    maxWidth: '50%',
  },
  address: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
  },
});

interface IItemProps {
  keySave: string;
  name: string;
  address: string;
  containerStyled: any;
  disabledSwipe: boolean;
  rootNetworkName: string;
}

const Item = ({
  keySave,
  name,
  address,
  containerStyled,
  disabledSwipe,
  rootNetworkName,
  ...rest
}: IItemProps) => {
  const receiver = {
    name,
    address,
  };
  const isKeychainAddress = useSelector(isKeychainAddressSelector)(receiver);
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      const payload = {
        keySave,
        receiver,
      };
      dispatch(actionDelete(payload as any));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const Component = () => (
    <TouchableOpacity {...rest}>
      <View style={[itemStyled.hook, containerStyled]}>
        <Text style={itemStyled.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text4
          style={itemStyled.address}
          ellipsizeMode="middle"
          numberOfLines={1}>
          {address}
        </Text4>
      </View>
    </TouchableOpacity>
  );

  if (isKeychainAddress) {
    return <Component />;
  }

  return (
    <Swipeout
      disabled={!!disabledSwipe}
      close
      autoClose
      right={[
        {
          component: <BtnDelete showIcon={false} onPress={onDelete} />,
        },
      ]}
      style={{
        backgroundColor: 'transparent',
      }}>
      <Component />
    </Swipeout>
  );
};

export default Item;
