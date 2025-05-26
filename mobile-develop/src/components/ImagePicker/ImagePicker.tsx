import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, Text4} from '@src/components/core';
import styles from './styles';
import {ArrowRightGreyIcon} from '../Icons';
import {Image} from 'react-native';

interface ImagePickerProps {
  onPick?: () => void;
  file?: {
    uri: string;
  };
  text?: string;
  defaultImageUri?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  label?: string;
}

const ImagePicker = ({
  onPick,
  file,
  text,
  defaultImageUri,
  onBlur,
  onFocus,
  label = 'Icon',
}: ImagePickerProps) => {
  const uri = file?.uri || defaultImageUri;

  const handlePick = useCallback(() => {
    typeof onPick === 'function' && onPick();
    typeof onFocus === 'function' && onFocus();
  }, [onPick, onFocus]);

  return (
    <TouchableOpacity onPress={handlePick} onBlur={onBlur}>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Text4 style={styles.text}>{text || 'Upload your image'}</Text4>
        <View style={styles.hook}>
          {uri ? (
            <Image style={styles.image} source={{uri}} />
          ) : (
            <View style={styles.circle} />
          )}
          <View style={styles.chooseFileContainer}>
            <Text4 style={styles.chooseFile}>Choose file</Text4>
            <ArrowRightGreyIcon />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ImagePicker;
