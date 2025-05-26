import Svg, { Path } from 'react-native-svg';
import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewStyle } from 'react-native';

const SelectPrivacyApps = ({ size }: {size?: number}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.125 3H4.125C3.50368 3 3 3.50368 3 4.125V10.125C3 10.7463 3.50368 11.25 4.125 11.25H10.125C10.7463 11.25 11.25 10.7463 11.25 10.125V4.125C11.25 3.50368 10.7463 3 10.125 3Z"
      fill="#1A73E8"
    />
    <Path
      d="M19.8747 3H13.8747C13.2534 3 12.7497 3.50368 12.7497 4.125V10.125C12.7497 10.7463 13.2534 11.25 13.8747 11.25H19.8747C20.496 11.25 20.9997 10.7463 20.9997 10.125V4.125C20.9997 3.50368 20.496 3 19.8747 3Z"
      fill="#1A73E8"
    />
    <Path
      d="M10.125 12.7501H4.125C3.50368 12.7501 3 13.2538 3 13.8751V19.8751C3 20.4964 3.50368 21.0001 4.125 21.0001H10.125C10.7463 21.0001 11.25 20.4964 11.25 19.8751V13.8751C11.25 13.2538 10.7463 12.7501 10.125 12.7501Z"
      fill="#1A73E8"
    />
    <Path
      d="M19.8747 12.7501H13.8747C13.2534 12.7501 12.7497 13.2538 12.7497 13.8751V19.8751C12.7497 20.4964 13.2534 21.0001 13.8747 21.0001H19.8747C20.496 21.0001 20.9997 20.4964 20.9997 19.8751V13.8751C20.9997 13.2538 20.496 12.7501 19.8747 12.7501Z"
      fill="#1A73E8"
    />
  </Svg>
);

const UnSelectPrivacyApps = ({ size }: {size?: number}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.125 3H4.125C3.50368 3 3 3.50368 3 4.125V10.125C3 10.7463 3.50368 11.25 4.125 11.25H10.125C10.7463 11.25 11.25 10.7463 11.25 10.125V4.125C11.25 3.50368 10.7463 3 10.125 3Z"
      fill="#9C9C9C"
    />
    <Path
      d="M19.8747 3H13.8747C13.2534 3 12.7497 3.50368 12.7497 4.125V10.125C12.7497 10.7463 13.2534 11.25 13.8747 11.25H19.8747C20.496 11.25 20.9997 10.7463 20.9997 10.125V4.125C20.9997 3.50368 20.496 3 19.8747 3Z"
      fill="#9C9C9C"
    />
    <Path
      d="M10.125 12.7501H4.125C3.50368 12.7501 3 13.2538 3 13.8751V19.8751C3 20.4964 3.50368 21.0001 4.125 21.0001H10.125C10.7463 21.0001 11.25 20.4964 11.25 19.8751V13.8751C11.25 13.2538 10.7463 12.7501 10.125 12.7501Z"
      fill="#9C9C9C"
    />
    <Path
      d="M19.8747 12.7501H13.8747C13.2534 12.7501 12.7497 13.2538 12.7497 13.8751V19.8751C12.7497 20.4964 13.2534 21.0001 13.8747 21.0001H19.8747C20.496 21.0001 20.9997 20.4964 20.9997 19.8751V13.8751C20.9997 13.2538 20.496 12.7501 19.8747 12.7501Z"
      fill="#9C9C9C"
    />
  </Svg>
);

const PrivacyAppsIcon = React.memo(({ style, active, size = 24 }: {style?: ViewStyle, active?:  boolean, size?: number}) => (
  <View style={style}>
    {active ? (
      <SelectPrivacyApps size={size} />
    ) : (
      <UnSelectPrivacyApps size={size} />
    )}
  </View>
));

UnSelectPrivacyApps.propTypes = {
  size: PropTypes.number.isRequired,
};

SelectPrivacyApps.propTypes = {
  size: PropTypes.number.isRequired,
};

export default PrivacyAppsIcon;
