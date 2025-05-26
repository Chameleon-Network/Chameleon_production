import Clipboard from '@react-native-clipboard/clipboard';
import ToastService from './ToastService';

const ClipboardService = {
  set(str, {copiedMessage = 'Copied', errorMessage = ''} = {}) {
    try {
      if (str && typeof str === 'string') {
        Clipboard.setString(str);
        ToastService.show(copiedMessage ?? 'Copied');
      } else {
        throw new Error('Clipboard data must be string');
      }
    } catch {
      ToastService.show(errorMessage ?? 'Please tap again to copy.');
    }
  },

  get() {
    return Clipboard.getString();
  },
};

export default ClipboardService;
