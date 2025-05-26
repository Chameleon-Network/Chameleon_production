import { CustomError, ErrorCode } from "@src/services/exception";

const NAME_PATTERN = /^[A-Za-z0-9]*$/;

export const replaceCommaText = ({
  text,
  keyboardType = 'decimal-pad',
}: {
  text: string;
  keyboardType?: string;
}) => {
  if (!text) return '';
  let newText = text;
  if (keyboardType === 'decimal-pad') {
    newText = newText.replace(/,/g, '.');
  }
  return newText;
};


export const validateName = (name: string, list: any[]) => {
  if (name.length === 0 || !NAME_PATTERN.test(name)) {
    throw new CustomError(ErrorCode.invalid_master_key_name);
  }

  const existed = list.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (existed) {
    throw new CustomError(ErrorCode.master_key_name_existed);
  }
};

export const validateMnemonicWithOtherKeys = (mnemonic: any, list: any[]) => {
  if (mnemonic.length === 0) {
    throw new CustomError(ErrorCode.invalid_mnemonic);
  }

  const existed = list.find(item => item.mnemonic === mnemonic);

  if (existed) {
    throw new CustomError(ErrorCode.duplicate_mnemonic);
  }
};

