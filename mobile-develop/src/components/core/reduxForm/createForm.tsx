import React from 'react';
import {View} from 'react-native';
import {reduxForm} from 'redux-form';

interface FormProps {
  children: React.ReactNode;
  style?: any;
}

const Form = ({children, style, ...props}: FormProps) => (
  <View style={style}>
    {typeof children === 'function' ? children(props) : children}
  </View>
);

export const createForm = (formName, config = {}) => {
  return reduxForm({
    form: formName,
    ...config, // https://redux-form.com/6.6.3/docs/api/reduxform.md/
  })(Form);
};

/**
 *
const submit = values => console.log(values);

const SimpleForm = (props) => {
  return (
    <Form>
      {({ handleSubmit }) => {
        return (
          <>
            <Field name="firstName" component={inputField} />
            <Button title='Submit' onPress={handleSubmit(submit)} />
          </>
        );
      }}
    </Form>
  );
};
 */
