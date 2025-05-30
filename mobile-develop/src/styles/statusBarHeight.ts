import { Dimensions, Platform, StatusBar } from "react-native";

function isIphone() {
  return Platform.OS === "ios" && !Platform.isTV;
}

export function isIphoneX() {
  const dimen = Dimensions.get("window");
  return (
    isIphone() &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926 ||
      dimen.height === 852 ||
      dimen.width === 852 || // 14 Pro
      dimen.height === 932 ||
      dimen.width === 932 || // 14 Pro Max
      dimen.height === 956 || // 16 Pro Max
      dimen.width === 956 || // 16 Pro Max
      dimen.height === 874 || // 16 Pro
      dimen.width === 874 || // 16 Pro
      dimen.height === 1366 ||
      dimen.width === 1024) // iPad Pro
  );
}

export function hasIsland() {
  const dimen = Dimensions.get("window");
  return (
    isIphone() &&
    (dimen.height === 852 ||
      dimen.width === 852 || // 14 Pro
      dimen.height === 932 ||
      dimen.width === 932 ||  // 14 Pro Max
      dimen.height === 874 || // 16 Pro
      dimen.width === 874 || // 16 Pro
      dimen.height === 956 ||  // 16 Pro Max
      dimen.width === 956)  // 16 Pro Max
  );
}

export function ifIphoneX(iphoneXStyle: number, regularStyle: number) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe: boolean = false) {
  function safeHeight() {
    // FIXME: There are more height values depending on the model (iPhone 12/13 -> 47, 13 mini -> 50, ..)
    return hasIsland() ? 59 : 44;
  }
  function normalHeight() {
    // FIXME: There are more height values depending on the model (iPhone 12/13 -> 47, 13 mini -> 50, ..)
    return hasIsland() ? 40 : 30;
  }
  return Platform.select({
    ios: ifIphoneX(safe ? safeHeight() : normalHeight(), 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

export const statusBarHeight = getStatusBarHeight();

export const bottomSpaceHeight = getBottomSpace();
