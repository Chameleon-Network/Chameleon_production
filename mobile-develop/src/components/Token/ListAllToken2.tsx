import BtnChecked from '@src/components/Button/BtnChecked';
import { Text, View } from '@src/components/core';
import { FONTS } from '@src/styles';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import BigList from 'react-native-big-list';
import Empty from '../Empty';
const styles = StyleSheet.create({
  header: { height: 40, justifyContent: 'center' },
  buttonToggle: { marginHorizontal: 24 },
  checkboxLabel: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
    marginLeft: 8,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 40,
  },
});

const ListAllToken2 = (props) => {
  const {
    tokensFactories,
    renderItem,
    isShowUnVerifiedTokens,
    setShowUnVerifiedTokens,
  } = props;

  const memoizedValue = useMemo(() => renderItem, [tokensFactories]);

  const renderSectionHeader = (section) => {
    // console.log(section);
    if (section === 1 && isShowUnVerifiedTokens) {
      return (
        <View style={[styles.header]}>
          <BtnChecked
            style={styles.buttonToggle}
            checked={isShowUnVerifiedTokens}
            onPress={() => {
              setShowUnVerifiedTokens();
            }}
            hook={
              <Text style={styles.checkboxLabel}>Show unverified coins</Text>
            }
          />
        </View>
      );
    }
    return null;
  };

  const renderSectionFooter = (section) => {
    if (section === 0 && !isShowUnVerifiedTokens) {
      return (
        <View style={[styles.header]}>
          <BtnChecked
            style={styles.buttonToggle}
            checked={isShowUnVerifiedTokens}
            onPress={() => {
              setShowUnVerifiedTokens();
            }}
            hook={
              <Text style={styles.checkboxLabel}>Show unverified coins</Text>
            }
          />
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty />
      </View>
    );
  };

  return (
    <BigList
      sections={tokensFactories}
      renderItem={memoizedValue}
      sectionHeaderHeight={40}
      renderSectionHeader={renderSectionHeader}
      sectionFooterHeight={40}
      itemHeight={75}
      renderSectionFooter={renderSectionFooter}
      renderEmpty={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
    />
  );
};

export default React.memo(ListAllToken2);
