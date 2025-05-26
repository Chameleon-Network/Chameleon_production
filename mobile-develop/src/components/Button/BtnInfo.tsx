import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {InfoIcon} from '@src/components/Icons';
import InfoVer2Icon from '@components/Icons/icon.i';
import {setSelectedPrivacy} from '@src/store/selectedPrivacy';
import {navigateToCoinInfo} from '@src/router/NavigationServices';

const styled = StyleSheet.create({
  btnInfo: {
    padding: 5,
  },
});

interface IBtnInfoProps {
  tokenId?: string;
  version?: number;
  style?: any;
  isBlack?: boolean;
  onPress?: () => void;
}

const BtnInfo = (props: IBtnInfoProps) => {
  const {tokenId, version = 1} = props;
  const onNavTokenInfo = async () => {
    if (tokenId) {
      await setSelectedPrivacy(tokenId);
    }
    navigateToCoinInfo();
  };
  return (
    <TouchableOpacity
      {...{
        ...props,
        onPress:
          typeof props?.onPress === 'function'
            ? props?.onPress
            : onNavTokenInfo,
        style: [styled.btnInfo, props?.style],
      }}>
      {version === 1 ? <InfoIcon isBlack={props?.isBlack} /> : <InfoVer2Icon />}
    </TouchableOpacity>
  );
};

export default React.memo(BtnInfo);
