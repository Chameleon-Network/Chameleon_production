import { useFocusEffect } from '@react-navigation/native';
import { getFunctionConfigs } from '@src/services/api/misc';
import ToastService from '@src/services/ToastService';
import { useState, useCallback, useMemo } from 'react';


export const getDurationShowMessage = (message: string) => {
  message = message || '';
  return Math.max(Math.floor(message.length / 15) * 1000, 2000);
};

export const handleGetFunctionConfigs = async (featureName) => {
  let result = {};
  try {
    const features = await getFunctionConfigs();
    if (features && features.length) {
      return (
        features.find((featureItem) => featureItem.name === featureName) || {}
      );
    }
  } catch (e) {
    console.debug('CAN NOT GET FEATURE', featureName, e);
  }
  return result;
};

const useFeatureConfig = (featureName: string, onPress?: (...params: any[]) => void) => {
  const [feature, setFeature] = useState({});
  const handlePress = useCallback(
    (...params) => {
      if (feature && feature?.disabled && global.homeConfig !== 'staging') {
        // const duration = getDurationShowMessage(feature.message);
        return ToastService.show(feature?.message || '');
      }

      if (typeof onPress === 'function') {
        return onPress(...params);
      }
    },
    [onPress, feature],
  );

  const isDisabled = useMemo(() => {
    if (global.homeConfig === 'staging') return false;
    if (feature && feature?.disabled) {
      return feature?.disabled;
    }

    return false;
  }, [feature]);

  const getFeature = async () => {
    try {
      const feature = await handleGetFunctionConfigs(featureName);
      setFeature(feature);
    } catch (e) {
      console.debug('CAN NOT GET FEATURE', featureName, e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFeature();
    }, [featureName]),
  );

  return [handlePress, isDisabled, feature?.message];
}

export default useFeatureConfig;
