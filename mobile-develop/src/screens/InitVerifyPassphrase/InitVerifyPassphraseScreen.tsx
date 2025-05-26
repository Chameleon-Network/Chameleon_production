import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import { Text, TouchableOpacity, View } from '@components/core';
import { COLORS, FONTS, THEME } from '@src/styles';
import { CustomError, ErrorCode } from '@services/exception';
import { useTheme } from 'styled-components/native';
import MainLayout from '@src/components/MainLayout';
import Button from '../InitMasterKey/components/Button';
import { actionLoadInitial, createMasterKey, initMasterKey } from '@src/store/masterKey/functions';
import { navigateToMasterKeys, navigateToTutorial } from '@src/router/NavigationServices';

const styles = StyleSheet.create({
  desc: {
    ...THEME.text.mediumText,
    lineHeight: 24,
  },
  words: {
    marginTop: 50,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  word: {
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  wordStyle: {
    fontFamily: FONTS.NAME.medium,
  },
  selectedText: {
    color: COLORS.white,
  },
  userWords: {
    marginTop: 20,
  },
  error: {
    ...FONTS.STYLE.medium,
    marginTop: 10,
    fontSize: 14,
    color: COLORS.orange,
  },
});

const InitVerifyPassphraseScreen = ({ route }) => {
  const data = route.params?.data;
  const [wordsIndex, setWordsIndex] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const theme = useTheme();

  const displayWords = useMemo(() => {
    if (data) {
      const words = data.mnemonic.split(' ');
      return _.shuffle(words);
    }
    return data;
  }, [data]);

  const userWords = useMemo(
    () => wordsIndex.map((index) => displayWords[index]).join(' '),
    [wordsIndex],
  );

  const validateWords = () => {
    if (userWords !== data.mnemonic) {
      throw new CustomError(ErrorCode.invalid_mnemonic);
    }
  };

  const handleNext = async () => {
    try {
      if (!__DEV__) {
        validateWords();
      }

      setCreating(true);
      handleCreate(data);
    } catch (e: any) {
      setError(e?.message || '');
      setCreating(false);
    }
  };

  const handleCreate = useCallback(
    _.debounce(async (data) => {
      try {
        if (data.isInit) {
          // TODO: REMOVE THIS
          if (!__DEV__) {
            await initMasterKey(data.name, data.mnemonic);
            await actionLoadInitial()
          }
          // Todo
          navigateToTutorial();
        } else {
          await createMasterKey(data);
          // await dispatch(createMasterKey(data));
          navigateToMasterKeys();
        }
      } catch (e: any) {
        setError(e?.message || '');
      } finally {
        setCreating(false);
      }
    }, 1000),
    [],
  );

  const handleToggleWord = (index: any) => {
    let newWordsIndex;
    if (wordsIndex.includes(index)) {
      newWordsIndex = _.remove(wordsIndex, (item) => item !== index);
    } else {
      newWordsIndex = [...wordsIndex, index];
    }
    setWordsIndex(newWordsIndex);
  };

  useEffect(() => {
    setError('');
  }, [userWords]);

  return (
    <MainLayout header="Verify phrase" scrollable>
      <Text style={styles.desc}>Tap on these words in the correct order.</Text>
      <View style={styles.words}>
        {displayWords.map((word: any, index: number) => (
          <TouchableOpacity
            key={`${word}-${index}`}
            style={[styles.word, wordsIndex.includes(index) && { backgroundColor: theme.background9 }, { borderColor: theme.border3 }]}
            onPress={() => handleToggleWord(index)}
          >
            <Text
              key={word}
              style={[
                wordsIndex.includes(index) && styles.selectedText,
                styles.wordStyle,
              ]}
            >
              {word}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.desc, styles.userWords]}>{userWords}</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button
        label={creating ? 'Creating...' : 'Create master key'}
        onPress={handleNext}
      />
    </MainLayout>
  );
};

export default InitVerifyPassphraseScreen;
