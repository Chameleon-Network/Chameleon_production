import {showWizardFetched} from '@src/store/getStarted';
import React from 'react';
import {WizardAnimation} from './components/WizardAnimation';

const Wizard = () => {
  return <WizardAnimation onAnimationFinish={showWizardFetched} />;
};

export default React.memo(Wizard);
