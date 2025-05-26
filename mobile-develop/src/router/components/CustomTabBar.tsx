import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {fontNames} from '@src/styles/font';
import {getBottomSpace} from '@src/styles/statusBarHeight';
import {styledValue} from '@src/theme';
import React, {memo, useCallback, useMemo} from 'react';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const ContentContainer = styled.View<{height: number}>`
  background-color: ${styledValue.background2};
  width: 100%;
  height: ${p => p.height || getBottomSpace() + 56}px;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.Text<{focused: boolean}>`
  font-size: 10px;
  text-align: center;
  color: ${p => (p.focused ? styledValue.ctaMain : styledValue.text4)};
  font-family: ${p => (p.focused ? fontNames.bold : fontNames.regular)};
  margin-top: 4px;
  padding: 0 4px;
`;

const ButtonFlex = styled.TouchableOpacity<{bottom: number}>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${p => p.bottom || getBottomSpace()}px;
  height: 100%;
`;
const BtnView = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const TopTab = styled.View`
  position: absolute;
  top: 0;
  height: 2px;
  width: 24px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  background-color: ${styledValue.ctaMain};
`;

export const CustomTabBar = memo(function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const safe = useSafeAreaInsets();

  const onButtonPress = useCallback(
    ({
      routeKey,
      routeName,
      isFocused,
    }: {
      routeName: string;
      routeKey: string;
      isFocused: boolean;
    }) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        //@ts-ignore
        navigation.navigate(routeName);
        return;
      }
    },
    [],
  );

  const renderBottom = () => {
    let _style: ViewStyle | any = {};
    const _Btn = ButtonFlex;

    return (
      <>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const label =
            options.title !== undefined ? options.title : route.name;

          const isFocused = state.index === index;
          return (
            <_Btn
              key={'tab-' + index.toString()}
              onPress={() => {
                onButtonPress({
                  routeName: route.name,
                  routeKey: route.key,
                  isFocused: state.index === index,
                });
              }}
              style={_style}
              bottom={safe.bottom}>
              {isFocused ? <TopTab /> : null}
              <View>
                <BtnView>
                  {options &&
                    options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color: '',
                      size: 0,
                    })}
                </BtnView>
              </View>
              <Label numberOfLines={1} focused={isFocused}>
                {label}
              </Label>
            </_Btn>
          );
        })}
      </>
    );
  };

  const bottomBarHeight = useMemo(() => {
    return safe.bottom + 56;
  }, [safe.bottom]);

  return (
    <ContentContainer height={bottomBarHeight}>
      {renderBottom()}
    </ContentContainer>
  );
});
