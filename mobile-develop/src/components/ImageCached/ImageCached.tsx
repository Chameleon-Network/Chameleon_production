import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import { AppIcon } from '../Icons';
// import { ActivityIndicator } from '@components/core';
// import { View, StyleSheet } from 'react-native';

const ImageCached = (props) => {
  const { style, uri, defaultImage, ...rest } = props;
  const [{ error }, setState] = React.useState({
    loading: false,
    error: false,
  });

  if (!!error || !uri) {
    return <AppIcon style={style} {...rest} />;
  }
  return (
    <>
      <FastImage
        style={[style, { borderRadius: 50 }]}
        source={{
          uri: uri,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.web,
        }}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => setState((value) => ({ ...value, loading: true }))}
        onLoadEnd={() => setState((value) => ({ ...value, loading: false }))}
        onError={() => setState({ error: true, loading: false })}
        {...rest}
      />
      {/*{loading && (*/}
      {/*  <View style={[styled.loading]} zIndex={999}>*/}
      {/*    <ActivityIndicator />*/}
      {/*  </View>*/}
      {/*)}*/}
    </>
  );
};

// const styled = StyleSheet.create({
//   loading: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     left: 24
//   },
// });
export default ImageCached;
