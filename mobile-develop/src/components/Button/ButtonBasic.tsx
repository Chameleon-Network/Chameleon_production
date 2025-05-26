import {Text} from '@src/components/core/Text';
import {TouchableOpacity} from '@src/components/core/TouchableOpacity';
import {COLORS, FONTS} from '@src/styles';
import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {useTheme} from 'styled-components/native';

const styled = StyleSheet.create({
  container: {
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  title: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    textAlign: 'center',
  },
});

interface ButtonBasicProps extends TouchableOpacityProps {
  title?: string;
  btnStyle?: any;
  titleStyle?: any;
  customContent?: any;
  disabled?: boolean;
  loading?: boolean;
}

const ButtonBasic = (props: ButtonBasicProps) => {
  const {
    title = '',
    btnStyle,
    titleStyle,
    customContent,
    disabled = true,
    loading = false,
    ...rest
  } = props;
  const theme = useTheme();
  const containerStyle = useMemo(
    () => [
      {
        ...styled.container,
        ...(btnStyle && {...btnStyle}),
        ...(titleStyle && {...titleStyle}),
        ...(disabled && {
          backgroundColor: theme.grey7,
        }),
        ...(loading && {
          backgroundColor: theme.ctaMain,
        }),
      },
    ],
    [btnStyle, titleStyle, disabled, loading, theme],
  );
  return (
    <TouchableOpacity style={containerStyle} {...rest}>
      {customContent ? (
        customContent
      ) : (
        <View style={{flexDirection: 'row'}}>
          {loading ? (
            <ActivityIndicator style={{marginRight: 5}} color={COLORS.white} />
          ) : null}
          <Text
            style={[
              styled.title,
              disabled
                ? {
                    color: theme.ctaMain,
                  }
                : {
                    color: theme.mainText,
                  },
              titleStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ButtonBasic;
