/**
 * @providesModule DialogLoader
 */
import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator, Text} from 'react-native';

interface DialogLoaderProps {
  loading?: boolean;
  content?: string;
}

const DialogLoader: React.FC<DialogLoaderProps> = ({
  loading = true,
  content,
  ...attributes
}) => {
  const isDisplayContent = Boolean(content);
  const height = isDisplayContent ? 150 : 50;
  const width = isDisplayContent ? height + 30 : 50;

  return (
    <Modal
      transparent
      animationType="none"
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.activityIndicatorWrapper,
            {
              height: height,
              width: width,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
            },
          ]}>
          {isDisplayContent && (
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
                marginLeft: 5,
                marginRight: 5,
              }}>
              {content}
            </Text>
          )}
          <ActivityIndicator animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    // height: 50,
    // width: 50,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default DialogLoader;
