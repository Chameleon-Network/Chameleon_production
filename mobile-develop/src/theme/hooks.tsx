/**
 * Use below hooks for personalized theme colors (Will be added later)
 */

import {DefaultTheme} from 'styled-components';

export enum ColorPalette {
  COLOR_1 = '#267cde',
  COLOR_2 = '#7c32a1',
  COLOR_3 = '#11bdbf',
  COLOR_4 = '#4CAF50',
  COLOR_5 = '#5969c5',
  COLOR_6 = '#FFC107',
  COLOR_7 = '#FF6F22',
  COLOR_8 = '#CF5555',
  COLOR_9 = '#ee59ba',

  GREY_1 = '#000000',
  GREY_2 = '#333333',
  GREY_3 = '#666666',
  GREY_4 = '#999999',
  GREY_5 = '#cccccc',
  GREY_6 = '#ffffff',

  GREEN = '#4CAF50',
  RED = '#CF5555',
}

const white = '#FFFFFF';
const black = '#000000';

const lightTheme: DefaultTheme = {
  name: 'light',
  background1: white,
  background2: '#F2F4F5',
  background3: '#ECECEC',
  background4: black,
  background5: white,
  background6: '#404040', // blue - gray
  background7: '#F4F4F4',
  background8: '#ECECEC', // red - gray
  background9: '#333335',
  background10: white,
  background11: '#9C9C9C',

  // text
  text1: black,
  text2: '#9e9e9e',
  text3: '#C0C0C0',
  // todo: review
  text4: '#8A8A8E',
  text5: '#A6A6A6',
  text6: '#858383',
  text7: black,
  text8: '#D6D6D6',
  text9: '#8A8A8E',
  text10: '#9C9C9C',
  text11: '#757575',
  text12: '#9C9C9C',

  // button
  btnBG1: '#1A73E8',
  btnBG2: white,
  btnBG3: '#F9F9F9',

  // border
  border1: '#F7F7F7',
  border2: black,
  border3: '#D6D6D6',
  border4: '#F2F4F5',

  contrast: black,

  // icon
  icon1: '#1A73E8', // green - blue

  arrowRightIcon: black,

  // image
  image1: black,

  // border
  borderBaseTextInputColor: black,

  // colors
  against: '#000000',
  primary: '#FFFFFF',
  secondary: '#757575',
  grey1: '#9C9C9C',
  grey2: '#C0C0C0',
  grey3: '#DDDDDD',
  grey4: '#F5F5F5',
  grey7: '#404040',
  grey8: '#363636',
  grey9: '#303030',
  grey10: '#484848',
  ctaMain: '#1A73E8',
  ctaMain01: 'rgba(26, 115, 232, 0.1)',
  black1: '#191919',
  // text
  mainText: black,
  subText: '#858383',

  // button
  borderBtnColor: black,
  borderBtnSecondary: '#1A73E8',

  blue1: '#6BA0FB',
};

const darkTheme: DefaultTheme = {
  name: 'dark',
  background1: '#303030',
  background2: '#1A1A1A',
  background3: '#404040',
  background4: white,
  background5: '#404040',
  background6: '#1A73E8', // blue - gray
  background7: '#404040',
  background8: '#F6465D', // red - gray
  background9: '#404040',
  background10: black,
  background11: '#303030',

  // text
  text1: white,
  text2: '#000000',
  text3: '#9C9C9C',
  // todo: review
  text4: '#9C9C9C',
  text5: '#9C9C9C',
  text6: '#9C9C9C',
  text7: '#64A121',
  text8: white,
  text9: white,
  text10: '#757575',
  text11: '#757575',
  text12: '#9C9C9C',

  // button
  btnBG1: '#1A73E8',
  btnBG2: '#404040',
  btnBG3: '#404040',

  // border
  border1: '#484848',
  border2: white,
  border3: '#484848',
  border4: '#363636',

  contrast: white,

  // icon
  icon1: '#1A73E8', // green - blue

  arrowRightIcon: '#9C9C9C',

  // image
  image1: white,

  // border
  borderBaseTextInputColor: white,

  // colors
  against: '#FFFFFF',
  primary: '#000000',
  secondary: '#757575',
  grey1: '#9C9C9C',
  grey2: '#C0C0C0',
  grey3: '#DDDDDD',
  grey4: '#F5F5F5',
  grey7: '#404040',
  grey8: '#363636',
  grey9: '#303030',
  grey10: '#484848',
  ctaMain: '#1A73E8',
  ctaMain01: 'rgba(26, 115, 232, 0.1)',
  black1: '#191919',
  // text
  mainText: white,
  subText: '#858383',

  // button
  borderBtnColor: white,
  borderBtnSecondary: white,

  blue1: '#6BA0FB',
};

export const getColorByCode = (code: string) => {
  return ColorPalette['COLOR_' + code];
};

export const useLightTheme = (): DefaultTheme => {
  return {
    ...lightTheme,
  };
};

export const useDarkTheme = (): DefaultTheme => {
  return {
    ...darkTheme,
  };
};
