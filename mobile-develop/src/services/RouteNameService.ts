import {createRef} from 'react';

const routeNameRef = createRef<string>();

export const setCurrentRouteName = (routerName: string) => {
  //@ts-ignore
  routeNameRef.current = routerName;
};

export const getCurrentRouteName = () => {
  return routeNameRef.current;
};
