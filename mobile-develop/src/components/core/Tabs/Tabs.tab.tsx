import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {FONTS} from '@src/styles';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  btnStyle: {
    marginRight: 24,
    paddingBottom: 16,
  },
  btnStyleEnabled: {
    borderBottomColor: '#1A73E8',
    borderBottomWidth: 2,
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  titleStyle: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.regular,
  },
  titleDisabledStyle: {},
});

const CustomText = styled(Text)`
  color: ${({disabled, theme}) => (disabled ? theme.text11 : theme.text1)};
  line-height: 24px;
`;

interface ITabProps {
  activeTab: string;
  label: string;
  onClickTab: (tabID: string) => void;
  tabID: string;
  tabStyled: any;
  tabStyledDisabled: any;
  titleStyled: any;
  titleDisabledStyled: any;
  tabStyledEnabled: any;
}

const Tab = (props: ITabProps) => {
  const {
    activeTab,
    label,
    onClickTab,
    tabID,
    tabStyled,
    tabStyledEnabled,
    tabStyledDisabled,
    titleStyled,
    titleDisabledStyled,
  } = props;
  const onClick = () => typeof onClickTab === 'function' && onClickTab(tabID);
  const disabled = tabID !== activeTab;
  return (
    <TouchableOpacity
      onPress={onClick}
      style={
        tabStyled
          ? [tabStyled, disabled ? tabStyledDisabled : null]
          : [
              styles.btnStyle,
              disabled
                ? styles.btnStyleDisabled
                : {...styles.btnStyleEnabled, ...tabStyledEnabled},
            ]
      }>
      <CustomText
        disabled={disabled}
        style={
          titleStyled
            ? [titleStyled, disabled && titleDisabledStyled]
            : [styles.titleStyle, disabled ? styles.titleDisabledStyle : null]
        }>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

export default React.memo(Tab);
