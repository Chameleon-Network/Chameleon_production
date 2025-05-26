import {Text} from '../core';
import {styled} from './Token.styled';

export const Follow = props => {
  const {shouldShowFollowed, isFollowed} = props;
  if (!shouldShowFollowed) {
    return null;
  }
  if (isFollowed) {
    return <Text style={styled.followText}>Added</Text>;
  }
  return null;
};
