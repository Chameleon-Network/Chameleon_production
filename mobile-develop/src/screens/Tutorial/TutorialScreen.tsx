import { View2 } from '@src/components/core';
import ScrollView from '@src/components/core/ScrollView/Component';
import Header from '@src/components/Header/Header';
import { goBack, navigateToGetStarted } from '@src/router/NavigationServices';
import { useSelector } from '@src/store/getStore';
import { setNewUserTutorial } from '@src/store/settings';
import {
  newUserTutorialSelector,
  videosSelector,
} from '@src/store/settings/selectors';
import globalStyled from '@src/theme/theme.styled';
import React, { memo, useCallback, useState } from 'react';
import { Video } from './components/Video';

const TutorialScreen = memo(() => {
  const videos = useSelector(videosSelector);
  const isNewUser = useSelector(newUserTutorialSelector);

  //TODO: FIX HERE WHY isNewUser don't set to true in WelcomeScreen
  console.log('isNewUser', isNewUser);

  const [displayIndex, setDisplayIndex] = useState(0);

  const onPressExpand = useCallback((index: number) => setDisplayIndex(index), []);

  const renderVideo = React.useCallback(
    (item: any, index: number) => (
      <Video
        key={item.video}
        {...item}
        index={index}
        displayIndex={displayIndex}
        onPressExpand={onPressExpand}
      />
    ),
    [displayIndex, onPressExpand],
  );

  const onGoBack = useCallback(() => {
    if (!isNewUser) {
      goBack();
    } else {
      setNewUserTutorial(false);
      navigateToGetStarted();
    }
  }, [isNewUser]);

  return (
    <View2 fullFlex>
      <Header title="Tutorial" onGoBack={onGoBack} />
      <ScrollView
        style={[globalStyled.defaultBorderSection, {paddingHorizontal: 0}]}>
        {(videos || []).map(renderVideo)}
      </ScrollView>
    </View2>
  );
});

export default TutorialScreen;
