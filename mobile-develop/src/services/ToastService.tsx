import React from 'react';
import Toast from 'react-native-root-toast';
import SimpleToast from 'react-native-simple-toast';
import {Keyboard} from 'react-native';

export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

export const ErrorCodeMap: Record<string, string> = {};
export class ToastServiceClass {
  _getRealMessage = (message: string): string => {
    // @ts-ignore
    if (ErrorCodeMap[message]) {
      // @ts-ignore
      return ErrorCodeMap[message];
    }
    // if (Number.isNaN(parseInt(message))) {
    //  return message;
    // }
    return message;
  };

  show = (
    message: any,
    keyboardAvoid: boolean = false,
    atRoot: boolean = true,
  ) => {
    if (typeof message !== 'string') return;
    Keyboard.dismiss();
    return Toast.show(this._getRealMessage(message), {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: false,
      opacity: 1,
    });
  };

  showWithGravity = (
    message: any,
    gravity: 'top' | 'bottom' | 'center',
    keyboardAvoid: boolean = false,
    atRoot: boolean = true,
  ) => {
    if (typeof message !== 'string') return;
    Keyboard.dismiss();
    return Toast.show(this._getRealMessage(message), {
      duration: Toast.durations.LONG,
      position:
        gravity == 'bottom'
          ? Toast.positions.BOTTOM
          : gravity == 'top'
          ? Toast.positions.TOP
          : Toast.positions.CENTER,
      shadow: false,
      opacity: 1,
    });
  };

  showError = (
    message: any,
    keyboardAvoid?: boolean = false,
    atRoot?: boolean = true,
    defaultMessage?: string,
  ) => {
    if (typeof message !== 'string') return;
    Keyboard.dismiss();
    const finalMessage = message !== UNKNOWN_ERROR ? message : defaultMessage;
    return finalMessage && Toast.show(this._getRealMessage(finalMessage), {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: false,
      opacity: 1,
    });
  };

  simpleShow = (
    message: any,
    keyboardAvoid: boolean = false,
    atRoot: boolean = true,
  ) => {
    if (typeof message !== 'string') return;
    Keyboard.dismiss();
    return SimpleToast.show(this._getRealMessage(message), SimpleToast.SHORT);
  };

  simpleShowWithGravity = (
    message: any,
    gravity: 'top' | 'bottom' | 'center',
    keyboardAvoid: boolean = false,
    atRoot: boolean = true,
  ) => {
    if (typeof message !== 'string') return;
    Keyboard.dismiss();
    return SimpleToast.showWithGravity(
      this._getRealMessage(message),
      SimpleToast.SHORT,
      gravity,
    );
  };

  simpleShowError = (
    message: any,
    keyboardAvoid: boolean = false,
    atRoot: boolean = true,
    defaultMessage: string,
  ) => {
    if (typeof message !== 'string') return;
    Keyboard.dismiss();
    const finalMessage = message !== UNKNOWN_ERROR ? message : defaultMessage;
    return SimpleToast.show(
      this._getRealMessage(finalMessage),
      SimpleToast.SHORT,
    );
  };
}

const ToastService = new ToastServiceClass();

export default ToastService;
