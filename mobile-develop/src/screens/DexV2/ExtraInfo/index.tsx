import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import stylesheet from './style';
import BtnChevron from '@src/components/Button/BtnChevron';
import { ViewStyle } from 'react-native';



interface ExtraInfoProps {
  left: string | React.ReactNode;
  right: string | React.ReactNode | number;
  style?: ViewStyle;
  wrapperStyle?: ViewStyle;
  rightStyle?: ViewStyle;
  message?: string;
  ellipsizeMode?: 'head' | 'middle' | 'tail';
  numberOfLines?: number;
}

const ExtraInfo = (props: ExtraInfoProps) => {
  const { left, right, style, rightStyle, wrapperStyle, message, ellipsizeMode = 'tail', numberOfLines = 1 } = props;

  const LeftWrapper = typeof left === 'object' ? View : Text;
  const RightWrapper = typeof right === 'object' ? View : Text;

  const shouldShowMsg = !!message;

  const [state, setState] = React.useState({
    toggleMessage: false,
  });
  const { toggleMessage } = state;

  const handleToggleMsg = () => {
    setState({ ...state, toggleMessage: !toggleMessage });
  };

  return (
    <View>
      <View style={[stylesheet.wrapper, wrapperStyle]}>
        <LeftWrapper style={[stylesheet.text, stylesheet.textLeft, style]}>{left}</LeftWrapper>
        <RightWrapper
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          style={[stylesheet.text, stylesheet.textRight, style, rightStyle, { flex: 1 }]}
        >
          {right}
        </RightWrapper>
        {shouldShowMsg && (
          <BtnChevron
            style={stylesheet.btnChevron}
            size={18}
            toggle={toggleMessage}
            onPress={handleToggleMsg}
          />
        )}
      </View>
      {toggleMessage && <Text style={[stylesheet.message]}>{message}</Text>}
    </View>
  );
};



export default ExtraInfo;
