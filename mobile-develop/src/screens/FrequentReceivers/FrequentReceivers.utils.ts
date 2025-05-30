import {includes} from 'lodash';

const RECENTLY_MAX = 3;
const MIN_RECEIVER_TO_REACH_RECENTLY = 5;

export const isFieldExist = (
  field = '',
  value = '',
  message = '',
  receivers = [],
) => {
  const isExist = receivers.some(item => item[field] === value);
  if (isExist) {
    return {
      error: true,
      message,
    };
  }
  return {
    error: false,
    message: '',
  };
};

export const getRecently = (receivers: any[] = []) =>
  receivers.length >= MIN_RECEIVER_TO_REACH_RECENTLY
    ? receivers
        .filter(receiver => !!receiver?.recently)
        .sort((a, b) => b.recently - a.recently)
        .slice(0, RECENTLY_MAX)
    : [];

export const filterAddressByKey = (receivers: any[] = [], keySearch = '') =>
  receivers?.filter(
    item =>
      includes(item?.name.toLowerCase(), keySearch) ||
      includes(item?.address.toLowerCase(), keySearch),
  );
