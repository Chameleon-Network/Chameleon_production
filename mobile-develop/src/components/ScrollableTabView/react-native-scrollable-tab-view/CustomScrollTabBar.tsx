import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {Fonts} from '../../../assets/fonts';
import {styledValue} from '../../../themes';
import {TabBarProps} from '.';
import {useMounted} from '../../../hooks';

interface TabProps extends TouchableOpacityProps {
  item: string;
  index: number;
  goToPage?: ((pageNumber: number) => void) | undefined;
  activeTab: number | undefined;
  width?: number;
}

const TabItem = memo(
  ({item, index, goToPage, activeTab, width, ...rest}: TabProps) => {
    const _goToPage = useCallback(() => {
      goToPage?.(index);
    }, [index, goToPage]);
    return (
      <TabBtn {...rest} onPress={_goToPage} key={index} style={{width}}>
        <TabText isActive={activeTab == index}>{item}</TabText>
      </TabBtn>
    );
  },
);

interface Props extends TabBarProps {
  renderBelow?: () => JSX.Element;
  initialPage?: number;
  tabContainerStyle?: any;
}

export const CustomScrollableTabView = memo((props: Props) => {
  const {
    scrollValue,
    containerWidth,
    tabs,
    goToPage,
    activeTab,
    initialPage,
    renderBelow,
    tabContainerStyle,
  } = props;
  const numberOfTabs = useMemo(() => tabs?.length || 1, [tabs?.length]);
  const isMounted = useMounted();
  const _containerWidth = useMemo(() => containerWidth || 0, [containerWidth]);

  const [listTabWidth, setListTabWidth] = useState<{
    [position: string]: number;
  }>({});

  useEffect(() => {
    // setTabList if container with rotate
    setListTabWidth({});
  }, [_containerWidth]);

  const tabWidth = useMemo(() => {
    const listValues = Object.values(listTabWidth);

    if (listValues.length !== numberOfTabs) {
      return 0;
    }
    const _max = Math.max(...listValues);

    const totalSum = _max * numberOfTabs;

    if (totalSum < _containerWidth) {
      return _containerWidth / numberOfTabs;
    }
    return Math.max(...listValues, 0);
  }, [Object.values(listTabWidth).length, _containerWidth, numberOfTabs]);

  const itemPosX = useRef<{[index: number]: number}>({});
  const scrollRef = useRef<ScrollView | null | any>(null);
  const tabUnderlineStyle = {
    width: tabWidth,
  };

  const translateX =
    scrollValue?.interpolate({
      inputRange: [0, 1],
      outputRange: [0, tabWidth],
    }) || 0;

  useEffect(() => {
    initialPage && goToPage?.(initialPage);
  }, [initialPage]);

  useEffect(() => {
    scrollRef?.current?.scrollTo({
      x: itemPosX.current[activeTab || 0] - tabWidth,
    });
  }, [activeTab]);

  return (
    <Container>
      <TabContainer
        ref={scrollRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        contentContainerStyle={tabContainerStyle}>
        {isMounted ? (
          <View>
            <TabWrap>
              {tabs?.map((item, index) => (
                <TabItem
                  key={index}
                  width={tabWidth || undefined}
                  onLayout={e => {
                    const _layout = e.nativeEvent.layout;
                    itemPosX.current[index] = _layout.x;
                    setListTabWidth(old => ({
                      ...old,
                      [index]: _layout.width + 4,
                    }));
                  }}
                  goToPage={goToPage}
                  item={item}
                  index={index}
                  activeTab={activeTab}
                />
              ))}
            </TabWrap>
            <Animated.View
              style={[
                tabUnderlineStyle,
                {transform: [{translateX}]},
                style.underlineBar,
              ]}
            />
          </View>
        ) : null}
      </TabContainer>
      {renderBelow && renderBelow()}
    </Container>
  );
});

const Container = styled.View`
  background-color: ${styledValue.COLOR_NEUTRAL_BACKGROUND_1_DEFAULT};
`;

const TabContainer = styled.ScrollView``;

const TabWrap = styled.View`
  flex-direction: row;
  // border-bottom-width: 2px;
  // border-bottom-color: ${styledValue.COLOR_STROKE_INSIDE_2_DEFAULT};
`;

const TabBtn = styled.TouchableOpacity`
  height: 44px;
  justify-content: center;
  align-items: center;
`;

const TabText = styled.Text<{isActive?: boolean}>`
  font-family: ${p => (p.isActive ? Fonts.Bold : Fonts.Regular)};
  font-size: 14px;
  color: ${p =>
    p.isActive
      ? styledValue.COLOR_NEUTRAL_TEXT_1_DEFAULT
      : styledValue.COLOR_NEUTRAL_TEXT_3_DEFAULT};
  padding: 0 4px;
`;

const style = StyleSheet.create({
  underlineBar: {
    height: 2,
    backgroundColor: '#007AFF',
    position: 'absolute',
    bottom: 0,
  },
});
