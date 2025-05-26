import {useSelector} from '@src/store/getStore';
import {
  ROOT_TAB_TRADE,
  TAB_LIMIT_ID,
  TAB_SWAP_ID,
} from '@src/store/pdexV3/trade/constant';
import {activedTabSelector} from '@src/store/tabs/selectors';
import React from 'react';
import SwapOrderHistory from '../Swap/Swap.orderHistory';
import {OrderLimitHistory} from '../OrderLimit';

const OrderHistory = () => {
  const activedTab = useSelector(activedTabSelector)(ROOT_TAB_TRADE);
  switch (activedTab) {
    case TAB_SWAP_ID: {
      return <SwapOrderHistory />;
    }
    case TAB_LIMIT_ID: {
      return <OrderLimitHistory />;
    }
    default:
      break;
  }
  return null;
};

export default React.memo(OrderHistory);
