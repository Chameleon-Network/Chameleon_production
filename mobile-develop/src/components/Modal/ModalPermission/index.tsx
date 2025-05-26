import {Text, View} from '@src/components/core';
import Button from '@src/components/core/Button';
import {screenWidth} from '@src/styles';
import {THEME} from '@src/styles/theme';
import React from 'react';
import {Image, StyleSheet, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';

const internetConnectionIssueSrc = require('../../../assets/images/internet_connection.png');

interface ModalPermissionProps {
  title: string;
  subTitle: string;
  btnTitle: string;
  btnDismiss: string;
  isVisible: boolean;
  onPressSetting: () => void;
  onPressDismiss: () => void;
  uri: any;
}

const ModalPermission = ({
  title,
  subTitle,
  btnTitle,
  btnDismiss = 'OK',
  isVisible,
  onPressSetting,
  onPressDismiss,
  uri,
}: ModalPermissionProps) => {
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
        <View style={[THEME.MARGIN.marginBottomDefault]}>
          <Image
            source={uri ? uri : internetConnectionIssueSrc}
            style={{width: screenWidth / 6, height: screenWidth / 6}}
          />
        </View>
        <View style={[styles.contentContainer, {flex: 2}]}>
          <Text style={[THEME.text.headerTextStyle, {textAlign: 'center'}]}>{`${
            title ?? ''
          }`}</Text>
          <Text
            style={[
              {fontSize: THEME.text.largeTitleSize},
              THEME.MARGIN.marginTopDefault,
              {textAlign: 'center'},
            ]}>{`${subTitle ?? ''}`}</Text>
        </View>
        <View style={[styles.contentContainer, {flex: 1}]}>
          <View style={[THEME.FLEX.rowSpaceBetween, THEME.FLEX.fullWidth]}>
            <Button
              onPress={onPressSetting}
              title={btnTitle ?? ''}
              textContainerStyle={{width: screenWidth * 0.8 * 0.5}}
              style={[
                THEME.BUTTON.BLACK_TYPE as ViewStyle,
                {height: 50, width: screenWidth * 0.8 * 0.6},
              ]}
            />
            <Button
              onPress={onPressDismiss}
              title={btnDismiss ?? 'OK'}
              textContainerStyle={{width: screenWidth * 0.8 * 0.2}}
              style={[
                THEME.BUTTON.BLACK_TYPE as ViewStyle,
                {height: 50, width: screenWidth * 0.8 * 0.25},
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ModalPermission;

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
