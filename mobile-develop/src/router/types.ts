import {ROUTE_NAMES} from './routeNames';

export interface QrCodeRouteParams {
  onScanComplete?: (data: string) => void;
  callback?: (data: string) => void;
}

export type RootStackParamList = {
  QRCodeScanner: QrCodeRouteParams;
  // Add other route params as needed
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
