import {Text, View} from '@src/components/core';
import Button from '@src/components/core/Button';
import {screenWidth, THEME} from '@src/styles';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

const internetConnectionIssueSrc = require('../../../assets/images/internet_connection.png');

// Yes, it should be the same and reusable with another modal
// But for now, I want to separately the modal type.
// Will be change in the future if needed, for now, no need.
// Ui change immediately

interface ModalConnectionProps {
  isVisible: boolean;
  onPressSetting: () => void;
}

const ModalConnection = ({isVisible, onPressSetting}: ModalConnectionProps) => {
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
          {backgroundColor: 'white', padding: 20},
          THEME.SHADOW.normal,
        ]}>
        <View style={styles.contentContainer}>
          <Text style={[THEME.text.headerTextStyle, {textAlign: 'center'}]}>
            Connectivity problem
          </Text>
          <Text
            style={[
              {fontSize: THEME.text.largeTitleSize},
              THEME.MARGIN.marginTopDefault,
            ]}>
            There is a problem with your connection. Make sure you checked and
            enabled Wifi or 3G/4G/5G.{' '}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={[THEME.MARGIN.marginBottomDefault]}>
            <Image
              source={internetConnectionIssueSrc}
              style={{width: screenWidth / 5, height: screenWidth / 5}}
            />
          </View>
          <View style={[THEME.FLEX.rowSpaceBetween, THEME.FLEX.fullWidth]}>
            <Button
              onPress={onPressSetting}
              title="Go to Setting"
              textContainerStyle={{width: '100%'}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ModalConnection;

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
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
