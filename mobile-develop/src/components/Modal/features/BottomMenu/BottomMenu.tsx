import {COLORS, FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
    zIndex: 1,
  },
  menu: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    paddingTop: 15,
    paddingBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  icon: {
    flex: 1,
    padding: 2,
  },
  hook: {
    flex: 5,
  },
  title: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 3,
    color: COLORS.black,
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 3,
    color: COLORS.colorGreyBold,
    marginTop: 5,
  },
  lastChild: {
    borderBottomWidth: 0,
  },
});

interface MenuItemProps {
  id?: string;
  data: {
    id?: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    onPressItem: () => void;
  };
  lastChild: boolean;
}

const MenuItem = ({data, lastChild}: MenuItemProps) => {
  const {title, desc, icon, onPressItem} = data;
  return (
    <TouchableOpacity onPress={onPressItem}>
      <View style={[styled.item, lastChild ? styled.lastChild : null]}>
        {icon && <View style={styled.icon}>{icon}</View>}
        <View style={styled.hook}>
          <Text style={styled.title}>{title}</Text>
          <Text style={styled.desc}>{desc}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface MenuProps {
  data: {
    id?: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    onPressItem: () => void;
  }[];
}

const Menu = ({data}: MenuProps) => {
  return (
    <View style={styled.container}>
      <View style={styled.menu}>
        {data.map((item, index) => (
          <MenuItem
            data={item}
            lastChild={data.length - 1 === index}
            key={item?.id || index}
          />
        ))}
      </View>
    </View>
  );
};

export default Menu;
