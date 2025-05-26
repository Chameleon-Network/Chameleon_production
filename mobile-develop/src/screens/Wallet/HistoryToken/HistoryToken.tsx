import React from 'react';

import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import EmptyHistory from './HistoryToken.empty';
import {useHistoryEffect} from '../History/History.useEffect';
import HistoryList from '../HistoryList';
import {HistoryListProps} from '../HistoryList/HistoryList';
import {historyTxsSelector} from '@src/store/history/selectors';

const HistoryToken = (props: HistoryListProps) => {
  const {histories, isEmpty, loading, refreshing, oversize} =
    useDebounceSelector(historyTxsSelector);
  const {handleRefresh, handleCancelEtaHistory} = useHistoryEffect();
  return (
    <HistoryList
      {...props}
      histories={histories}
      onCancelEtaHistory={handleCancelEtaHistory}
      onRefreshHistoryList={handleRefresh}
      refreshing={refreshing}
      loading={loading}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={isEmpty}
      oversize={oversize}
    />
  );
};

export default React.memo(HistoryToken);
