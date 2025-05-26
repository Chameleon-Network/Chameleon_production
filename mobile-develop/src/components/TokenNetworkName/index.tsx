import React from 'react';
import { Text } from '@components/core';
import styles from './style';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';
import { useSelector } from '@src/store/getStore';

const TokenNetworkName = ({ id }: { id: string }) => {
  const data = useSelector(state => getPrivacyDataByTokenID(state)(id));

  return (
    <Text style={styles.networkName}>{data.networkName}</Text>
  );
};

export default TokenNetworkName;
