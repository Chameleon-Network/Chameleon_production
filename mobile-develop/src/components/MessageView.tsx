import React, {memo} from 'react';
import styled from 'styled-components/native';
import {ViewProps} from 'react-native';
import {COLORS} from '@src/styles';
import {styledValue} from '@src/theme';

export type MessageViewType = 'default' | 'success' | 'error';

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text<{type: MessageViewType}>`
  font-size: 20px;
  color: ${p => {
    if (p.type === 'success') {
      return COLORS.green;
    }
    if (p.type === 'error') {
      return COLORS.red;
    }

    return styledValue.grey1;
  }};
`;
const Description = styled.Text`
  margin-top: 4px;
  font-size: 14px;
  color: ${styledValue.grey3};
`;

export type MessageViewProps = {
  title: string;
  description?: string;
  type?: MessageViewType;
} & Partial<ViewProps>;
export const MessageView = memo(function MessageView({
  title,
  description,
  type = 'default',
  ...props
}: MessageViewProps) {
  return (
    <Wrapper {...props}>
      <Title type={type}>{title}</Title>
      <Description>{description}</Description>
    </Wrapper>
  );
});

export default MessageView;
