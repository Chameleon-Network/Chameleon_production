import BtnInfo from '../Button/BtnInfo';
import {View} from '../core';
import {NormalText} from '../core/NormalText/NormalText';
import {TokenVerifiedIcon} from '../Icons';
import {styled} from './Token.styled';

interface INameProps {
  name: string;
  isVerified: boolean;
  tokenId: string;
  shouldShowInfo: boolean;
  styledContainerName: any;
  styledName: any;
}

export const Name = (props: INameProps) => {
  const {
    name = 'Incognito Token',
    isVerified = false,
    tokenId = null,
    shouldShowInfo = false,
  } = props;
  return (
    <View style={[styled.name, props?.styledContainerName]}>
      <NormalText text={name} style={[styled.boldText, props?.styledName]} />
      {isVerified && <TokenVerifiedIcon />}
      {shouldShowInfo && <BtnInfo tokenId={tokenId || ''} />}
    </View>
  );
};
