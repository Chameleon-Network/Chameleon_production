import React from 'react';
import {CONSTANT_COMMONS} from '@src/constants';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import EmptyHistory from './MainCryptoHistory.empty';
import HistoryList from '../HistoryList';
import {useHistoryEffect} from '../History';
import {HistoryListProps} from '../HistoryList/HistoryList';
import {historyTxsSelector} from '@src/store/history/selectors';

const filterResponseType = (h: any) => {
  if (!h?.metaData) {
    return true;
  }
  const metaData = JSON.parse(h?.metaData);
  const typeOf = metaData?.Type;
  // mint prv response types
  return !CONSTANT_COMMONS.RESPONSE_PRV_TYPES.includes(typeOf);
};

const MainCryptoHistory = (props: HistoryListProps) => {
  const {histories, isEmpty, loading, refreshing, oversize} =
    useDebounceSelector(historyTxsSelector);
  const {handleRefresh} = useHistoryEffect();
  const tempHistories = histories.filter(filterResponseType);
  return (
    <HistoryList
      {...props}
      histories={tempHistories}
      onRefreshHistoryList={handleRefresh}
      refreshing={refreshing}
      loading={loading}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={isEmpty}
      oversize={oversize}
    />
  );
};

export default React.memo(MainCryptoHistory);
