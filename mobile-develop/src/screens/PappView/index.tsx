import React, { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Text, ActivityIndicator } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { LoadingContainer, View } from '@src/components/core';
import { getBalance as getTokenBalance } from '@src/store/token/functions';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler, CustomError, ErrorCode } from '@src/services/exception';

import { SearchIcon } from '@src/components/Icons';
import { View2 } from '@components/core/View';
import styles, { containerStyle as styled } from './style';
import PappError from './PappError';
import PappView from './PappView';
import Header from '@src/components/Header/Header';
import { defaultAccount } from '@src/store/account/selectors';
import { followed } from '@src/store/token/selectors';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';
import { getBalance } from '@src/store/account/functions';
import SearchForm from '../Papps/SearchForm';
import SelectToken from '@src/components/HeaderRight/SelectToken';
import { useNavigationParam } from '@src/hooks';

const sourceSearchIcon = require('../../assets/images/icons/search_icon.png');

const searchFormRef = React.createRef();

const PappViewContainer = memo((props) => {
  const account =  useSelector(defaultAccount)
  const tokens = useSelector(followed)
  const selectPrivacyByTokenID = useSelector(getPrivacyDataByTokenID)
  // Convert state to hooks
  const [loading, setLoading] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState(null);
  const [supportTokenIds, setSupportTokenIds] = useState([CONSTANT_COMMONS.PRV_TOKEN_ID]);
  const [url, setUrl] = useState(useNavigationParam('url', ''));
  const [searchText, setSearchText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Refs instead of instance properties
  const webViewRef = useRef(null);
  const reloadBalanceTimeout = useRef(null);

  // Navigation options (static method in class)
  PappViewContainer.navigationOptions = ({ navigation }) => {
    const { onSelectToken, selectedPrivacy, supportTokenIds, onGo } =
      navigation.state.params || {};

    return {
      customHeader: (
        <SearchForm
          ref={searchFormRef}
          onGo={onGo}
          append={(
            <View style={styles.chooseTokenIcon}>
              <SelectToken
                onSelect={onSelectToken}
                selectedPrivacy={selectedPrivacy}
                supportTokenIds={supportTokenIds}
              />
            </View>
          )}
        />
      ),
    };
  };

  // Convert class methods to function hooks
  const onGo = ({ url }) => {
    setUrl(url);
  };

  const setHeaderData = (data = {}) => {
    navigation.setParams(data);
  };

  const getPrivacyToken = (tokenID: string) => {
    const privacy = selectPrivacyByTokenID(tokenID);
    if (privacy) {
      setSelectedPrivacy(privacy);
    }
    return privacy;
  };

  const reloadBalance = (tokenID, duration = 30 * 1000) => {
    // clear prev task
    if (reloadBalanceTimeout.current) {
      clearInterval(reloadBalanceTimeout.current);
    }

    reloadBalanceTimeout.current = setInterval(async () => {
      // account balance (PRV)
      if (tokenID === CONSTANT_COMMONS.PRV_TOKEN_ID) {
        await getBalance(account);
      } else if (tokenID) {
        const token = tokens?.find(t => t.id === tokenID);
        token && (await getTokenBalance(token));
      }
      getPrivacyToken(tokenID);
    }, duration);
  };

  const handleSelectPrivacyToken = (tokenID) => {
    try {
      if (typeof tokenID === 'string') {
        // New requirement: No need to check logic include in token privacy
        // UraNashel
        // if (!supportTokenIds.includes(tokenID)) {
        //   throw new CustomError(ErrorCode.papp_the_token_is_not_supported);
        // }
        const privacy = getPrivacyToken(tokenID);
        if (privacy) {
          reloadBalance(tokenID);
          setHeaderData({ selectedPrivacy: privacy });
        } else {
          throw new CustomError(ErrorCode.papp_the_token_is_not_supported);
        }
      } else {
        throw new Error('Please use an invalid token ID');
      }
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  };

  const handleSetListSupportTokenById = (tokenIds) => {
    if (tokenIds instanceof Array) {
      const ids = [CONSTANT_COMMONS.PRV_TOKEN_ID, ...tokenIds];
      setSupportTokenIds(ids);
      setHeaderData({ supportTokenIds: ids });
    } else {
      throw new Error('Please use a valid token id list.');
    }
  };

  // componentDidMount equivalent
  useEffect(() => {
    handleSelectPrivacyToken(CONSTANT_COMMONS.PRV_TOKEN_ID);
    setHeaderData({
      onSelectToken: handleSelectPrivacyToken,
      supportTokenIds,
      onGo,
    });
    
    // componentWillUnmount equivalent
    return () => {
      if (reloadBalanceTimeout.current) {
        clearInterval(reloadBalanceTimeout.current);
        reloadBalanceTimeout.current = undefined;
      }
    };
  }, []);

  // Render
  let isBlocked = navigation.getParam('url');
  let content = null;
  
  if (!url) {
    content = <Empty />;
  } else if (!selectedPrivacy) {
    content = <LoadingContainer />;
  } else {
    content = (
      <PappError>
        <PappView
          {...props}
          url={url}
          selectedPrivacy={selectedPrivacy}
          supportTokenIds={supportTokenIds}
          onSelectPrivacyToken={handleSelectPrivacyToken}
          onSetListSupportTokenById={handleSetListSupportTokenById}
          onChangeUrl={searchFormRef?.current?.setUrl}
        />
        {isSending && <LoadingTx />}
      </PappError>
    );
  }

  return (
    <View2 style={styled.container}>
      <Header
        placeHolder="Enter a pApp address"
        isNormalSearch
        canSearch={!isBlocked}
        title={url ? `${url}`: 'Enter a pApp address'}
        value={searchText}
        onSubmit={() => {
          let tempSearchText = searchText;
          if (tempSearchText.replace(' ', '') != '') {
            // Check if string is url
            let indexOfHttps = tempSearchText?.indexOf('https://');
            let indexOfHttp = tempSearchText?.indexOf('http://');
            if (indexOfHttp === -1 && indexOfHttps === -1) {
              // InCorrect
              tempSearchText = 'https://' + tempSearchText;
            }

            setUrl(tempSearchText);
          }
        }}
        onTextSearchChange={text => {
          setSearchText(text);
        }}
      />
      {content}
      {loading && <ActivityIndicator style={styles.loading} />}
    </View2>
  );
});

const Empty = React.memo(() => (
  <View style={styled.emptyContainer}>
    <SearchIcon source={sourceSearchIcon} style={styled.searchIcon} />
    <Text style={styled.desc}>
      {'Enter a URL to start exploring\napps built on Incognito.'}
    </Text>
  </View>
));


export default PappViewContainer;
