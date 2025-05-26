import React from 'react';
import Svg, {Path} from 'react-native-svg';
import PropTypes from 'prop-types';
import {View} from 'react-native';

const VectorArrow = () => (
  <Svg width={10} height={9} viewBox="0 0 10 9" fill="none">
    <Path
      d="M9.89193 0.426788C9.81673 0.29653 9.70845 0.188457 9.57804 0.113512C9.44764 0.0385663 9.29974 -0.000590396 9.14934 6.72853e-06H0.844181C0.695148 0.00164477 0.549143 0.0422771 0.420689 0.117861C0.292236 0.193446 0.185812 0.301347 0.112007 0.430831C0.038201 0.560314 -0.000413967 0.706866 3.34687e-06 0.855907C0.000420661 1.00495 0.0398558 1.15128 0.114385 1.28035L4.26696 8.13872C4.34305 8.26415 4.45017 8.36785 4.578 8.43982C4.70583 8.51179 4.85006 8.5496 4.99676 8.5496C5.14346 8.5496 5.28768 8.51179 5.41551 8.43982C5.54335 8.36785 5.65047 8.26415 5.72655 8.13872L9.87913 1.28035C9.956 1.15172 9.99766 1.00512 9.9999 0.855284C10.0022 0.705451 9.96491 0.557666 9.89193 0.426788Z"
      fill="#757575"
    />
  </Svg>
);

const ArrowFillIcon = React.memo(({position}: {position: string}) => {
  let rotate;
  switch (position) {
    case 'RIGHT':
      rotate = 90;
      break;
    case 'LEFT':
      rotate = 90;
      break;
    case 'UP':
      rotate = 180;
      break;
    default:
      rotate = 0;
  }
  rotate = `${rotate}deg`;
  return (
    <View
      key={rotate}
      style={{
        transform: [{rotate: rotate}],
      }}>
      <VectorArrow />
    </View>
  );
});

ArrowFillIcon.defaultProps = {
  position: 'DOWN', // DOWN | UP | RIGHT | LEFT
};

ArrowFillIcon.propTypes = {
  position: PropTypes.string,
};

export default ArrowFillIcon;
