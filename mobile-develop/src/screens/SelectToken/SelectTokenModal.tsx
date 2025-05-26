import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { change } from 'redux-form';
import { ListAllTokenSelectable } from './SelectToken';
import { useNavigationParam } from '@src/hooks';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/utils/token';
import Header from '@src/components/Header/Header';
import { goBack } from '@src/router/NavigationServices';
import { actionResetData } from '@src/store/pdexV3/swap/functions';
import { formConfigs } from '@src/store/pdexV3/swap/constants';
import { delay } from '@src/utils';
import withLazy from '@src/components/LazyHoc/withLazy';
import TokenTrade from '@src/components/Token/TokenTrade';

const styled = StyleSheet.create({
  container: { flex: 1 },
  extra: {
    marginTop: 16,
    flex: 1,
  },
  styledContainer: {
    paddingTop: 24,
  },
  checkBox: {
    marginLeft: 24,
  },
});

const SelectTokenModal = () => {
  const data = useNavigationParam('data');
  const onPress = useNavigationParam('onPress');
  const dispatch = useDispatch();
  const [availableTokens, keySearch] = useSearchBox({
    data,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({ tokens: data, keySearch }),
  });
  if (!data) {
    return null;
  }
  return (
    <View style={styled.container}>
      <Header title="Select coins" style={styled.header} canSearch />
      <View style={styled.extra}>
        <ListAllTokenSelectable
          styledCheckBox={styled.checkBox}
          availableTokens={availableTokens}
          renderItem={({ item }) => (
            <TokenTrade
              onPress={async () => {
                goBack();
                actionResetData()
                dispatch(
                  change(formConfigs.formName, formConfigs.feetoken, ''),
                );
                await delay(0);
                if (typeof onPress === 'function') {
                  onPress(item);
                }
              }}
              tokenId={item?.tokenId}
            />
          )}
          styledContainer={styled.styledContainer}
        />
      </View>
    </View>
  );
};

export default withLazy(React.memo(SelectTokenModal));
