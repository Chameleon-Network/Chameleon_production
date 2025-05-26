import { Text, TouchableOpacity } from '@components/core';
import ButtonTyni from '@src/components/Button/ButtonTyni';
import { Row } from '@src/components/Row';
import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

const styles = StyleSheet.create({
  container: {},
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 25,
  },
  headerTitle: {
    ...FONTS.TEXT.incognitoH5,
  },
  headerSub: {
    ...FONTS.TEXT.incognitoP2,
  },
  groupActions: {
    marginVertical: 16,
    backgroundColor: 'transparent',
  },
  desc: {
    ...FONTS.TEXT.incognitoP1,
  },
  headerHook: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
});

const CustomTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.background3};
  padding: 24px;
  border-radius: 10px;
`;

interface IPrivacyAppItemProps {
  privacyAppId: string;
  icon: React.ReactNode;
  headerTitle: string;
  headerSub: string;
  groupActions: { id: string; title: string }[];
  desc: string;
  onPressItem: (privacyAppId: string) => void;
}

const PrivacyAppItem = (props: IPrivacyAppItemProps) => {
  const {
    privacyAppId,
    icon,
    headerTitle,
    headerSub,
    groupActions,
    desc,
    onPressItem,
  } = props;
  const theme = useTheme();
  return (
    <CustomTouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(privacyAppId)}
    >
      <Row style={styles.header}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.headerHook}>
          <Text style={[styles.headerTitle]}>{headerTitle}</Text>
          <Text style={[styles.headerSub, { color: theme.subText }]}>
            {headerSub}
          </Text>
        </View>
      </Row>
      <Row style={styles.groupActions}>
        {groupActions?.map(({ id, ...rest }, index) => (
          <ButtonTyni
            key={id}
            {...rest}
            style={index !== 0 ? { marginLeft: 8 } : {}}
          />
        ))}
      </Row>
      <Text style={styles.desc}>{desc}</Text>
    </CustomTouchableOpacity>
  );
};



export default React.memo(PrivacyAppItem);
