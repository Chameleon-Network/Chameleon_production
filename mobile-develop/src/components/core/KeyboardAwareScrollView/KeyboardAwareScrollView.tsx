import React from 'react';
import {
  KeyboardAwareScrollView as KeyboardAwareScrollViewComponent,
  KeyboardAwareScrollViewProps as _KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import globalStyled from '@src/theme/theme.styled';
import { getBottomAreaHeight } from '@src/utils/safeAreaHelper';
import { StyleProp, ViewStyle } from 'react-native';

const BOTTOM_BAR_PADDING_BOTTOM = getBottomAreaHeight() + 10;

const CustomKeyboardAwareScrollView = styled(KeyboardAwareScrollViewComponent)`
  background-color: ${({ theme }) => theme.background1};
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
`;

interface KeyboardAwareScrollViewProps extends _KeyboardAwareScrollViewProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  fullFlex?: boolean;
  paddingBottom?: boolean;
  defaultPadding?: boolean;
}

const KeyboardAwareScrollView = (props: KeyboardAwareScrollViewProps) => {
  const { contentContainerStyle, fullFlex, paddingBottom, defaultPadding = true, ...rest } = props;
  return (
    <CustomKeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      enableOnAndroid
      enableResetScrollToCoords={false}
      contentContainerStyle={[
        contentContainerStyle,
        fullFlex && { flex: 1 },
        defaultPadding && globalStyled.defaultPadding,
        paddingBottom && { paddingBottom: 50 + BOTTOM_BAR_PADDING_BOTTOM},
      ]}
      {...rest}
    />
  );
};

export default KeyboardAwareScrollView;
