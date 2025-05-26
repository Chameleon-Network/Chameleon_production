import React from 'react';
import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '@src/styles';
import ButtonBasic from '@src/components/Button/ButtonBasic';

const styled = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    padding: 0,
    marginRight: 0,
    overflow: 'hidden',
    backgroundColor: '#303030',
    height: 40,
  },
  btnStyleEnabled: {
    borderBottomColor: COLORS.colorBlue,
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  titleStyle: {
    padding: 0,
    margin: 0,
    fontSize: FONTS.SIZE.regular,
    fontFamily: FONTS.NAME.medium,
    lineHeight: FONTS.SIZE.regular + 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  titleDisabledStyle: {
    color: '#9C9C9C',
  },
});

interface ITab1Props {
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

const Tab1 = (props: ITab1Props) => {
  const {
    activeTab,
    label,
    onClickTab,
    tabID,
    tabStyled,
    tabStyledDisabled,
    titleStyled,
    titleDisabledStyled,
    tabStyledEnabled,
  } = props;
  const onClick = () => typeof onClickTab === 'function' && onClickTab(tabID);
  const disabled = tabID !== activeTab;
  return (
    <ButtonBasic
      title={label}
      onPress={onClick}
      btnStyle={
        tabStyled
          ? [tabStyled, disabled ? tabStyledDisabled : tabStyledEnabled]
          : [
              styled.btnStyle,
              disabled ? styled.btnStyleDisabled : styled.btnStyleEnabled,
            ]
      }
      titleStyle={
        titleStyled
          ? [titleStyled, disabled ? titleDisabledStyled : null]
          : [styled.titleStyle, disabled ? styled.titleDisabledStyle : null]
      }
    />
  );
};

export default React.memo(Tab1);
