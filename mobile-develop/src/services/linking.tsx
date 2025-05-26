import {
  navigateToCommunity,
  navigateToWebview,
} from '@src/router/NavigationServices';
import {Linking} from 'react-native';
import ToastService from './ToastService';

const LinkingService = {
  openUrl(url: string) {
    try {
      if (url && typeof url === 'string') {
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            navigateToWebview({url});
          }
        });
      } else {
        throw new Error('URL must be string');
      }
    } catch {
      ToastService.show('Can not open this URL, please try again');
    }
  },

  openCommunityUrl(uri: string) {
    navigateToCommunity({uri});
  },

  openUrlInSide(uri: string) {
    navigateToWebview({url: uri});
  },

  openSettings() {
    Linking.openSettings();
  },

  // openLocation() {
  //   return openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS);
  // },
};

export default LinkingService;
