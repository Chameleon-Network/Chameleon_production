/* eslint-disable react-native/no-unused-styles */
import {Text, View} from '@src/components/core';
import Button from '@src/components/core/Button';
import {COLORS, screenWidth, THEME} from '@src/styles';
import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';

// Yes, it should be the same and reusable with another modal
// But for now, I want to separately the modal type.
// Will be change in the future if needed, for now, no need.
// Ui change immediately

interface ModalActionsProps {
  title: string;
  subTitle: string;
  btnTitle: string;
  isVisible: boolean;
  btnSetting: string;
  onPress: () => void;
  onPressFirst: () => void;
}
const ModalActions = ({
  title,
  subTitle,
  btnTitle,
  isVisible,
  btnSetting,
  onPress,
  onPressFirst,
}: ModalActionsProps) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={800}
      animationOutTiming={1000}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: 'white',
            padding: 20,
            paddingBottom: 30,
            paddingTop: 30,
          },
          THEME.SHADOW.normal,
        ]}>
        <View style={[styles.contentContainer, {flex: 7}]}>
          <Text
            style={[
              THEME.text.headerTextStyle,
              {textAlign: 'center'},
              THEME.MARGIN.marginTopDefault,
            ]}>{`${title ?? ''}`}</Text>
          <Text
            style={[
              {fontSize: THEME.text.largeTitleSize},
              THEME.MARGIN.marginTopDefault,
              {textAlign: 'center'},
              {color: COLORS.colorGreyBold},
            ]}>{`${subTitle ?? ''}`}</Text>
        </View>
        <View style={[styles.contentContainer, {flex: 3}]}>
          <View style={[THEME.FLEX.rowSpaceBetween, THEME.FLEX.fullWidth]}>
            <Button
              style={[
                THEME.BUTTON.BLACK_TYPE as ViewStyle,
                {width: screenWidth * 0.8 * 0.42},
              ]}
              onPress={onPressFirst}
              title={btnTitle ?? ''}
              textContainerStyle={{width: screenWidth * 0.8 * 0.35}}
            />
            <Button
              style={[
                THEME.BUTTON.BLACK_TYPE as ViewStyle,
                {width: screenWidth * 0.8 * 0.42},
              ]}
              onPress={onPress}
              title={btnSetting ?? ''}
              textContainerStyle={{width: screenWidth * 0.8 * 0.35}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalActions;

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.BORDER_RADIUS.picker,
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    backgroundColor: 'transparent',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});
