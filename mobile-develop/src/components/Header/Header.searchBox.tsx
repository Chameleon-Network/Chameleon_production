import {CloseIcon} from '@components/Icons';
import {screenWidth} from '@src/styles';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput} from '../core';
import {createForm} from '@components/core/reduxForm';
import {Field} from 'redux-form';
import {Row} from '../Row';
import { BaseTextInputCustom } from '../core/BaseTextInput';

const styled = StyleSheet.create({
  searchBox: {
    flex: 1,
  },
  searchBoxNormal: {
    marginRight: 20,
    width: screenWidth * 0.62,
    height: 30,
  },
});
export const searchBoxConfig = {
  form: 'searchFormHeader',
  searchBox: 'search',
};
const Form = createForm(searchBoxConfig.form);
const SearchBox = props => {
  const {isNormalSearch, customSearchBox, style, inputStyle} = props;
  if (isNormalSearch) {
    return (
      <TextInput
        style={styled.searchBoxNormal}
        containerInputStyle={styled.searchBoxNormal}
        onChangeText={props?.onChange}
        onBlur={props?.onSubmit}
        autoFocus
        placeholder={props?.placeHolder || ''}
        onSubmitEditting={props?.onSubmit}
      />
    );
  }
  return (
    <Form style={styled.searchBox}>
      <Field
        name={searchBoxConfig.searchBox}
        component={componentProps => {
          const {input, ...rest} = componentProps;
          if (customSearchBox) {
            return (
              <BaseTextInputCustom
                onBlur={input?.onBlur}
                onFocus={input?.onFocus}
                value={input?.value}
                autoFocus
                placeholder={props?.title || ''}
                inputProps={{
                  onChangeText: input?.onChange,
                  placeholder: 'Search privacy coins',
                  autFocus: true,
                }}
                maskLabel
                style={style}
                {...rest}
              />
            );
          }
          return (
            <Row centerVertical>
              <TextInput
                onChangeText={input?.onChange}
                onBlur={input?.onBlur}
                onFocus={input?.onFocus}
                value={input?.value}
                autoFocus
                style={inputStyle}
                placeholder={props?.title || ''}
                {...rest}
              />
              {!!input?.value && (
                <TouchableOpacity
                  style={{paddingLeft: 12}}
                  onPress={() => input?.onChange && input?.onChange('')}>
                  <CloseIcon />
                </TouchableOpacity>
              )}
            </Row>
          );
        }}
      />
    </Form>
  );
};

export default React.memo(SearchBox);
