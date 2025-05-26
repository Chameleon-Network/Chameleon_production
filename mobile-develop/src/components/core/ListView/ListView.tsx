import React from 'react';
import { RefreshControl } from 'react-native';
import BigList from 'react-native-big-list';

interface IListViewProps {
  data: any[];
  visible: boolean;
  renderItem: (item: any) => React.ReactElement;
  onRefresh: () => void;
  isRefreshing: boolean;
  styledListToken?: any;
}

const ListView = React.memo((props: IListViewProps) => {
  const { data = [], visible, renderItem, onRefresh, isRefreshing } = props;
  if (!visible || data.length === 0) {
    return null;
  }

  return (
    <BigList
      data={data}
      refreshControl={
        <RefreshControl
          tintColor="white"
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
      renderItem={renderItem}
      itemHeight={75}
      showsVerticalScrollIndicator={false}
      renderFooter={<></>}
      renderHeader={<></>}
    />
  );
});

export default ListView;
