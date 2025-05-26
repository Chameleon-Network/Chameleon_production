import {createSelector} from 'reselect';
import { RootState } from '../getStore';

export const getStartedSelector = (state: RootState) => state.getStarted

export const wizardSelector = createSelector(
  getStartedSelector,
  getStarted => getStarted?.showWizard,
);

export const isFollowDefaultPTokensSelector = createSelector(
  getStartedSelector,
  getStarted => keySave => getStarted?.followDefaultPTokens[keySave] || false,
);

export const isFollowedDefaultPTokensSelector = createSelector(
  getStartedSelector,
  getStarted => !!getStarted?.isFollowedDefaultPTokens,
);

export const detectNetworkNameSelector = createSelector(
  getStartedSelector,
  getStarted => getStarted?.detectNetworkName,
);
