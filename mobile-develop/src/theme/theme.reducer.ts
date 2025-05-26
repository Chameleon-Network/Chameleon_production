import { THEME_KEYS } from '@src/theme/theme.consts';

const initialState = {
  themeMode: THEME_KEYS.DARK_THEME
};

const themeReducer = (state = initialState, action: any) => {
  switch (action.type) {
  default:
    return state;
  }
};

export default themeReducer;
