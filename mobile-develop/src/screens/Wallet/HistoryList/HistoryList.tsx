import {
  LoadingContainer,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { IconReward } from '@src/components/Icons';
import { TOKEN } from '@src/constants/elements';
import { navigateToTxHistoryDetail } from '@src/router/NavigationServices';
import { actionSetSelectedTx } from '@src/store/history/functions';
import globalStyled from '@src/theme/theme.styled';
import { generateTestId } from '@utils/misc';
import { debounce, isEmpty } from 'lodash';
import trim from 'lodash/trim';
import React from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'styled-components/native';
import styleSheet from './History.styled';

interface HistoryItemWrapperProps {
  history: any;
  onCancelEtaHistory: (history: any) => void;
  otherProps?: any;
}

const HistoryItemWrapper = ({
  history,
  onCancelEtaHistory,
  ...otherProps
}: HistoryItemWrapperProps) =>
  React.useMemo(() => {
    const component = <HistoryItem history={history} {...otherProps} />;
    if (history?.cancelable) {
      return <></>;
      // TODO: CHANGE SWIPEOUT LATER
      // return (
      //   <Swipeout
      //     autoClose
      //     sensitivity={1000}
      //     style={{
      //       backgroundColor: 'transparent',
      //     }}
      //     right={[
      //       {
      //         text: 'Remove',
      //         backgroundColor: COLORS.red,
      //         onPress: () => onCancelEtaHistory(history),
      //       },
      //     ]}
      //   >
      //     {component}
      //   </Swipeout>
      // );
    }
    return component;
  }, [history]);

const NormalText = React.memo(
  ({
    style,
    text,
    testId,
    ...rest
  }: {
    style: any;
    text: string;
    testId: string;
    rest?: any;
  }) => (
    <Text
      numberOfLines={1}
      style={[styleSheet.text, style]}
      ellipsizeMode="tail"
      {...generateTestId(testId)}
      {...rest}>
      {trim(text)}
    </Text>
  ),
);

const HistoryItem = React.memo(({history}: {history: any}) => {
  const {
    amountStr,
    txTypeStr,
    timeStr,
    statusStr,
    statusColor,
    rewardAmountStr,
  } = history;
  const theme = useTheme();
  if (!history) {
    return null;
  }
  const onPress = () => {
    actionSetSelectedTx(history);
    navigateToTxHistoryDetail();
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styleSheet.itemContainer,
        globalStyled.defaultPaddingHorizontal,
        {borderBottomColor: theme.border4, borderBottomWidth: 1},
      ]}>
      <View style={[styleSheet.row]}>
        <NormalText
          text={txTypeStr}
          style={[styleSheet.title, {maxWidth: 250}]}
          testId={TOKEN.TRANSACTION_TYPE}
        />
        <View style={styleSheet.amountContainer}>
          {!isEmpty(rewardAmountStr) && (
            <View style={styleSheet.rewardAmountContainer}>
              <Text style={styleSheet.rewardAmountText}>+</Text>
              <IconReward />
            </View>
          )}
          <NormalText
            text={amountStr}
            style={styleSheet.title}
            testId={TOKEN.TRANSACTION_CONTENT}
          />
        </View>
      </View>
      <View style={styleSheet.row}>
        <NormalText
          style={styleSheet.desc}
          text={timeStr}
          testId={TOKEN.TRANSACTION_TIME}
        />
        <NormalText
          style={[styleSheet.desc, !!statusColor && {color: statusColor}]}
          text={statusStr}
          testId={TOKEN.TRANSACTION_STATUS}
        />
      </View>
    </TouchableOpacity>
  );
});

export interface HistoryListProps {
  histories?: any[];
  onCancelEtaHistory?: (history: any) => void;
  onRefreshHistoryList?: () => void;
  onLoadmoreHistory?: () => void;
  refreshing?: boolean;
  oversize?: boolean;
  renderEmpty?: () =>
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  showEmpty?: boolean;
  loading?: boolean;
  page?: number;
}

const HistoryList = (props: HistoryListProps) => {
  const {
    histories = [],
    showEmpty,
    renderEmpty,
    refreshing,
    onRefreshHistoryList,
    onLoadmoreHistory,
    onCancelEtaHistory,
    loading,
    page = 1000,
  } = props;
  const initing = loading && histories.length === 0;
  if (initing) {
    return (
      <LoadingContainer
        containerStyled={{
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      />
    );
  }

  const renderItem = React.useCallback(
    ({item: history}: {item: any}) => {
      return <HistoryItemWrapper {...{history, onCancelEtaHistory}} />;
    },
    [onCancelEtaHistory],
  );
  const getItemLayout = React.useCallback(
    (data: any, index: number) => ({length: 74, offset: 74 * index, index}),
    [],
  );

  const onEndReached = React.useCallback(
    () => typeof onLoadmoreHistory === 'function' && onLoadmoreHistory(),
    [onLoadmoreHistory],
  );

  const _onEndReached = debounce(onEndReached, 1000);
  const historyDisplay = React.useMemo(() => {
    return histories.slice(0, page);
  }, [page, histories.length, histories]);

  const renderKey = React.useCallback(
    (item: any) => item?.txId || item?.id,
    [],
  );
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing && !initing}
          onRefresh={() =>
            typeof onRefreshHistoryList === 'function' && onRefreshHistoryList()
          }
        />
      }
      data={historyDisplay}
      renderItem={renderItem}
      keyExtractor={renderKey}
      onEndReachedThreshold={0.7}
      onEndReached={_onEndReached}
      getItemLayout={getItemLayout}
      ListFooterComponent={<View style={{marginBottom: 30}} />}
      ListEmptyComponent={
        showEmpty && typeof renderEmpty === 'function'
          ? renderEmpty()
          : undefined
      }
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};

export default React.memo(HistoryList);
