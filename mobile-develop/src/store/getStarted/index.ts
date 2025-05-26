import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {CONSTANT_KEYS} from '@src/constants';
import {settingSlice} from '../setting';

const initialState = {
  showWizard: {
    isFetching: true,
    isFetched: false,
  },
  followDefaultPTokens: {
    [CONSTANT_KEYS.IS_FOLLOW_DEFAULT_PTOKENS]: false,
  },
  isFollowedDefaultPTokens: false,
  detectNetworkName: {
    [CONSTANT_KEYS.DETECT_NETWORK_NAME]: false,
  },
};

export const getStartedSlice = createSlice({
  name: 'getStarted', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    showWizardFetching: state => ({
      ...state,
      showWizard: {
        ...state.showWizard,
        isFetching: true,
      },
    }),
    showWizardFetched: state => {
      return {
        ...state,
        showWizard: {
          ...state.showWizard,
          isFetching: false,
          isFetched: true,
        },
      };
    },
    toggleShowWizard: (state, action) => {
      const {isFetched} = action.payload;

      return {
        ...state,
        showWizard: {
          ...state?.showWizard,
          isFetched,
          isFetching: isFetched ? false : true,
        },
      };
    },
    toggleFollowDefaultPTokens: (state, action) => {
      const {keySave} = action.payload;
      return {
        ...state,
        followDefaultPTokens: {
          ...state.followDefaultPTokens,
          [keySave]: true,
        },
      };
    },
    toggleDetectNetworkName: (state, action) => {
      const {keySave} = action.payload;
      return {
        ...state,
        detectNetworkName: {
          ...state.detectNetworkName,
          [keySave]: true,
        },
      };
    },
  },
});

export const showWizardFetching = () => {
  StoreService?.current?.dispatch(getStartedSlice.actions.showWizardFetching());
};

export const showWizardFetched = () => {
  StoreService?.current?.dispatch(getStartedSlice.actions.showWizardFetched());
};

export const toggleShowWizard = (isFetched: boolean) => {
  StoreService?.current?.dispatch(
    getStartedSlice.actions.toggleShowWizard({isFetched}),
  );
};

export const toggleFollowDefaultPTokens = (keySave: string) => {
  StoreService?.current?.dispatch(
    getStartedSlice.actions.toggleFollowDefaultPTokens({keySave}),
  );
};

export const toggleDetectNetworkName = (keySave: string) => {
  StoreService?.current?.dispatch(
    getStartedSlice.actions.toggleDetectNetworkName({keySave}),
  );
};
