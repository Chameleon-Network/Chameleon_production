import React from 'react';
import {
  StyleSheet,
  SectionList,
  TouchableWithoutFeedback,
  SectionListProps,
} from 'react-native';
import {Text, View} from '@src/components/core';
import Icon from 'react-native-vector-icons/Entypo';
import {COLORS, FONTS} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
  },
});

interface IDropdownMenuProps extends SectionListProps<any, any> {
  defaultToggle: boolean;
  sections: any[];
  customStyle: any;
}

const DropdownMenu = (props: IDropdownMenuProps) => {
  const {defaultToggle, sections, customStyle, ...rest} = props;
  const [toggle, setToggle] = React.useState(defaultToggle);
  const sectionsData = sections.map(section => ({
    ...section,
    data: toggle ? section?.data : [],
  }));
  return (
    <SectionList
      style={[styled.container, customStyle]}
      sections={sectionsData}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={({section: {label}}) => (
        <TouchableWithoutFeedback
          onPress={() => {
            setToggle(!toggle);
          }}>
          <View
            style={[styled.labelContainer, toggle ? {marginBottom: 15} : null]}>
            <Text style={styled.label}>{label}</Text>
            <Icon
              name={`chevron-thin-${toggle ? 'up' : 'down'}`}
              size={20}
              color={COLORS.colorGreyBold}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...rest}
    />
  );
};

export default DropdownMenu;
