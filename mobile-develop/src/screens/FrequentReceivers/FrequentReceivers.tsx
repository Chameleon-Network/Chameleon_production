import React from 'react';
import {View, View2} from '@src/components/core/View';
import withListAllReceivers from './FrequentReceivers.enhance';
import Item from './FrequentReceivers.item';
import {styledModal as styled} from './FrequentReceivers.styled';
import {useNavigationParam} from '@src/hooks';
import Header from '@src/components/Header/Header';
import {ScrollViewBorder} from '@src/components/core/ScrollView';
import DropdownMenu from '@src/components/core/DropdownMenu';

interface IListReceiversProps {
  receivers: any[];
  isEmpty: boolean;
}

const ListReceivers = (props: IListReceiversProps) => {
  const {receivers} = props;
  const onSelectedItem = useNavigationParam(
    'onSelectedItem',
    (params: any) => {},
  );
  const disabledSwipe = useNavigationParam('disabledSwipe', false);
  const onSelectedAddress = async (receiver = {name: '', address: ''}) => {
    if (typeof onSelectedItem === 'function') {
      return onSelectedItem(receiver);
    }
  };
  return (
    <View>
      {receivers?.map((receiver, index) => (
        <DropdownMenu
          defaultToggle={index === 0}
          sections={[receiver]}
          renderItem={({item}) => {
            return (
              <Item
                {...{
                  ...item,
                  disabledSwipe,
                  keySave: receiver?.keySave,
                  onPress: () =>
                    onSelectedAddress({...item, keySave: receiver?.keySave}),
                }}
              />
            );
          }}
          key={index}
          customStyle={[{marginBottom: 30}]}
        />
      ))}
    </View>
  );
};

interface IListAllReceiversProps {
  receivers: any[];
  isEmpty: boolean;
}

const ListAllReceivers = (props: IListAllReceiversProps) => {
  const {receivers, isEmpty} = props;
  return (
    <View2 fullFlex>
      <Header
        title="Search by name or address"
        style={styled.header}
        canSearch
      />
      <ScrollViewBorder>
        <View fullFlex>
          <ListReceivers {...{receivers, isEmpty}} />
        </View>
      </ScrollViewBorder>
    </View2>
  );
};
export default withListAllReceivers(ListAllReceivers);
