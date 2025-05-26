import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { withTokenVerified } from '@src/components/Token';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';
import { ANALYTICS } from '@src/constants';
import { requestUpdateMetrics } from '@src/redux/actions/app';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { navigateToWhyShield } from '@src/router/NavigationServices';
import routeNames from '@src/router/routeNames';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { allTokens, isTokenSelectable } = props;
  const getPrivacyDataByTokenID = useDebounceSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );
  const availableTokens = React.useMemo(() => {
    return allTokens
      .map((token) => getPrivacyDataByTokenID(token?.tokenIdO))
      .filter((token) => token?.isDeposable);
  }, [allTokens.length]);
  const handleWhyShield = () => navigateToWhyShield();
  const handleShield = async (item) => {
    try {
      if (!isTokenSelectable(item?.tokenId)) {
        return;
      }
      setTimeout(() => {
        dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.SHIELD));
      }, 300);
      navigation.navigate(routeNames.ChooseNetworkForShield, {
        tokenSelected: item,
      });
    } catch (error) {
      console.debug('SHIELD ERROR', error);
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          availableTokens,
          handleWhyShield,
          handleShield,
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  allTokens: PropTypes.array.isRequired,
};
export default compose(
  withLayout_2,
  (Comp) => (props) => <Comp {...{ ...props, onlyPToken: true }} />,
  withTokenSelect,
  enhance,
  withTokenVerified,
);
