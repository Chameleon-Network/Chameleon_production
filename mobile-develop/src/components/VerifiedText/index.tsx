import {Text, View} from '@src/components/core';
import {WALLET} from '@src/constants/elements';
import {generateTestId} from '@utils/misc';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Row} from '../Row';
import styleSheet from './style';

const VerifiedText = ({
  text = '',
  isVerified,
  containerStyle,
  style,
  ...textProps
}: {
  text?: string;
  isVerified: boolean;
  containerStyle?: any;
  style?: any;
  textProps?: any;
}) => {
  return (
    <Row style={[styleSheet.container, containerStyle]} centerVertical>
      <Text
        {...textProps}
        style={[styleSheet.text, style]}
        {...generateTestId(WALLET.TOKEN_CODE)}>
        {text}
      </Text>
      {isVerified && (
        <View style={styleSheet.verifiedFlagContainer}>
          <Icons
            style={styleSheet.verifiedFlag}
            name="check-circle"
            size={14}
          />
        </View>
      )}
    </Row>
  );
};

export default VerifiedText;
