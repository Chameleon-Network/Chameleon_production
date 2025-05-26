import {TouchableOpacity} from '@src/components/core';
import {Text9} from '@src/components/core/Text';
import {View3} from '@src/components/core/View';
import ClipboardService from '@src/services/ClipboardService';
import {FONTS} from '@src/styles';
import React, {memo} from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import IconCopy2 from '../Icons/icon.copy2';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  text: {
    flex: 1,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    marginHorizontal: 15,
  },
  buttonCopy: {
    marginRight: 16,
  },
});

interface CopiableTextProps {
  data: string;
  textStyle?: StyleProp<TextStyle>;
}

const CopiableText = memo((props: CopiableTextProps) => {
  const {data, textStyle} = props;
  const handleCopyText = () => {
    ClipboardService.set(data);
  };
  return (
    <View3 style={styled.container}>
      <Text9
        style={[styled.text, textStyle]}
        numberOfLines={1}
        ellipsizeMode="middle">
        {data}
      </Text9>
      <TouchableOpacity onPress={handleCopyText} style={styled.buttonCopy}>
        <IconCopy2 />
      </TouchableOpacity>
    </View3>
  );
});
export default CopiableText;
