import BtnClose from '@src/components/Button/BtnClose';
import {actionToggleModal} from '@src/store/modal/functions';
import {COLORS, FONTS, THEME} from '@src/styles';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styled = StyleSheet.create({
  container: {
    backgroundColor: THEME.header.backgroundColor,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 6,
    color: COLORS.white,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnClose: {
    marginLeft: 'auto',
  },
});

interface IHeaderProps {
  headerTitle: string;
}

const Header = ({headerTitle}: IHeaderProps) => {
  const handleToggleModal = async () => await actionToggleModal();

  return (
    <View style={styled.container}>
      <View style={styled.titleContainer}>
        <Text style={styled.title}>{headerTitle}</Text>
      </View>
      <View style={styled.btnClose}>
        <BtnClose colorIcon={COLORS.white} onPress={handleToggleModal} />
      </View>
    </View>
  );
};

export default Header;
