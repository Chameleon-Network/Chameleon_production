import React, {useCallback} from 'react';
import { FlatList } from 'react-native';

const ListToken = (props) => {
  const { data, visible, styledListToken, renderItem } = props;
  if (!visible || data.length === 0) {
    return null;
  }

  const keyExtractor = useCallback((item) => item?.tokenId?.toString(), []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={[{ flex: 1 }, styledListToken]}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews
    />
  );
};

export default ListToken;
