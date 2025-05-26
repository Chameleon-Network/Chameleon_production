import {Text} from '@src/components/core/Text';
import {TouchableOpacity} from '@src/components/core/TouchableOpacity';
import {View2} from '@src/components/core/View';
import {SearchIcon} from '@src/components/Icons';
import {goBack} from '@src/router/NavigationServices';
import React, {memo, ReactElement, ReactNode} from 'react';
import {BackHandler, SafeAreaView, TextStyle, ViewStyle} from 'react-native';
import SearchBox from './Header.searchBox';
import {styled, styledHeaderTitle} from './Header.styled';
import {useFocusEffect} from '@react-navigation/native';
import BtnCircleBack from '../Button/BtnCircleBack';
import SelectAccountButton from '../SelectAccountButton';
import {debounce} from 'lodash';

export const HeaderContext = React.createContext({});

interface HeaderProps {
  title?: string;
  rightHeader?: React.ReactElement | React.ReactNode;
  titleStyled?: any;
  canSearch?: boolean;
  dataSearch?: any[];
  toggleSearch?: boolean;
  accountSelectable?: boolean;
  onGoBack?: () => void;
  onHandleSearch?: () => void;
  style?: any;
  onSubmit?: () => void;
  onTextSearchChange?: (text: string) => void;
  isNormalSearch?: boolean;
  customHeaderTitle?: React.ReactElement | React.ReactNode;
  styledContainerHeaderTitle?: any;
  placeHolder?: string;
  ignoredAccounts?: any[];
  hideBackButton?: boolean;
  disableAccountButton?: boolean;
  handleSelectedAccount?: () => void;
  autoFocus?: boolean;
}

const Title = ({
  styledContainerHeaderTitle,
  title,
  titleStyled,
  canSearch,
  customHeaderTitle,
}: {
  styledContainerHeaderTitle?: ViewStyle,
  title: string,
  titleStyled?: TextStyle,
  canSearch?: boolean,
  customHeaderTitle?: ReactElement | ReactNode,
}) => (
  <View2 style={[styledHeaderTitle.container]}>
    <View2
      style={[styledHeaderTitle.containerTitle, styledContainerHeaderTitle]}>
      <Text
        style={[
          styledHeaderTitle.title,
          canSearch && styledHeaderTitle.searchStyled,
          titleStyled,
        ]}
        numberOfLines={1}>
        {title}
      </Text>
    </View2>

    {customHeaderTitle && customHeaderTitle}
  </View2>
);

export const HeaderTitle = memo(() => {
  const {headerProps} = React.useContext(HeaderContext);
  const {
    onHandleSearch,
    title,
    titleStyled,
    canSearch,
    customHeaderTitle,
    styledContainerHeaderTitle,
  } = headerProps;

  if (!canSearch) {
    return (
      <Title
        styledContainerHeaderTitle={styledContainerHeaderTitle}
        title={title}
        titleStyled={titleStyled}
        canSearch={canSearch}
        customHeaderTitle={customHeaderTitle}
      />
    );
  }
  return (
    <TouchableOpacity
      style={styledHeaderTitle.container}
      onPress={onHandleSearch}>
      <Title
        styledContainerHeaderTitle={styledContainerHeaderTitle}
        title={title}
        titleStyled={titleStyled}
        canSearch={canSearch}
        customHeaderTitle={customHeaderTitle}
      />
      <SearchIcon />
    </TouchableOpacity>
  );
});

const Header = ({
  title,
  rightHeader,
  titleStyled,
  canSearch,
  dataSearch,
  autoFocus,
  accountSelectable,
  onGoBack,
  style,
  onSubmit,
  isNormalSearch,
  onTextSearchChange,
  customHeaderTitle,
  styledContainerHeaderTitle,
  placeHolder,
  ignoredAccounts = [],
  hideBackButton,
  disableAccountButton,
  handleSelectedAccount,
}: HeaderProps) => {
  const [state, setState] = React.useState({
    toggleSearch: false,
  });

  const handleGoBack = () =>
    typeof onGoBack === 'function' ? onGoBack() : goBack();
  const _handleGoBack = debounce(handleGoBack, 100);

  const onHandleSearch = async () => {
    if (canSearch) {
      setState(state => ({
        ...state,
        toggleSearch: true,
      }));
    }
  };

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        _handleGoBack();
        return true;
      },
    );
    return () => backHandler.remove();
  });

  const renderHeaderTitle = () => {
    if (state.toggleSearch || autoFocus) {
      if (isNormalSearch) {
        return (
          <SearchBox
            placeHolder={placeHolder || ''}
            onSubmit={isNormalSearch ? onSubmit : () => {}}
            onChange={(text: any) =>
              isNormalSearch ? onTextSearchChange && onTextSearchChange(text) : () => {}
            }
            isNormalSearch={isNormalSearch}
          />
        );
      }
      return <SearchBox title={title} inputStyle={titleStyled} />;
    }
    return <HeaderTitle />;
  };

  return (
    <HeaderContext.Provider
      value={{
        headerProps: {
          title,
          rightHeader,
          titleStyled,
          canSearch,
          dataSearch,
          toggleSearch: state.toggleSearch,
          onHandleSearch,
          customHeaderTitle,
          styledContainerHeaderTitle,
        },
      }}>
      <SafeAreaView>
        <View2 style={[styled.container, style]}>
          {!hideBackButton && <BtnCircleBack onPress={_handleGoBack} />}
          {renderHeaderTitle()}
          {!!rightHeader && rightHeader}
          {accountSelectable && (
            <View2>
              <SelectAccountButton
                disabled={disableAccountButton}
                ignoredAccounts={ignoredAccounts}
                handleSelectedAccount={handleSelectedAccount}
              />
            </View2>
          )}
        </View2>
      </SafeAreaView>
    </HeaderContext.Provider>
  );
};

export default React.memo(Header);
