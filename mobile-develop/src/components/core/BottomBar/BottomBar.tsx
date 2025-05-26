import TextMarquee from '@src/components/AutoScrollText';
import { TouchableOpacity } from '@src/components/core';
import { COLORS, FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const styled = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 3,
    fontFamily: FONTS.NAME.medium,
    marginRight: 8,
  },
});

interface BottomBarProps {
  onPress: () => void;
  text: string;
  autoscroll?: boolean;
}

const BottomBar = (props: BottomBarProps) => {
  const { onPress, text, autoscroll = false } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styled.container}>
        { autoscroll ? (
          <TextMarquee
            duration={7000}
            loop
            repeatSpacer={50}
            marqueeDelay={500}
            marqueeOnMount
            animationType="scroll"
          >
            <Text style={styled.text}>{text}</Text>
          </TextMarquee>
        ) : <Text style={styled.text}>{text}</Text>
        }
        <Icon name="chevron-right" color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};


export default React.memo(BottomBar);
