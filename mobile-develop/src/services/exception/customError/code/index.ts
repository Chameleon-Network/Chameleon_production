import apiCode from './apiCode';
import knownCode from './knownCode';
import webjsCode from './webjsCode';

export const ErrorCode = {
  ...knownCode,
  ...apiCode,
  ...webjsCode
};