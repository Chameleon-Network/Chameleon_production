import React, {useCallback, useRef} from 'react';
import {Platform} from 'react-native';
import picker from 'react-native-image-picker';
import fileType from 'react-native-file-type';
import rnfs from 'react-native-fs';
import {ExHandler, CustomError, ErrorCode} from '@src/services/exception';
import {debounce} from 'lodash';
import ImagePicker from './ImagePicker';

interface File {
  name: string;
  type: string;
  size: number;
  uri: string;
  realPath?: string;
}

interface ImagePickerContainerProps {
  onPick: (file: File) => void;
  maxSize?: number | null;
  file?: File | null;
  [key: string]: any; // For other props that get passed to ImagePicker
}

const ImagePickerContainer = ({
  onPick,
  maxSize = null,
  file = null,
  ...props
}: ImagePickerContainerProps) => {
  const getRealPath = useCallback((file: File) => {
    return rnfs.DocumentDirectoryPath + `/${file.name}`;
  }, []);

  const handlePickRef = useRef(
    debounce(async () => {
      try {
        return await new Promise((resolve, reject) => {
          const options = {
            title: 'Select Image',
            takePhotoButtonTitle: null,
            mediaType: 'photo',
          };

          picker.launchImageLibrary(options, async (response: any) => {
            try {
              if (response.didCancel) {
                // console.log('User cancelled image picker');
              } else if (response.error) {
                return reject(response.error);
              } else {
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                if (!response.uri) {
                  return reject(new Error('File is not selected'));
                }

                if (!response.type) {
                  const typeInfo = await fileType(response.path);
                  response.type = typeInfo?.mime;
                }

                /**
                 * this lib "react-native-image-picker" is not working well on iOS, can only detect jpg format, otherwise format will fallback to jpg too!
                 */
                if (Platform.OS === 'ios') {
                  const dotIndex = response?.fileName?.lastIndexOf('.') || 0;
                  const mime = response?.fileName?.substring(dotIndex + 1);

                  response.type = mime ? `image/${mime}` : 'image/jpeg';
                }

                const newFile: File = {
                  name: response.fileName,
                  type: response.type,
                  size: response.fileSize,
                  uri: response.uri,
                };

                const realPath = getRealPath(newFile);

                newFile.realPath = realPath;

                if (maxSize && newFile.size > maxSize) {
                  return reject(
                    new CustomError(ErrorCode.document_picker_oversize),
                  );
                }

                if (typeof onPick === 'function') {
                  onPick(newFile);
                }

                resolve(newFile);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      } catch (e) {
        new ExHandler(e, 'Sorry, we can not use this file.').showErrorToast();
      }
    }, 300),
  ).current;

  return <ImagePicker {...props} onPick={handlePickRef} file={file} />;
};

export default ImagePickerContainer;
