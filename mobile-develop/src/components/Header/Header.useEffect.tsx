import React from 'react';
import {formValueSelector, reset} from 'redux-form';
import {useSelector, useDispatch} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import toLower from 'lodash/toLower';
import {trim} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import {searchBoxConfig} from './Header.searchBox';

export const useSearchBox = props => {
  const {data, handleFilter, shouldCleanSearch = true} = props;
  const initialState = {
    result: [],
  };
  const dispatch = useDispatch();
  const selector = formValueSelector(searchBoxConfig.form);
  const keySearch = trim(
    toLower(
      useSelector(state => selector(state, searchBoxConfig.searchBox)) || '',
    ),
  );
  const isKeyEmpty = isEmpty(keySearch);
  const [state, setState] = React.useState(initialState);
  const {result} = state;
  const handleFilterData = (data = null) => {
    if (!isEmpty(keySearch)) {
      return setState({...state, result: data ? data : handleFilter()});
    }
  };
  React.useEffect(() => {
    handleFilterData();
  }, [keySearch, data?.length]);

  useFocusEffect(
    React.useCallback(() => {
      if (shouldCleanSearch) {
        setState({...state, result: []});
        dispatch(reset(searchBoxConfig.form));
      }
    }, []),
  );

  return [isKeyEmpty ? data : result, keySearch, handleFilterData];
};