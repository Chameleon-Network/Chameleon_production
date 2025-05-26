import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import { AppIcon } from '../Icons';

const ImageFastWrapper = (props) => {
  const { style, uri, ...rest } = props;
  const [{ error }, setState] = React.useState({
    loading: false,
    error: false,
  });

  if (!!error || !uri) {
    return <AppIcon style={style} {...rest} />;
  }

  return (
    <FastImage
      style={[style, { borderRadius: 50 }]}
      source={{
        uri: uri,
      }}
      resizeMode={FastImage.resizeMode.cover}
      onLoadStart={() => setState((value) => ({ ...value, loading: true }))}
      onLoadEnd={() => setState((value) => ({ ...value, loading: false }))}
      onError={() => setState({ error: true, loading: false })}
      {...rest}
    />
  );
};

export default ImageFastWrapper;
