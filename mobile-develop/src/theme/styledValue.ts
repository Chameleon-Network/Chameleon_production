import {DefaultTheme} from 'styled-components';
import _ from 'lodash';

export const styledValue: DefaultTheme = new Proxy(
  {},
  {
    get(target, p: PropertyKey): any {
      return (props: any) => {
        return props.theme?.[p];
      };
    },
  },
);

// example: styled.View`backgroundColor: ${getStyledValue('primaryColor')};`
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getStyledValue = (key: string) => (props: any) =>
  _(props).at(`theme.${key}`).first();
