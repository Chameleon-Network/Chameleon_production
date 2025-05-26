import {LoadingContainer, Text3, Text8} from '@src/components/core';
import {FONTS, screenWidth} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const VIDEO_HEIGHT = Math.floor(((screenWidth - 24 * 2) / 16) * 9);

export const Video = memo(props => {
  const {
    title,
    sub,
    video: videoID,
    onPressExpand,
    index,
    displayIndex,
  } = props;
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(displayIndex === index);
  const [fullScreen, setFullScreen] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const onExpandVideo = useCallback(() => {
    if (typeof onPressExpand === 'function') {
      onPressExpand(index);
    }
  }, [onPressExpand, index]);

  const onLoadVideo = useCallback(() => {
    setLoading(false);
  }, []);

  const onFullScreenChange = (fullscreenStatus: boolean) => {
    setFullScreen(fullscreenStatus);
  };

  useEffect(() => {
    if (index === displayIndex) setLoading(true);
  }, [index, displayIndex]);

  return (
    <View>
      <TouchableOpacity
        style={[styles.wrapContent, globalStyled.defaultPaddingHorizontal]}
        onPress={onExpandVideo}>
        <Text8 style={styles.title}>{title}</Text8>
        <Text3 style={styles.sub}>{sub}</Text3>
      </TouchableOpacity>
      {displayIndex === index && (
        <View style={styles.wrapper}>
          <>
            {loading && <LoadingContainer containerStyled={styles.loading} />}
            <YoutubePlayer
              height={VIDEO_HEIGHT}
              play={playing}
              videoId={videoID}
              webViewStyle={[
                styles.webview,
                {width: fullScreen ? screenWidth : screenWidth - 24 * 2},
              ]}
              onChangeState={onStateChange}
              webViewProps={{allowsFullscreenVideo: true}}
              onReady={onLoadVideo}
              javaScriptEnabled
              scrollEnabled={false}
              onFullScreenChange={onFullScreenChange}
            />
          </>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  webview: {
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    ...FONTS.TEXT.incognitoH6,
    color: '#000',
    lineHeight: 27,
    marginTop: 15,
  },
  sub: {
    ...FONTS.TEXT.incognitoP2,
    lineHeight: 21,
    color: '#595959'
  },
  wrapContent: {
    marginBottom: 20,
  },
  loading: {
    height: 40,
    position: 'absolute',
    alignSelf: 'center',
  },
  wrapper: {
    marginBottom: 21,
    borderRadius: 10,
  },
});
