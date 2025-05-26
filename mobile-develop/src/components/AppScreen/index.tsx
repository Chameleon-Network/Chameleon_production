import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';
import { THEME } from '@src/styles';
import { useDispatch } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.header.backgroundColor,
  }
});

const AppScreen = ({ children }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getSettings());
  }, []);

  if (!children) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

AppScreen.propTypes = {
  children: PropTypes.any.isRequired
};

export default AppScreen;
