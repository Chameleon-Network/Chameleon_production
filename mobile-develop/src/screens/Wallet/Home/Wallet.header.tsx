import { NotificationIcon, QRCodeIcon } from '@components/Icons';
import React, { memo } from 'react';
import { headerStyled, homeStyled } from './Wallet.styled';


import { View } from '@components/core';
import SelectAccountButton from '@components/SelectAccountButton';
import { Row } from '@src/components/Row';
import { navigateToNews } from '@src/router/NavigationServices';
import AddressModal from '@src/screens/Home/Home.qrCode';
import { actionToggleModal } from '@src/store/modal/functions';
import { newsSelector } from '@src/store/news/selectors';
import { useSelector } from '@src/store/getStore';

const Notification = React.memo(() => {
  const { isReadAll } = useSelector(newsSelector);
  const handleNavNotification = () => navigateToNews({ 'lastNewsID': isReadAll });
  return (
    <View>
      <NotificationIcon style={headerStyled.icon} onPress={handleNavNotification} />
      {isReadAll !== 0 && (
        <View style={homeStyled.notify} />
      )}
    </View>
  );
});

const Header = () => {
  const onShowAddress = React.useCallback(() => {
    actionToggleModal({
      data: (<AddressModal />),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    });
  }, []);
  return (
    <Row style={headerStyled.container} centerVertical spaceBetween>
      <Row centerVertical>
        <QRCodeIcon
          style={headerStyled.icon}
          onPress={onShowAddress}
        />
        <Notification />
      </Row>
      <SelectAccountButton />
    </Row>
  );
};

export default memo(Header);

