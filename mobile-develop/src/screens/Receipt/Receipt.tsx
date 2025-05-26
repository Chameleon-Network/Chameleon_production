import React from 'react';
import {TouchableOpacity, View, Text} from '@src/components/core';
import {Text4} from '@src/components/core/Text';
import linkingService from '@src/services/linking';
import IconOpenUrl from '@src/components/Icons/icon.openUrl';
import {styled} from './Receipt.styled';
import withReceipt from './Receipt.enhance';
import Header from '@src/components/Header/Header';

interface HookProps {
  label: string;
  desc: string;
  renderTx?: boolean;
}

const Hook = ({label, desc, renderTx = false}: HookProps) => {
  const handleOpenUrl = () => linkingService.openUrl(desc);
  let renderComponent = () => (
    <View style={styled.hook}>
      <Text4 style={styled.label} ellipsizeMode="middle" numberOfLines={1}>
        {`${label}:`}
      </Text4>
      <Text style={styled.desc} ellipsizeMode="middle" numberOfLines={1}>
        {desc}
      </Text>
      {renderTx && <IconOpenUrl />}
    </View>
  );
  if (renderTx) {
    return (
      <TouchableOpacity onPress={handleOpenUrl}>
        {renderComponent()}
      </TouchableOpacity>
    );
  }
  return renderComponent();
};

interface ReceiptModalProps {
  infoFactories: HookProps[];
  onBack: () => void;
  btnSaveReceiver: React.ReactNode;
  title: string;
}

const ReceiptModal = (props: ReceiptModalProps) => {
  const {infoFactories, onBack, btnSaveReceiver, title} = props;

  return (
    <>
      <Header onGoBack={onBack} />
      <View borderTop paddingHorizontal fullFlex>
        <Text style={styled.title}>{title}</Text>
        <View>
          {infoFactories.map((item, key) =>
            item.disabled ? null : <Hook key={key} {...item} />,
          )}
        </View>
        {btnSaveReceiver}
      </View>
    </>
  );
};

export default withReceipt(ReceiptModal);
