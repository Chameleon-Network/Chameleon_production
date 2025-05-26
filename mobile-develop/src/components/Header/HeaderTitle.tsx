import {Text} from '@src/components/core/Text';
import {TouchableOpacity} from '@src/components/core/TouchableOpacity';
import {View2} from '@src/components/core/View';
import {SearchIcon} from '@src/components/Icons';
import React from 'react';
import {StyleSheet} from 'react-native';
import globalStyled from '@src/theme/theme.styled';
import {FONTS} from '@src/styles';

export const HeaderContext = React.createContext({});

export const HeaderTitle = () => {
  const {headerProps} = React.useContext(HeaderContext);
  const {
    onHandleSearch,
    title,
    titleStyled,
    canSearch,
    customHeaderTitle,
    styledContainerHeaderTitle,
  } = headerProps;

  const Title = () => (
    <View2 style={[stylesHeaderTitle.container]}>
      <View2
        style={[stylesHeaderTitle.containerTitle, styledContainerHeaderTitle]}>
        <Text
          style={[
            stylesHeaderTitle.title,
            canSearch && stylesHeaderTitle.searchStyled,
            titleStyled,
          ]}
          numberOfLines={1}>
          {title}
        </Text>
      </View2>

      {customHeaderTitle && customHeaderTitle}
    </View2>
  );
  if (!canSearch) {
    return <Title />;
  }
  return (
    <TouchableOpacity
      style={stylesHeaderTitle.container}
      onPress={onHandleSearch}>
      <Title />
      <SearchIcon />
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: globalStyled.defaultPadding.paddingHorizontal,
  },
});

export const stylesHeaderTitle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    ...FONTS.TEXT.incognitoH4,
  },
  searchStyled: {
    textTransform: 'none',
    maxWidth: '100%',
  },
  containerTitle: {},
});
