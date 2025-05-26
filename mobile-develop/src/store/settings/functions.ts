import {getFunctionConfigs} from '@src/services/api/misc';
import {getSettings as getSettingsAPI} from '@src/services/api/settings';
import {setVideoTutorial, syncSettings} from '.';

export const getSettings = async () => {
  const settings = await getSettingsAPI();
  if (settings) {
    syncSettings(settings);
  }
};

export const getVideoTutorial = async () => {
  try {
    const configs = (await getFunctionConfigs()) || {};
    const videos = configs.find(item => item.name === 'video_tutorial');
    if (videos) {
      const tutorial = JSON.parse(videos.message) || [];
      if (tutorial) {
        setVideoTutorial(tutorial);
      }
    }
  } catch (e) {
    console.log('getVideoTutorial errors: ', e);
  }
};
