import {SearchIcon, StarIcon} from '@components/Icons';
import {ArrowDownLine} from '@components/Icons/icon.arrowDown';
import Header from '@src/components/Header/Header';
import {Row} from '@src/components/Row';
import {Text, TouchableOpacity, View} from '@src/components/core';
import {
  navigateToMarketSearchCoins,
  navigateToNews,
} from '@src/router/NavigationServices';
import {useSelector} from '@src/store/getStore';
import {newsSelector} from '@src/store/news/selectors';
import {actionToggleMarketTab} from '@src/store/setting';
import {marketTabSelector} from '@src/store/setting/selectors';
import {COLORS, FONTS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled, {useTheme} from 'styled-components/native';

const headers = [
  {name: 'Gainers', filterField: 'change', orderField: 'desc'},
  {name: 'Losers', filterField: 'change', orderField: 'asc'},
];

export const MarketTabs = {
  ALL: 'all',
  FAVORITE: 'favorite',
};

const StyledTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({theme}) => theme.btnBG2};
`;

const Notification = React.memo(() => {
  const {isReadAll} = useSelector(newsSelector);
  const handleNavNotification = () => navigateToNews({lastNewsID: isReadAll});
  return (
    <View style={headerStyled.iconButtonContainer}>
      <TouchableOpacity onPress={handleNavNotification}>
        <Ionicons name="notifications" size={24} color={COLORS.white} />
      </TouchableOpacity>
      {isReadAll !== 0 && <View style={headerStyled.notificationDot} />}
    </View>
  );
});

interface MarketHeaderProps {
  onFilter: (filter: {filterField: string; orderField: string}) => void;
}

export const MarketHeader = memo(({onFilter}: MarketHeaderProps) => {
  const theme = useTheme();
  const activeTab = useSelector(marketTabSelector);
  const onChangeTab = useCallback(tab => {
    actionToggleMarketTab(tab);
  }, []);

  return (
    <>
      <Header
        title="Privacy Markets"
        titleStyled={headerStyled.title}
        hideBackButton
        rightHeader={
          <View style={headerStyled.headerRightContainer}>
            <TouchableOpacity
              style={headerStyled.iconButtonContainer}
              onPress={navigateToMarketSearchCoins}>
              <SearchIcon color={COLORS.white} size={24} />
            </TouchableOpacity>
            <View style={headerStyled.iconButtonSpacing} />
            <Notification />
          </View>
        }
      />
      <View borderTop>
        <Row
          centerVertical
          spaceBetween
          style={[
            headerStyled.wrapFilter,
            globalStyled.defaultPaddingHorizontal,
            globalStyled.defaultBorderSection,
          ]}>
          <Row centerVertical>
            <StyledTouchableOpacity
              style={headerStyled.wrapTab}
              onPress={() => {
                onChangeTab(MarketTabs.ALL);
              }}>
              <Text
                style={[
                  headerStyled.tabText,
                  activeTab === MarketTabs.ALL && {color: COLORS.blue5},
                ]}>
                All
              </Text>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              style={headerStyled.wrapTab}
              onPress={() => {
                onChangeTab(MarketTabs.FAVORITE);
              }}>
              <StarIcon isBlue={activeTab === MarketTabs.FAVORITE} />
            </StyledTouchableOpacity>
          </Row>
          <SelectDropdown
            data={headers}
            defaultValueByIndex={0}
            dropdownStyle={[
              headerStyled.dropdownStyle,
              {backgroundColor: theme.btnBG2},
            ]}
            onSelect={selectedItem => {
              onFilter &&
                onFilter({
                  filterField: selectedItem.filterField,
                  orderField: selectedItem.orderField,
                });
            }}
            buttonTextAfterSelection={selectedItem => selectedItem.name}
            rowTextForSelection={item => item.name}
            rowTextStyle={[headerStyled.rowTextStyle, {color: theme.text1}]}
            rowStyle={[
              {
                backgroundColor: theme.btnBG2,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.border4,
              },
            ]}
            buttonStyle={[
              headerStyled.buttonStyle,
              {backgroundColor: theme.btnBG2},
            ]}
            buttonTextStyle={[
              headerStyled.buttonTextStyle,
              {color: theme.text1},
            ]}
            renderDropdownIcon={() => {
              return <ArrowDownLine />;
            }}
          />
        </Row>
      </View>
    </>
  );
});

export const headerStyled = StyleSheet.create({
  title: {
    ...FONTS.TEXT.incognitoH4,
    lineHeight: 28,
  },
  wrapTab: {
    width: 49,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  tabText: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.regular,
  },
  wrapSearch: {
    height: 60,
    marginBottom: 8,
  },
  iconButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconButtonSpacing: {
    width: 8,
  },
  wrapInput: {
    flex: 1,
  },
  rowStyle: {},
  rowTextStyle: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.small,
  },
  dropdownStyle: {
    borderRadius: 8,
    width: 110,
  },
  buttonTextStyle: {
    ...FONTS.STYLE.normal,
    color: COLORS.black,
    fontSize: FONTS.SIZE.regular,
  },
  buttonStyle: {
    width: 98,
    borderRadius: 8,
    height: 40,
    backgroundColor: COLORS.lightGrey30,
  },
  wrapFilter: {
    paddingTop: 24,
  },
});

export const itemStyled = StyleSheet.create({
  wrapItem: {
    paddingBottom: 30,
  },
  blackLabel: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small + 1,
    textAlign: 'left',
    color: COLORS.black,
  },
  icon: {
    marginRight: 16,
    width: 20,
    height: 20,
  },
  sectionFirst: {
    flex: 0.6,
    paddingRight: 10,
  },
  sectionSecond: {
    flex: 0.4,
    paddingRight: 10,
  },
  sectionThird: {
    width: 80,
    paddingRight: 10,
  },
});
