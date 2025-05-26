import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import deviceLog, {InMemoryAdapter, LogView} from 'react-native-device-log';
import TextStyle, {screenSize, STATUSBAR_HEIGHT} from '@src/styles/TextStyle';
import {COLORS} from '@src/styles';
import {CONSTANT_CONFIGS} from '@src/constants';

export const TAG = 'DeviceLog';
const LOG = 1;
const INFO = 2;
const DEBUG = 3;
const SUCCESS = 4;

const isOnLogView = __DEV__ || !CONSTANT_CONFIGS.isMainnet;

interface DeviceLogInstance {
  log: (msg: string, type?: number) => void;
  close: () => void;
  show: () => void;
}

interface DeviceLogComponent extends React.FC {
  log: (msg: string, type?: number) => void;
  logSuccess: (msg: string) => void;
  logInfo: (msg: string) => void;
  close: () => void;
  show: () => void;
}

// Create a ref to store the instance
const instanceRef = useRef<DeviceLogInstance | null>(null);

const DeviceLog: DeviceLogComponent = () => {
  const [open, setOpen] = useState(isOnLogView);

  const log = (msg: string, type: number = LOG) => {
    switch (type) {
      case INFO:
        deviceLog.info(msg);
        break;
      case DEBUG:
        deviceLog.debug(msg);
        break;
      case SUCCESS:
        deviceLog.success(msg);
        break;
      default:
        deviceLog.log(msg);
        break;
    }
  };

  const close = () => {
    open && setOpen(false);
  };

  const show = () => {
    console.log(TAG, 'show OKKKKKK');
    !open && setOpen(true);
  };

  const handleToggleOnOf = () => {
    open ? close() : show();
  };

  useEffect(() => {
    const initDeviceLog = async () => {
      await deviceLog.init(new InMemoryAdapter(), {
        logToConsole: true,
        logRNErrors: true,
        maxNumberToRender: 0,
        maxNumberToPersist: 0,
      });
      deviceLog?.clear();
      deviceLog?.startTimer(`${TAG}`);
      instanceRef.current = {log, close, show};
    };

    initDeviceLog();

    return () => {
      deviceLog?.stopTimer(`${TAG}`);
    };
  }, []);

  const text = open ? 'Close' : 'Show';
  const styleView = open ? styles.showContainer : styles.hideContainer;

  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={handleToggleOnOf}>
        <Text style={styles.textTitle}>{text}</Text>
      </TouchableOpacity>
      <View style={styleView}>
        <LogView inverted={false} multiExpanded timeStampFormat="HH:mm:ss" />
      </View>
    </View>
  );
};

// Static methods
DeviceLog.log = (msg: string, type?: number) => {
  if (instanceRef.current?.log) {
    instanceRef.current.log(msg, type);
  }
};

DeviceLog.logSuccess = (msg: string) => {
  DeviceLog.log(msg, SUCCESS);
};

DeviceLog.logInfo = (msg: string) => {
  DeviceLog.log(msg, INFO);
};

DeviceLog.close = () => instanceRef.current?.close();
DeviceLog.show = () => instanceRef.current?.show();

export default DeviceLog;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    position: 'absolute',
    width: screenSize.width - 10,
    top: 2 * STATUSBAR_HEIGHT,
    margin: 5,
    maxHeight: (screenSize.height * 2) / 3,
    borderRadius: 4,
  },
  textTitle: {
    ...TextStyle.mediumText,
    textAlign: 'right',
    fontWeight: 'bold',
    color: COLORS.white,
  },
  showContainer: {
    opacity: 1,
    flex: 1,
  },
  hideContainer: {
    opacity: 0,
    width: 0,
    height: 0,
  },
});
