import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import moment from 'moment';

import en from './languages/en';

import {LanguageEnum} from './types';
import {getCurrentLanguage, globalStore} from '@src/store';

// ** ** ** ** ** USE ** ** ** ** **

// ** ** ** ** ** CREATE CONTEXT ** ** ** ** **
const DictionaryContext = createContext<typeof en>(en);

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useBaseDictionary` hook must be used within a `BaseDictionaryProvider` component',
    );
  }
  // const dictionary = useBaseDictionary()
  return context;
}

// ** ** ** ** ** GET ** ** ** ** **
export const getDictionary = (): typeof en => {
  const language: LanguageEnum = getCurrentLanguage();
  const tempLanguage: LanguageEnum = (globalStore?.store.getState() || {})[
    'language'
  ];
  const currentLanguage = tempLanguage || language || LanguageEnum.EN;

  const languageDictionaryMap = {
    [LanguageEnum.EN]: {...en},
  };
  return languageDictionaryMap[currentLanguage];
};

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function DictionaryProvider({children}: {children: ReactElement}) {
  const tempLanguage = globalStore?.store(state => state['language']);
  const currentLanguage = tempLanguage || LanguageEnum.EN;

  const languageDictionaryMap: any = useMemo(() => {
    return {
      [LanguageEnum.EN]: {...en},
    };
  }, []);

  const [dictionary, setDictionary] = useState<typeof en>(
    languageDictionaryMap[currentLanguage] ||
      languageDictionaryMap[LanguageEnum.EN],
  );

  useEffect(() => {
    setDictionary(languageDictionaryMap[currentLanguage]);
    if (currentLanguage === LanguageEnum.EN) {
      moment.locale('en');
    }
  }, [currentLanguage]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}
